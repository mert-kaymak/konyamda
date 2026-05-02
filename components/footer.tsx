"use client"

import { useState } from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const links = {
  kesfet: [
    { href: "/deneyimler", label: "Tüm Deneyimler" },
    { href: "/deneyimler?kategori=kultur-tarih", label: "Kültür & Tarih" },
    { href: "/deneyimler?kategori=konya-mutfagi", label: "Konya Mutfağı" },
    { href: "/organizator", label: "Organizatör Ol" },
  ],
  hesap: [
    { href: "/login", label: "Giriş Yap" },
    { href: "/register", label: "Kayıt Ol" },
    { href: "/dashboard", label: "Panelim" },
  ],
  sirket: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/gizlilik", label: "Gizlilik Politikası" },
  ],
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.76c.3.17.65.25 1.02.23l12.6-12.6-2.97-2.97L3.18 23.76z" />
      <path d="M20.82 10.22 17.5 8.33l-3.33 3.06 3.33 3.33 3.35-1.92a1.6 1.6 0 0 0 0-2.58z" />
      <path d="M2.5 2.07C2.19 2.38 2 2.84 2 3.41v17.18c0 .57.19 1.03.5 1.34l.07.07 9.62-9.62v-.23L2.57 2l-.07.07z" />
      <path d="M13.83 11.39 3.52 1.07A1.5 1.5 0 0 0 2.5 1.4l11.33 9.99-1 1z" />
    </svg>
  )
}

function AppStoreIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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

export default function Footer() {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <footer className="bg-gray-900 text-white">
      {showPopup && <ComingSoonPopup onClose={() => setShowPopup(false)} />}

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold text-[#f0c4c8]">
              konyamda
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Konya&apos;nın benzersiz deneyimlerini keşfedin. Yerel
              organizatörlerle unutulmaz anlar biriktirin.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/konyamda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-[#E1306C] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-[#414141] hover:text-white transition-colors"
                aria-label="Google Play Store"
              >
                <GooglePlayIcon />
              </button>
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-[#0D96F6] hover:text-white transition-colors"
                aria-label="App Store"
              >
                <AppStoreIcon />
              </button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Keşfet
            </h4>
            <ul className="space-y-2.5">
              {links.kesfet.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Hesabım
            </h4>
            <ul className="space-y-2.5">
              {links.hesap.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Şirket
            </h4>
            <ul className="space-y-2.5">
              {links.sirket.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 konyamda. Tüm hakları saklıdır.</p>
          <p>Konya&apos;nın kalbinden, dünyaya.</p>
        </div>
      </div>
    </footer>
  )
}
