"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  LayoutGrid,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  PlusCircle,
  Trash2,
  User,
  X,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceType = "kişi" | "grup" | "etkinlik"
type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"
type Tab = "deneyimlerim" | "yeni" | "rezervasyonlar" | "profil"

interface ExperienceRow {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  category_id: string | null
  organizer_id: string
  price: number
  price_type: PriceType
  duration_minutes: number
  max_participants: number
  location: string | null
  address: string | null
  images: string[]
  is_featured: boolean
  is_active: boolean
  created_at: string
}

interface CategoryRow {
  id: string
  name: string
  slug: string
}

interface BookingRow {
  id: string
  experience_id: string
  participant_count: number
  booking_date: string
  total_price: number
  status: BookingStatus
  created_at: string
  profiles: { full_name: string | null } | null
  experiences: { title: string } | null
}

interface ProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  bio: string | null
  is_organizer: boolean
}

interface Props {
  profile: ProfileRow
  initialExperiences: ExperienceRow[]
  categories: CategoryRow[]
  initialBookings: BookingRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() +
    "-" +
    Date.now()
  )
}

const BOOKING_STATUS: Record<BookingStatus, { label: string; className: string }> = {
  pending:   { label: "Bekliyor",    className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Onaylandı",  className: "bg-green-100  text-green-800"  },
  cancelled: { label: "İptal",       className: "bg-red-100    text-red-800"    },
  completed: { label: "Tamamlandı", className: "bg-gray-100   text-gray-700"   },
}

const EMPTY_FORM = {
  title: "",
  short_description: "",
  description: "",
  category_id: "",
  price: "",
  price_type: "kişi" as PriceType,
  duration_minutes: "60",
  max_participants: "10",
  location: "",
  address: "",
  is_active: true,
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#7B2D35]/10 text-[#7B2D35]"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrganizatorDashboard({
  profile,
  initialExperiences,
  categories,
  initialBookings,
}: Props) {
  const router = useRouter()

  // Tab
  const [activeTab, setActiveTab] = useState<Tab>("deneyimlerim")

  // Data state
  const [experiences, setExperiences] = useState<ExperienceRow[]>(initialExperiences)
  const [bookings] = useState<BookingRow[]>(initialBookings)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState<string[]>([""])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Booking count per experience
  const bookingCount = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of bookings) {
      counts[b.experience_id] = (counts[b.experience_id] ?? 0) + 1
    }
    return counts
  }, [bookings])

  // Category name lookup
  const categoryName = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of categories) map[c.id] = c.name
    return map
  }, [categories])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function switchTab(tab: Tab) {
    if (tab !== "yeni") {
      resetForm()
    }
    setActiveTab(tab)
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImages([""])
    setFormError(null)
    setFormSuccess(false)
  }

  function handleEdit(exp: ExperienceRow) {
    setEditingId(exp.id)
    setForm({
      title: exp.title,
      short_description: exp.short_description ?? "",
      description: exp.description ?? "",
      category_id: exp.category_id ?? "",
      price: String(exp.price),
      price_type: exp.price_type,
      duration_minutes: String(exp.duration_minutes),
      max_participants: String(exp.max_participants),
      location: exp.location ?? "",
      address: exp.address ?? "",
      is_active: exp.is_active,
    })
    setImages(exp.images.length > 0 ? [...exp.images] : [""])
    setFormError(null)
    setFormSuccess(false)
    setActiveTab("yeni")
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setFormError("Başlık zorunludur.")
      return
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      setFormError("Geçerli bir fiyat girin.")
      return
    }

    setSaving(true)
    setFormError(null)

    const supabase = createClient()
    const payload = {
      title: form.title.trim(),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      price: parseFloat(form.price),
      price_type: form.price_type,
      duration_minutes: parseInt(form.duration_minutes) || 60,
      max_participants: parseInt(form.max_participants) || 10,
      location: form.location.trim() || null,
      address: form.address.trim() || null,
      images: images.filter((u) => u.trim() !== ""),
      is_active: form.is_active,
    }

    if (editingId) {
      const { data, error } = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single()

      if (error) {
        setFormError("Güncelleme başarısız oldu.")
        setSaving(false)
        return
      }
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingId ? (data as ExperienceRow) : e))
      )
    } else {
      const { data, error } = await supabase
        .from("experiences")
        .insert({ ...payload, slug: toSlug(form.title), organizer_id: profile.id })
        .select()
        .single()

      if (error) {
        setFormError("Deneyim eklenemedi.")
        setSaving(false)
        return
      }
      setExperiences((prev) => [data as ExperienceRow, ...prev])
    }

    setFormSuccess(true)
    setSaving(false)
    setTimeout(() => {
      resetForm()
      setActiveTab("deneyimlerim")
    }, 1200)
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from("experiences").delete().eq("id", id)

    if (!error) {
      setExperiences((prev) => prev.filter((e) => e.id !== id))
    }
    setDeleteConfirmId(null)
    setDeleting(false)
  }

  async function handleProfileSave() {
    setProfileSaving(true)
    setProfileSuccess(false)
    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({
        full_name: profileForm.full_name.trim() || null,
        phone: profileForm.phone.trim() || null,
        bio: profileForm.bio.trim() || null,
      })
      .eq("id", profile.id)

    setProfileSaving(false)
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "deneyimlerim",  icon: LayoutGrid,  label: "Deneyimlerim" },
    { id: "yeni",          icon: PlusCircle,  label: "Yeni Deneyim Ekle" },
    { id: "rezervasyonlar",icon: CalendarDays, label: "Rezervasyonlar" },
    { id: "profil",        icon: User,        label: "Profil" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white">
        <div className="px-4 py-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-[#7B2D35]">
            KonyamDa
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">Organizatör Paneli</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => switchTab(item.id)}
            />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Nav ── */}
      <div className="fixed top-0 left-0 right-0 z-10 flex lg:hidden border-b border-gray-200 bg-white overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => switchTab(item.id)}
            className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === item.id
                ? "border-[#7B2D35] text-[#7B2D35]"
                : "border-transparent text-gray-500"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 pt-12 lg:pt-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ── Deneyimlerim ── */}
          {activeTab === "deneyimlerim" && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Deneyimlerim</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {experiences.length} deneyim
                  </p>
                </div>
                <Button
                  onClick={() => switchTab("yeni")}
                  className="bg-[#7B2D35] hover:bg-[#6a2630] text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Ekle
                </Button>
              </div>

              {experiences.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Henüz deneyim eklemediniz.</p>
                    <Button
                      onClick={() => switchTab("yeni")}
                      className="mt-4 bg-[#7B2D35] hover:bg-[#6a2630] text-white"
                    >
                      İlk Deneyimi Ekle
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Başlık</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Kategori</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Fiyat</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Durum</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Rezervasyon</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {experiences.map((exp) => (
                          <>
                            <tr key={exp.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900 max-w-[200px] truncate">
                                  {exp.title}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {exp.category_id ? (categoryName[exp.category_id] ?? "—") : "—"}
                              </td>
                              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                ₺{exp.price.toLocaleString("tr-TR")}{" "}
                                <span className="text-gray-400 text-xs">/ {exp.price_type}</span>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={
                                    exp.is_active
                                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                                      : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                                  }
                                >
                                  {exp.is_active ? "Aktif" : "Pasif"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-gray-700">
                                {bookingCount[exp.id] ?? 0}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1.5"
                                    onClick={() => handleEdit(exp)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Düzenle
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                                    onClick={() => setDeleteConfirmId(exp.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Sil
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            {deleteConfirmId === exp.id && (
                              <tr key={`${exp.id}-confirm`} className="bg-red-50">
                                <td colSpan={6} className="px-4 py-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-red-700">
                                      <strong>&quot;{exp.title}&quot;</strong> silinecek. Emin misiniz?
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7"
                                        onClick={() => setDeleteConfirmId(null)}
                                      >
                                        İptal
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-7 bg-red-600 hover:bg-red-700 text-white"
                                        disabled={deleting}
                                        onClick={() => handleDelete(exp.id)}
                                      >
                                        {deleting ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          "Evet, Sil"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Yeni Deneyim / Düzenleme Formu ── */}
          {activeTab === "yeni" && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"}
                </h1>
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setActiveTab("deneyimlerim")
                    }}
                  >
                    İptal
                  </Button>
                )}
              </div>

              <Card>
                <CardContent className="pt-6 space-y-6">
                  {formError && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {editingId ? "Deneyim güncellendi!" : "Deneyim eklendi!"}
                    </div>
                  )}

                  {/* Başlık */}
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Başlık *</Label>
                    <Input
                      id="title"
                      placeholder="Deneyim başlığı"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  {/* Kısa Açıklama */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="short_desc">Kısa Açıklama</Label>
                      <span className="text-xs text-gray-400">
                        {form.short_description.length}/150
                      </span>
                    </div>
                    <textarea
                      id="short_desc"
                      rows={2}
                      maxLength={150}
                      placeholder="Listeleme sayfasında görünen kısa tanıtım"
                      value={form.short_description}
                      onChange={(e) =>
                        setForm({ ...form, short_description: e.target.value })
                      }
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  {/* Uzun Açıklama */}
                  <div className="space-y-1.5">
                    <Label htmlFor="desc">Uzun Açıklama</Label>
                    <textarea
                      id="desc"
                      rows={5}
                      placeholder="Deneyimin detaylı açıklaması"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Separator />

                  {/* Kategori + Fiyat Tipi */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Kategori</Label>
                      <Select
                        value={form.category_id}
                        onValueChange={(v) =>
                          setForm({ ...form, category_id: v === "__none__" ? "" : v })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Kategori yok</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Fiyat Tipi</Label>
                      <Select
                        value={form.price_type}
                        onValueChange={(v) =>
                          setForm({ ...form, price_type: v as PriceType })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kişi">Kişi başı</SelectItem>
                          <SelectItem value="grup">Grup</SelectItem>
                          <SelectItem value="etkinlik">Etkinlik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Fiyat + Süre */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="price">Fiyat (₺) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="duration">Süre (dakika)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="15"
                        step="15"
                        placeholder="60"
                        value={form.duration_minutes}
                        onChange={(e) =>
                          setForm({ ...form, duration_minutes: e.target.value })
                        }
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Max Katılımcı + Konum */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="max">Maks. Katılımcı</Label>
                      <Input
                        id="max"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={form.max_participants}
                        onChange={(e) =>
                          setForm({ ...form, max_participants: e.target.value })
                        }
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="location">Konum</Label>
                      <Input
                        id="location"
                        placeholder="ör. Karatay, Konya"
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Adres */}
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      id="address"
                      placeholder="Tam adres"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  <Separator />

                  {/* Resim URL'leri */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Resim URL&apos;leri</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => setImages((prev) => [...prev, ""])}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Resim Ekle
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {images.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            type="url"
                            placeholder="https://example.com/resim.jpg"
                            value={url}
                            onChange={(e) => {
                              const next = [...images]
                              next[i] = e.target.value
                              setImages(next)
                            }}
                            className="h-10"
                          />
                          {images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 shrink-0"
                              onClick={() =>
                                setImages((prev) => prev.filter((_, j) => j !== i))
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Durum */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Yayın Durumu</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Pasif deneyimler listeleme sayfasında görünmez.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        form.is_active ? "bg-[#7B2D35]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          form.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingId ? (
                      "Değişiklikleri Kaydet"
                    ) : (
                      "Deneyimi Kaydet"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

          {/* ── Rezervasyonlar ── */}
          {activeTab === "rezervasyonlar" && (
            <section>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {bookings.length} rezervasyon
                </p>
              </div>

              {bookings.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Henüz rezervasyon yok.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Deneyim</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Katılımcı</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Tarih</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Kişi</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Toplam</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Durum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b) => {
                          const st = BOOKING_STATUS[b.status] ?? BOOKING_STATUS.pending
                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                                {b.experiences?.title ?? "—"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {b.profiles?.full_name ?? "—"}
                              </td>
                              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {new Date(b.booking_date).toLocaleDateString("tr-TR")}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {b.participant_count}
                              </td>
                              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                ₺{b.total_price.toLocaleString("tr-TR")}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.className}`}
                                >
                                  {st.label}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Profil ── */}
          {activeTab === "profil" && (
            <section>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil</h1>

              <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base">Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileSuccess && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Profil güncellendi.
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="prof_name">Ad Soyad</Label>
                    <Input
                      id="prof_name"
                      placeholder="Adınız Soyadınız"
                      value={profileForm.full_name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, full_name: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof_phone">Telefon</Label>
                    <Input
                      id="prof_phone"
                      type="tel"
                      placeholder="0555 000 00 00"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof_bio">Hakkımda</Label>
                    <textarea
                      id="prof_bio"
                      rows={4}
                      placeholder="Kendinizi kısaca tanıtın"
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
                  >
                    {profileSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Profili Kaydet"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

        </div>
      </main>
    </div>
  )
}
