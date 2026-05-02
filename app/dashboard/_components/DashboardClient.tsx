"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  LogOut,
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

interface Booking {
  id: string
  experience_id: string
  participant_count: number
  booking_date: string
  total_price: number
  status: BookingStatus
  created_at: string
}

// ─── Experience UUID → İsim eşlemesi ─────────────────────────────────────────

const EXPERIENCE_TITLES: Record<string, string> = {
  "f47ac10b-58cc-4372-a567-0e02b2c3d001": "Etli Ekmek Yapım Atölyesi",
  "f47ac10b-58cc-4372-a567-0e02b2c3d002": "Sille Köyü Fotoğraf Turu",
  "f47ac10b-58cc-4372-a567-0e02b2c3d003": "Geleneksel Çini Boyama Atölyesi",
  "f47ac10b-58cc-4372-a567-0e02b2c3d004": "Beyşehir Gölü Gün Batımı Teknesi",
  "f47ac10b-58cc-4372-a567-0e02b2c3d005": "Leylekler Vadisi Doğa Yürüyüşü",
  "f47ac10b-58cc-4372-a567-0e02b2c3d006": "Mevlana Müzesi Gece Turu + Sema",
}

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
    return fullName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
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
  },
  confirmed: {
    label: "Onaylandı",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  completed: {
    label: "Tamamlandı",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
}

// ─── Reservation Card ─────────────────────────────────────────────────────────

function ReservationCard({ booking }: { booking: Booking }) {
  const st = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending
  const title = EXPERIENCE_TITLES[booking.experience_id] ?? "Deneyim"

  return (
    <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-1 rounded-full shrink-0 bg-[#7B2D35]" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{title}</h3>
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
            {formatDate(booking.booking_date)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {booking.participant_count} kişi
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-bold text-gray-900">
          ₺{Number(booking.total_price).toLocaleString("tr-TR")}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">toplam</p>
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function BookingSection({ status, bookings }: { status: BookingStatus; bookings: Booking[] }) {
  const st = STATUS_CONFIG[status]
  if (bookings.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2 w-2 rounded-full ${st.dot}`} />
        <h2 className="text-sm font-semibold text-gray-700">{st.label}</h2>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {bookings.length}
        </span>
      </div>
      <div className="space-y-3">
        {bookings.map((b) => <ReservationCard key={b.id} booking={b} />)}
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

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

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

  // Supabase'den gerçek rezervasyonları çek
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("bookings")
      .select("id, experience_id, participant_count, booking_date, total_price, status, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setBookings(data as Booking[])
        setBookingsLoading(false)
      })
  }, [profile.id])

  const pending   = bookings.filter((b) => b.status === "pending")
  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const completed = bookings.filter((b) => b.status === "completed")

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
          <Link href="/" className="text-xl font-bold text-[#7B2D35]">konyamda</Link>
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
            {bookingsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#7B2D35]" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20">
                <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Henüz rezervasyonunuz yok.</p>
                <Button asChild className="mt-4 bg-[#7B2D35] hover:bg-[#6a2630] text-white">
                  <Link href="/deneyimler">Deneyimleri Keşfet</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Özet kartlar */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Bekleyen",   count: pending.length,   color: "text-yellow-600", bg: "bg-yellow-50" },
                    { label: "Onaylanan",  count: confirmed.length, color: "text-green-600",  bg: "bg-green-50"  },
                    { label: "Tamamlanan", count: completed.length, color: "text-gray-600",   bg: "bg-gray-100"  },
                  ].map((s) => (
                    <Card key={s.label} className={`${s.bg} border-0 shadow-none`}>
                      <CardContent className="p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <BookingSection status="pending"   bookings={pending}   />
                <BookingSection status="confirmed" bookings={confirmed} />
                <BookingSection status="completed" bookings={completed} />
              </>
            )}
          </div>
        )}

        {/* ── Profil ── */}
        {activeTab === "profil" && (
          <div className="max-w-lg">
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
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
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
                <p className="text-xs text-gray-400">E-posta adresi değiştirilemez.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555 000 00 00"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="h-11"
                />
              </div>

              <Button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
              >
                {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Değişiklikleri Kaydet"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
