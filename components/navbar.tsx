"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, LogOut, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.76c.3.17.65.25 1.02.23l12.6-12.6-2.97-2.97L3.18 23.76z" />
      <path d="M20.82 10.22 17.5 8.33l-3.33 3.06 3.33 3.33 3.35-1.92a1.6 1.6 0 0 0 0-2.58z" />
      <path d="M2.5 2.07C2.19 2.38 2 2.84 2 3.41v17.18c0 .57.19 1.03.5 1.34l.07.07 9.62-9.62v-.23L2.57 2l-.07.07z" />
      <path d="M13.83 11.39 3.52 1.07A1.5 1.5 0 0 0 2.5 1.4l11.33 9.99-1 1z" />
    </svg>
  )
}

function AppStoreIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function ComingSoonPopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-xs mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">📱</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Yakında hizmetinizde!</h3>
        <p className="text-sm text-gray-500 mb-6">konyamda mobil uygulaması çok yakında App Store ve Google Play&apos;de.</p>
        <button
          onClick={onClose}
          className="w-full bg-[#7B2D35] hover:bg-[#6a2630] text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          Tamam
        </button>
      </div>
    </div>
  )
}

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/deneyimler", label: "Deneyimler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isOrganizer, setIsOrganizer] = useState(false)
  const [ready, setReady] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadUser(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("is_organizer")
        .eq("id", userId)
        .single()
      setIsOrganizer(data?.is_organizer ?? false)
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadUser(user.id)
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUser(session.user.id)
      } else {
        setIsOrganizer(false)
      }
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    ""

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {showPopup && <ComingSoonPopup onClose={() => setShowPopup(false)} />}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#7B2D35]">
          <Image src="/logo.png" alt="konyamda" width={36} height={36} className="object-contain" />
          konyamda
        </Link>

        {/* Desktop Nav — ortada */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-[#7B2D35] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop — sağ taraf */}
        <div className="hidden md:flex items-center gap-2 justify-end">
          <a
            href="https://www.instagram.com/konyamda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:text-[#E1306C] hover:bg-pink-50 transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Google Play Store"
          >
            <GooglePlayIcon />
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:text-[#0D96F6] hover:bg-blue-50 transition-colors"
            aria-label="App Store"
          >
            <AppStoreIcon />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          {ready && (
            user ? (
              <>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                  {displayName}
                </span>
                {isOrganizer && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-[#7B2D35] hover:bg-[#7B2D35]/10"
                  >
                    <Link href="/organizator">
                      <LayoutDashboard className="h-4 w-4 mr-1.5" />
                      Organizatör
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-[#7B2D35]"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Panelim
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-[#7B2D35]"
                >
                  <Link href="/login">Giriş Yap</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#7B2D35] hover:bg-[#6a2630] text-white rounded-lg"
                >
                  <Link href="/register">Kayıt Ol</Link>
                </Button>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <Link
                  href="/"
                  className="text-xl font-bold text-[#7B2D35]"
                  onClick={() => setOpen(false)}
                >
                  konyamda
                </Link>
              </div>

              <nav className="flex flex-col p-6 gap-1 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 text-base font-medium text-gray-700 hover:text-[#7B2D35] hover:bg-[#7B2D35]/5 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {ready && user && isOrganizer && (
                  <Link
                    href="/organizator"
                    className="px-3 py-2.5 text-base font-medium text-[#7B2D35] hover:bg-[#7B2D35]/5 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Organizatör Paneli
                  </Link>
                )}
                {ready && user && (
                  <Link
                    href="/dashboard"
                    className="px-3 py-2.5 text-base font-medium text-gray-700 hover:text-[#7B2D35] hover:bg-[#7B2D35]/5 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Panelim
                  </Link>
                )}
              </nav>

              <div className="px-6 pt-4 pb-2 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <a
                    href="https://www.instagram.com/konyamda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-[#E1306C] transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <button
                    onClick={() => { setShowPopup(true); setOpen(false) }}
                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    aria-label="Google Play Store"
                  >
                    <GooglePlayIcon />
                  </button>
                  <button
                    onClick={() => { setShowPopup(true); setOpen(false) }}
                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-[#0D96F6] transition-colors"
                    aria-label="App Store"
                  >
                    <AppStoreIcon />
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-3">
                {ready && (
                  user ? (
                    <>
                      <p className="text-sm text-gray-500 text-center truncate">{user.email}</p>
                      <Button
                        variant="outline"
                        className="border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="border-[#7B2D35] text-[#7B2D35]"
                      >
                        <Link href="/login" onClick={() => setOpen(false)}>Giriş Yap</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-[#7B2D35] hover:bg-[#6a2630] text-white"
                      >
                        <Link href="/register" onClick={() => setOpen(false)}>Kayıt Ol</Link>
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
