import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Camera,
  Clock,
  Landmark,
  MapPin,
  Mountain,
  Palette,
  Search,
  Star,
  UtensilsCrossed,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const categories: { icon: LucideIcon; label: string; slug: string }[] = [
  { icon: UtensilsCrossed, label: "Yemek & Mutfak", slug: "yemek-mutfak" },
  { icon: Camera, label: "Fotoğrafçılık & Sanat", slug: "fotografcilik-sanat" },
  { icon: Palette, label: "Sanat & El Sanatları", slug: "sanat-el-sanatlari" },
  { icon: Mountain, label: "Doğa & Macera", slug: "doga-macera" },
  { icon: Landmark, label: "Kültür & Tarih", slug: "kultur-tarih" },
]

const featured = [
  {
    id: "1",
    slug: "mevlana-muzesi-gece-turu-sema",
    title: "Mevlana Müzesi Gece Turu + Sema",
    location: "Karatay, Konya",
    price: 400,
    rating: 5.0,
    reviews: 97,
    duration: "3 saat",
    maxParticipants: "Max 12 kişi",
    category: "Kültür & Tarih",
    badge: "Çok Sevilen",
    image: "https://images.pexels.com/photos/36919394/pexels-photo-36919394.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    slug: "etli-ekmek-yapim-atolyesi",
    title: "Etli Ekmek Yapım Atölyesi",
    location: "Selçuklu, Konya",
    price: 280,
    rating: 4.9,
    reviews: 142,
    duration: "3 saat",
    maxParticipants: "Max 10 kişi",
    category: "Yemek & Mutfak",
    badge: "Öne Çıkan",
    image: "https://images.pexels.com/photos/37290076/pexels-photo-37290076.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    slug: "beysehir-golu-gun-batimi-teknesi",
    title: "Beyşehir Gölü Gün Batımı Teknesi",
    location: "Beyşehir, Konya",
    price: 450,
    rating: 4.9,
    reviews: 103,
    duration: "3 saat",
    maxParticipants: "Max 15 kişi",
    category: "Doğa & Macera",
    badge: "Öne Çıkan",
    image: "https://images.pexels.com/photos/19046796/pexels-photo-19046796.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
]

const stats = [
  { value: "50+", label: "Deneyim" },
  { value: "20+", label: "Organizatör" },
  { value: "500+", label: "Mutlu Katılımcı" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative bg-[#7B2D35] text-white py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
            <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-white/5" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/25 text-sm px-4 py-1.5">
              Konya&apos;da Yeni Deneyimler Sizi Bekliyor
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
              Konya&apos;nın En Güzel
              <br />
              <span className="text-[#f0c4c8]">Deneyimlerini</span> Keşfet
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
              Atölyeler, turlar ve aktivitelerle unutulmaz anılar biriktir
            </p>

            <form
              action="/deneyimler"
              method="GET"
              className="flex gap-3 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  name="q"
                  placeholder="Ne denemek istiyorsunuz?"
                  className="pl-12 h-14 text-base bg-white text-gray-900 border-0 shadow-xl rounded-lg focus-visible:ring-[#f0c4c8]"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-[#f0c4c8] hover:bg-[#e8b0b5] text-[#7B2D35] font-semibold rounded-lg shadow-xl shrink-0"
              >
                Ara
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-white/60">
              <span>Popüler:</span>
              {["Etli Ekmek Atölyesi", "Sille Turu", "Beyşehir Gölü", "Çini Boyama", "Doğa Yürüyüşü", "Sema Turu"].map((t) => (
                <Link
                  key={t}
                  href={`/deneyimler?q=${encodeURIComponent(t)}`}
                  className="hover:text-white underline underline-offset-2 transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── KATEGORİLER ──────────────────────────────────── */}
        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                Kategorilere Göz At
              </h2>
              <p className="text-gray-500 mt-2">İlgi alanınıza göre deneyim bulun</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/deneyimler?kategori=${cat.slug}`}
                  className="flex-shrink-0 snap-start"
                >
                  <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-[#7B2D35]/40 hover:-translate-y-1 transition-all w-36 group cursor-pointer">
                    <cat.icon className="h-6 w-6 text-[#7B2D35]" />
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-[#7B2D35] transition-colors">
                      {cat.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── ÖNE ÇIKAN DENEYİMLER ─────────────────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                  Öne Çıkan Deneyimler
                </h2>
                <p className="text-gray-500 mt-1">En çok tercih edilen deneyimler</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white transition-colors"
              >
                <Link href="/deneyimler">Tümünü Gör →</Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((exp) => (
                <Card
                  key={exp.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-gray-200 rounded-lg relative cursor-pointer"
                >
                  <Link
                    href={`/deneyimler/${exp.slug}`}
                    className="absolute inset-0 z-0"
                    aria-label={exp.title}
                  />
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                        {exp.badge}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                        {exp.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-semibold text-[#1a1a1a] text-[15px] leading-snug mb-3 group-hover:text-[#7B2D35] transition-colors">
                      {exp.title}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {exp.maxParticipants}
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                          <Star className="h-4 w-4 fill-amber-500" />
                          {exp.rating}
                          <span className="text-gray-400 font-normal">
                            ({exp.reviews} yorum)
                          </span>
                        </span>
                        <p className="text-xl font-bold text-[#1a1a1a] mt-0.5">
                          ₺{exp.price}
                          <span className="text-sm font-normal text-gray-500"> / kişi</span>
                        </p>
                      </div>
                      <Link
                        href={`/deneyimler/${exp.slug}`}
                        className="relative z-10 inline-flex items-center justify-center rounded-lg bg-[#7B2D35] hover:bg-[#6a2630] px-3 py-1.5 text-sm font-medium text-white transition-colors"
                      >
                        Rezerve Et
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button
                asChild
                variant="outline"
                className="border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white"
              >
                <Link href="/deneyimler">Tüm Deneyimleri Gör →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────── */}
        <section className="py-20 bg-[#7B2D35] text-white">
          <div className="container mx-auto px-4">
            <p className="text-center text-[#f0c4c8]/70 text-sm font-medium uppercase tracking-widest mb-10">
              Rakamlarla konyamda
            </p>
            <div className="grid grid-cols-3 gap-6 md:gap-12 text-center max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl md:text-5xl font-bold text-[#f0c4c8]">
                    {stat.value}
                  </p>
                  <p className="text-base md:text-lg text-white/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
