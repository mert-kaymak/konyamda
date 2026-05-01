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

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/deneyimler", label: "Deneyimler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
        <div className="hidden md:flex items-center gap-2 min-w-[180px] justify-end">
          {ready && (
            user ? (
              <>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                  {displayName}
                </span>
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

              <div className="p-6 border-t flex flex-col gap-3">
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
