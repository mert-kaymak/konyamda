"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Minus,
  Plus,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react"

// ─── Sabit Mock Veri ────────────────────────────────────────────────────
const EXPERIENCE = {
  slug: "mevlana-muzesi-ozel-rehberli-tur",
  title: "Mevlana Müzesi Özel Rehberli Tur",
  category: "Kültür & Tarih",
  location: "Karatay, Konya",
  price: 350,
  rating: 4.9,
  reviewCount: 128,
  duration: "2 saat",
  maxParticipants: 8,
  isFeatured: true,

  images: [
    { id: 1, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Müze Girişi" },
    { id: 2, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Türbe" },
    { id: 3, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Çini Köşk" },
    { id: 4, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Bahçe" },
    { id: 5, url: "https://plus.unsplash.com/premium_photo-1681053901938-a54612206f97?w=1200&q=85", label: "Semazenhane" },
  ],

  description: `Konya'nın kalbinde, 13. yüzyılın mistik atmosferini teneffüs edeceğiniz bu özel turda deneyimli rehberimiz eşliğinde Mevlana Türbesi ve Müzesi'ni keşfedeceksiniz.

Mevlana Celaleddin Rumi'nin dünyaca ünlü felsefesini, eserlerini ve hayatını anlatan bu tur; müzenin 10'dan fazla salonunu kapsamaktadır. Rehberimiz, sergilenen el yazmaları, Sema kostümleri ve nadide Selçuklu eserleri hakkında derinlemesine bilgi sunacak.

Tur boyunca kalabalık gruplardan uzak, sadece sizin grubunuza özel bir deneyim yaşayacaksınız. Küçük grup yapısı sayesinde her sorunuzu sorabilir, her eserin önünde istediğiniz kadar vakit geçirebilirsiniz.`,

  included: [
    "Uzman tarihçi rehber eşliği",
    "Müze giriş bileti dahil",
    "Kablosuz kulaklık sistemi",
    "Türkçe ve İngilizce anlatım",
    "Fotoğraf molası zamanları",
    "Tur sonrası dijital rehber kitapçığı",
  ],

  notes: [
    "Ziyaret süresince saygılı kıyafet giyinilmesi önerilir",
    "Müze içinde ayakkabı çıkarılması gerekebilir, çorap giyiniz",
    "Büyük çantalar müze girişindeki emanet bölmesine bırakılır",
    "Flaşlı fotoğraf çekimi müze kuralları gereği yasaktır",
    "Tur başlangıcından en az 10 dk önce buluşma noktasında olunuz",
  ],

  organizer: {
    name: "Ahmet Yılmaz",
    title: "Tarih Rehberi",
    since: "5 yıldır organizatör",
    rating: 4.9,
    totalReviews: 312,
    bio: "Selçuk Üniversitesi Tarih bölümü mezunu, profesyonel turist rehberi. Konya ve çevresinde 500+ tur gerçekleştirdim.",
    initials: "AY",
  },

  reviews: [
    {
      id: 1,
      name: "Ayşe Karagöz",
      initials: "AK",
      rating: 5,
      date: "Nisan 2025",
      text: "Ahmet Bey inanılmaz bilgili ve samimi biri. Müzeyi daha önce defalarca gezdim ama bu kadar derin anlatımı hiç duymamıştım. Kesinlikle tavsiye ederim!",
    },
    {
      id: 2,
      name: "Mehmet Demir",
      initials: "MD",
      rating: 5,
      date: "Mart 2025",
      text: "Küçük grup olması çok iyiydi, rehberimizle birebir soru-cevap yapabildik. Müzenin arka bahçesindeki az bilinen bölümlere de gittik. Muhteşem bir deneyimdi.",
    },
    {
      id: 3,
      name: "Fatma Öztürk",
      initials: "FÖ",
      rating: 5,
      date: "Mart 2025",
      text: "Yurt dışından misafirlerimizi getirdik, çok etkilendiler. Rehberimiz İngilizce anlatımı da çok akıcıydı. Hem eğlendik hem çok şey öğrendik.",
    },
  ],
}

function formatDate(date: Date) {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ─── Galeri Bileşeni ────────────────────────────────────────────────────
function ImageGallery({
  images,
  activeId,
  onSelect,
}: {
  images: typeof EXPERIENCE.images
  activeId: number
  onSelect: (id: number) => void
}) {
  const active = images.find((i) => i.id === activeId) ?? images[0]

  return (
    <div className="space-y-2">
      {/* Ana fotoğraf */}
      <div className="relative w-full h-80 md:h-[420px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          key={active.id}
          src={active.url}
          alt={active.label}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority={active.id === 1}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 text-white text-sm font-medium drop-shadow">
          {active.label}
        </span>
        <span className="absolute bottom-4 right-4 text-white/70 text-xs drop-shadow">
          {activeId} / {images.length}
        </span>
      </div>

      {/* Thumbnail'lar */}
      <div className="flex gap-2">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => onSelect(img.id)}
            className={`flex-1 h-16 rounded-lg overflow-hidden relative bg-gray-100 transition-all duration-200
              ${activeId === img.id
                ? "ring-2 ring-[#7B2D35] ring-offset-2 opacity-100"
                : "opacity-55 hover:opacity-80"
              }`}
          >
            <Image
              src={img.url}
              alt={img.label}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Booking Kartı ──────────────────────────────────────────────────────
function BookingCard({ price }: { price: number }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [participants, setParticipants] = useState(1)
  const [calOpen, setCalOpen] = useState(false)

  const total = price * participants

  return (
    <div className="rounded-lg border border-gray-100 shadow-lg bg-white p-6 space-y-5">
      {/* Fiyat */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">₺{price}</span>
        <span className="text-gray-500 mb-0.5">/ kişi</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-amber-500 font-medium -mt-2">
        <Star className="h-4 w-4 fill-amber-500" />
        <span>{EXPERIENCE.rating}</span>
        <span className="text-gray-400 font-normal">({EXPERIENCE.reviewCount} yorum)</span>
      </div>

      <Separator />

      {/* Tarih Seçici */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Tarih</label>
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal h-11 ${!selectedDate ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? formatDate(selectedDate) : "Tarih seçin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d)
                setCalOpen(false)
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Kişi Sayısı */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Kişi Sayısı</label>
        <div className="flex items-center justify-between border rounded-lg h-11 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={() => setParticipants((p) => Math.max(1, p - 1))}
            disabled={participants <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold w-8 text-center">{participants}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={() => setParticipants((p) => Math.min(EXPERIENCE.maxParticipants, p + 1))}
            disabled={participants >= EXPERIENCE.maxParticipants}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400">Maksimum {EXPERIENCE.maxParticipants} kişi</p>
      </div>

      <Separator />

      {/* Toplam Fiyat */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>₺{price} × {participants} kişi</span>
          <span>₺{total}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
          <span>Toplam</span>
          <span>₺{total}</span>
        </div>
      </div>

      {/* CTA Butonu */}
      <Button
        className="w-full h-12 text-base font-semibold bg-[#7B2D35] hover:bg-[#6a2630] text-white rounded-lg shadow-md"
        disabled={!selectedDate}
      >
        {selectedDate ? "Rezervasyon Talebi Gönder" : "Önce Tarih Seçin"}
      </Button>

      {/* Güvenceler */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4 text-green-600 shrink-0" />
          <span>Ücretsiz iptal (24 saat öncesine kadar)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Zap className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Anında onay</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="h-4 w-4 text-[#7B2D35] shrink-0" />
          <span>Güvenli ödeme</span>
        </div>
      </div>
    </div>
  )
}

// ─── Ana Sayfa ──────────────────────────────────────────────────────────
export default function ExperienceDetailPage() {
  const [activeImage, setActiveImage] = useState(EXPERIENCE.images[0].id)
  const exp = EXPERIENCE

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">

          {/* Geri linki */}
          <Link
            href="/deneyimler"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7B2D35] transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Tüm Deneyimler
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── SOL / DETAY ─── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Galeri */}
              <ImageGallery
                images={exp.images}
                activeId={activeImage}
                onSelect={setActiveImage}
              />

              {/* Başlık */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-[#7B2D35]/10 text-[#7B2D35] border-[#7B2D35]/20">
                    {exp.category}
                  </Badge>
                  {exp.isFeatured && (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                      Öne Çıkan
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {exp.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <strong className="text-gray-900">{exp.rating}</strong>
                    <span className="text-gray-400">({exp.reviewCount} yorum)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#7B2D35]" />
                    {exp.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {exp.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-gray-400" />
                    Maks. {exp.maxParticipants} kişi
                  </span>
                </div>
              </div>

              <Separator />

              {/* Açıklama */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bu Deneyim Hakkında</h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  {exp.description.trim().split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Neler Dahil */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Neler Dahil</h2>
                <ul className="space-y-3">
                  {exp.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Nelere Dikkat */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nelere Dikkat Etmeli</h2>
                <ul className="space-y-3">
                  {exp.notes.map((note) => (
                    <li key={note} className="flex items-start gap-3 text-gray-600">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Organizatör */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Organizatör</h2>
                <Card className="border-gray-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 text-lg shrink-0">
                        <AvatarFallback className="bg-[#7B2D35] text-white font-semibold">
                          {exp.organizer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{exp.organizer.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {exp.organizer.title}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{exp.organizer.since}</p>
                        <div className="flex items-center gap-1 text-sm text-amber-500 mb-3">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span className="font-medium">{exp.organizer.rating}</span>
                          <span className="text-gray-400 font-normal">
                            ({exp.organizer.totalReviews} yorum)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{exp.organizer.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Yorumlar */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Yorumlar</h2>
                  <div className="flex items-center gap-1.5 bg-[#7B2D35]/5 rounded-full px-3 py-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-gray-900">{exp.rating}</span>
                    <span className="text-gray-500 text-sm">/ 5</span>
                  </div>
                </div>
                <div className="space-y-5">
                  {exp.reviews.map((review) => (
                    <Card key={review.id} className="border-gray-100">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-semibold">
                              {review.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-gray-900 text-sm">
                                {review.name}
                              </span>
                              <span className="text-xs text-gray-400 shrink-0">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── SAĞ / BOOKING KARTI ─── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingCard price={exp.price} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
