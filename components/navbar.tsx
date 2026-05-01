"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/deneyimler", label: "Deneyimler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#7B2D35]">
          KonyamDa
        </Link>

        {/* Desktop Nav - ortada */}
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-[#7B2D35]">
            <Link href="/login">Giriş Yap</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#7B2D35] hover:bg-[#6a2630] text-white rounded-lg">
            <Link href="/register">Kayıt Ol</Link>
          </Button>
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
                  KonyamDa
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
              </nav>
              <div className="p-6 border-t flex flex-col gap-3">
                <Button asChild variant="outline" className="border-[#7B2D35] text-[#7B2D35]">
                  <Link href="/login" onClick={() => setOpen(false)}>Giriş Yap</Link>
                </Button>
                <Button asChild className="bg-[#7B2D35] hover:bg-[#6a2630] text-white">
                  <Link href="/register" onClick={() => setOpen(false)}>Kayıt Ol</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
