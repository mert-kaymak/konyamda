"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  LogOut,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "pending" | "confirmed" | "completed"
type Tab = "rezervasyonlar" | "profil"

interface ProfileRow {
  id: string
  full_name: string | null
  phone: string | null
  bio: string | null
  avatar_url: string | null
  is_organizer: boolean
}

interface MockBooking {
  id: string
  experience: string
  category: string
  location: string
  date: string
  duration: string
  participants: number
  total: number
  status: BookingStatus
  color: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BOOKINGS: MockBooking[] = [
  // Bekleyen
  {
    id: "b1",
    experience: "Mevlana Müzesi Özel Rehberli Tur",
    category: "Kültür & Tarih",
    location: "Karatay, Konya",
    date: "2026-05-10",
    duration: "2 saat",
    participants: 2,
    total: 700,
    status: "pending",
    color: "#7B2D35",
  },
  {
    id: "b2",
    experience: "Etli Ekmek Yapım Atölyesi",
    category: "Konya Mutfağı",
    location: "Selçuklu, Konya",
    date: "2026-05-15",
    duration: "3 saat",
    participants: 4,
    total: 1120,
    status: "pending",
    color: "#b45309",
  },
  {
    id: "b3",
    experience: "Sille Köyü Fotoğraf Turu",
    category: "Gezi & Tur",
    location: "Sille, Konya",
    date: "2026-05-22",
    duration: "4 saat",
    participants: 1,
    total: 450,
    status: "pending",
    color: "#166534",
  },
  // Onaylanan
  {
    id: "b4",
    experience: "Sema Gösterisi (Mevlevi Ayini)",
    category: "Kültür & Tarih",
    location: "Mevlana Kültür Merkezi",
    date: "2026-05-03",
    duration: "1.5 saat",
    participants: 3,
    total: 750,
    status: "confirmed",
    color: "#7B2D35",
  },
  {
    id: "b5",
    experience: "Geleneksel Çömlek Yapımı Atölyesi",
    category: "El Sanatları",
    location: "Karatay, Konya",
    date: "2026-05-07",
    duration: "2.5 saat",
    participants: 2,
    total: 560,
    status: "confirmed",
    color: "#92400e",
  },
  // Tamamlanan
  {
    id: "b6",
    experience: "Karatay Medresesi Rehberli Tur",
    category: "Kültür & Tarih",
    location: "Karatay, Konya",
    date: "2026-03-15",
    duration: "2 saat",
    participants: 4,
    total: 1080,
    status: "completed",
    color: "#374151",
  },
  {
    id: "b7",
    experience: "Tarihi Kapalı Çarşı & Bedesten Turu",
    category: "Gezi & Tur",
    location: "Selçuklu, Konya",
    date: "2026-04-02",
    duration: "3 saat",
    participants: 3,
    total: 630,
    status: "completed",
    color: "#1d4ed8",
  },
  {
    id: "b8",
    experience: "Konya Gastronomik Yürüyüş Turu",
    category: "Konya Mutfağı",
    location: "Merkez, Konya",
    date: "2026-04-18",
    duration: "3.5 saat",
    participants: 2,
    total: 600,
    status: "completed",
    color: "#b45309",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getInitials(fullName: string | null, email: string) {
  if (fullName?.trim()) {
    return fullName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }
  return email[0].toUpperCase()
}

const STATUS_CONFIG = {
  pending: {
    label: "Bekliyor",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
    sectionBg: "bg-yellow-50/60",
    sectionBorder: "border-yellow-100",
  },
  confirmed: {
    label: "Onaylandı",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    sectionBg: "bg-green-50/60",
    sectionBorder: "border-green-100",
  },
  completed: {
    label: "Tamamlandı",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
    sectionBg: "bg-gray-50/60",
    sectionBorder: "border-gray-100",
  },
}

// ─── Reservation Card ─────────────────────────────────────────────────────────

function ReservationCard({ booking }: { booking: MockBooking }) {
  const st = STATUS_CONFIG[booking.status]
  return (
    <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Color accent */}
      <div
        className="w-1 rounded-full shrink-0"
        style={{ backgroundColor: booking.color }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {booking.experience}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${st.bg} ${st.text} ${st.border}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {booking.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {booking.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {booking.participants} kişi
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-base font-bold text-gray-900">
          ₺{booking.total.toLocaleString("tr-TR")}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">toplam</p>
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function BookingSection({
  status,
  bookings,
}: {
  status: BookingStatus
  bookings: MockBooking[]
}) {
  const st = STATUS_CONFIG[status]
  if (bookings.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2 w-2 rounded-full ${st.dot}`} />
        <h2 className="text-sm font-semibold text-gray-700">
          {st.label}
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {bookings.length}
        </span>
      </div>
      <div className="space-y-3">
        {bookings.map((b) => (
          <ReservationCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardClient({
  profile,
  email,
}: {
  profile: ProfileRow
  email: string
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("rezervasyonlar")

  // Profile form
  const [profileForm, setProfileForm] = useState({
    fullName: profile.full_name ?? "",
    phone: profile.phone ?? "",
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const initials = getInitials(profile.full_name, email)
  const displayName = profile.full_name?.trim() || email.split("@")[0]

  const pending   = MOCK_BOOKINGS.filter((b) => b.status === "pending")
  const confirmed = MOCK_BOOKINGS.filter((b) => b.status === "confirmed")
  const completed = MOCK_BOOKINGS.filter((b) => b.status === "completed")

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function handleProfileSave() {
    setProfileSaving(true)
    setProfileError(null)
    setProfileSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.fullName.trim() || null,
        phone: profileForm.phone.trim() || null,
      })
      .eq("id", profile.id)

    setProfileSaving(false)
    if (error) {
      setProfileError("Güncelleme başarısız oldu. Lütfen tekrar deneyin.")
    } else {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-[#7B2D35]">
            konyamda
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7B2D35] text-white text-sm font-semibold">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/deneyimler" className="cursor-pointer">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Deneyimleri Keşfet
                </Link>
              </DropdownMenuItem>
              {profile.is_organizer && (
                <DropdownMenuItem asChild>
                  <Link href="/organizator" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Organizatör Paneli
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="pt-6 pb-0">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              Hoş geldin, {profile.full_name?.split(" ")[0] ?? "kullanıcı"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Rezervasyonlarını takip et ve profilini düzenle.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(
              [
                { id: "rezervasyonlar", label: "Rezervasyonlarım" },
                { id: "profil",         label: "Profil" },
              ] as { id: Tab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#7B2D35] text-[#7B2D35]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">

        {/* ── Rezervasyonlarım ── */}
        {activeTab === "rezervasyonlar" && (
          <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Bekleyen",    count: pending.length,   color: "text-yellow-600", bg: "bg-yellow-50"  },
                { label: "Onaylanan",   count: confirmed.length, color: "text-green-600",  bg: "bg-green-50"   },
                { label: "Tamamlanan",  count: completed.length, color: "text-gray-600",   bg: "bg-gray-100"   },
              ].map((s) => (
                <Card key={s.label} className={`${s.bg} border-0 shadow-none`}>
                  <CardContent className="p-4 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sections */}
            <BookingSection status="pending"   bookings={pending}   />
            <BookingSection status="confirmed" bookings={confirmed} />
            <BookingSection status="completed" bookings={completed} />

            {MOCK_BOOKINGS.length === 0 && (
              <div className="text-center py-20">
                <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Henüz rezervasyonunuz yok.</p>
                <Button asChild className="mt-4 bg-[#7B2D35] hover:bg-[#6a2630] text-white">
                  <Link href="/deneyimler">Deneyimleri Keşfet</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Profil ── */}
        {activeTab === "profil" && (
          <div className="max-w-lg">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8 p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7B2D35] text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {profile.full_name || "İsimsiz Kullanıcı"}
                </p>
                <p className="text-sm text-gray-500">{email}</p>
                {profile.is_organizer && (
                  <span className="inline-flex mt-1 items-center rounded-full bg-[#7B2D35]/10 px-2.5 py-0.5 text-xs font-medium text-[#7B2D35]">
                    Organizatör
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">Kişisel Bilgiler</h2>

              {profileError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Profil başarıyla güncellendi.
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  placeholder="Adınız Soyadınız"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="h-11 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">
                  E-posta adresi değiştirilemez.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555 000 00 00"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="h-11"
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
                  "Değişiklikleri Kaydet"
                )}
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
