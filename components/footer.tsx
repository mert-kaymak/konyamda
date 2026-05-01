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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
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
          <p>© 2025 konyamda. Tüm hakları saklıdır.</p>
          <p>Konya&apos;nın kalbinden, dünyaya.</p>
        </div>
      </div>
    </footer>
  )
}
