"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Clock, Filter, MapPin, Search, Star, SlidersHorizontal } from "lucide-react"

interface Experience {
  id: string
  slug: string
  title: string
  shortDesc: string
  location: string
  district: string
  category: string
  price: number
  durationMinutes: number
  rating: number
  reviewCount: number
  isFeatured?: boolean
  image: string
}

const ALL_EXPERIENCES: Experience[] = [
  {
    id: "1",
    slug: "mevlana-muzesi-ozel-rehberli-tur",
    title: "Mevlana Müzesi Özel Rehberli Tur",
    shortDesc: "Uzman rehber eşliğinde Mevlana'nın izinde tarihi bir yolculuğa çıkın.",
    location: "Karatay, Konya",
    district: "Karatay",
    category: "Kültür & Tarih",
    price: 350,
    durationMinutes: 120,
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    image: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=800&q=80",
  },
  {
    id: "2",
    slug: "etli-ekmek-yapim-atolyesi",
    title: "Etli Ekmek Yapım Atölyesi",
    shortDesc: "Konya'nın simgesi etli ekmeği ustasından öğrenin, birlikte pişirip yiyin.",
    location: "Selçuklu, Konya",
    district: "Selçuklu",
    category: "Konya Mutfağı",
    price: 280,
    durationMinutes: 180,
    rating: 4.8,
    reviewCount: 94,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1632158930341-46604b637a0f?w=800&q=80",
  },
  {
    id: "3",
    slug: "sille-koyu-fotograf-turu",
    title: "Sille Köyü Fotoğraf Turu",
    shortDesc: "2000 yıllık tarihi Sille Köyü'nün gizemli sokakları ve kaya kiliselerini keşfedin.",
    location: "Sille, Konya",
    district: "Selçuklu",
    category: "Gezi & Tur",
    price: 450,
    durationMinutes: 240,
    rating: 5.0,
    reviewCount: 57,
    image: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=800&q=80",
  },
  {
    id: "4",
    slug: "sema-toreni-ozel-izleme",
    title: "Sema Töreni Özel İzleme",
    shortDesc: "UNESCO korumasındaki Sema törenini özel bir alanda, rehber anlatımıyla izleyin.",
    location: "Karatay, Konya",
    district: "Karatay",
    category: "Mevlana & Tasavvuf",
    price: 180,
    durationMinutes: 75,
    rating: 4.9,
    reviewCount: 203,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=800&q=80",
  },
  {
    id: "5",
    slug: "karatay-medresesi-cini-boyama",
    title: "Karatay Medresesi Çini Boyama",
    shortDesc: "Selçuklu geleneğini yaşatın; kendi çini karodunuzu boyayıp eve götürün.",
    location: "Karatay, Konya",
    district: "Karatay",
    category: "Sanat & El Sanatları",
    price: 250,
    durationMinutes: 90,
    rating: 4.7,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=800&q=80",
  },
  {
    id: "6",
    slug: "sufi-muzigi-ney-dersi",
    title: "Sufi Müziği & Ney Tanışma Dersi",
    shortDesc: "Ney ustasıyla birebir ders; Mevlevi müziğinin ruhunu hissedin.",
    location: "Selçuklu, Konya",
    district: "Selçuklu",
    category: "Mevlana & Tasavvuf",
    price: 300,
    durationMinutes: 120,
    rating: 4.8,
    reviewCount: 42,
    image: "https://plus.unsplash.com/premium_photo-1681053901938-a54612206f97?w=800&q=80",
  },
  {
    id: "7",
    slug: "konya-gastronomi-turu",
    title: "Konya Tarihi Çarşı Gastronomi Turu",
    shortDesc: "Bedesten'den başlayıp 6 farklı mekânda Konya lezzetlerini tadın.",
    location: "Karatay, Konya",
    district: "Karatay",
    category: "Konya Mutfağı",
    price: 380,
    durationMinutes: 150,
    rating: 4.9,
    reviewCount: 89,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1759736859407-a676ed566968?w=800&q=80",
  },
  {
    id: "8",
    slug: "beysehir-golu-tekne-turu",
    title: "Beyşehir Gölü Şövalye Adası Turu",
    shortDesc: "Türkiye'nin en büyük tatlı su gölünde tekneyle Kubad Abad Sarayı'na yolculuk.",
    location: "Beyşehir, Konya",
    district: "Beyşehir",
    category: "Doğa & Macera",
    price: 500,
    durationMinutes: 240,
    rating: 4.8,
    reviewCount: 61,
    image: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=800&q=80",
  },
  {
    id: "9",
    slug: "meram-baglari-sonbahar-turu",
    title: "Meram Bağları Sonbahar Turu",
    shortDesc: "Tarihi Meram bağlarında doğa yürüyüşü, bağ kahvaltısı ve şiir okuma.",
    location: "Meram, Konya",
    district: "Meram",
    category: "Doğa & Macera",
    price: 220,
    durationMinutes: 180,
    rating: 4.6,
    reviewCount: 38,
    image: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=800&q=80",
  },
  {
    id: "10",
    slug: "konya-geleneksel-kilim-dokuma",
    title: "Geleneksel Konya Kilim Dokuma Atölyesi",
    shortDesc: "Nesilden nesile aktarılan el dokuma sanatını öğrenin, kendi parçanızı yaratın.",
    location: "Meram, Konya",
    district: "Meram",
    category: "Sanat & El Sanatları",
    price: 320,
    durationMinutes: 150,
    rating: 4.7,
    reviewCount: 53,
    image: "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?w=800&q=80",
  },
]

const ALL_CATEGORIES = [
  "Kültür & Tarih",
  "Konya Mutfağı",
  "Gezi & Tur",
  "Mevlana & Tasavvuf",
  "Sanat & El Sanatları",
  "Doğa & Macera",
]

// Anasayfa kategori slug'larını gerçek kategori adlarına eşle
const KATEGORI_SLUG_MAP: Record<string, string> = {
  "mevlana-tasavvuf": "Mevlana & Tasavvuf",
  "konya-mutfagi": "Konya Mutfağı",
  "doga-macera": "Doğa & Macera",
  "sanat-el-sanatlari": "Sanat & El Sanatları",
  "kultur-tarih": "Kültür & Tarih",
  "gezi-tur": "Gezi & Tur",
}

const DURATION_OPTIONS = [
  { label: "1 saat altı", id: "short", min: 0, max: 59 },
  { label: "1 – 3 saat", id: "medium", min: 60, max: 180 },
  { label: "3 saat üzeri", id: "long", min: 181, max: Infinity },
]

const SORT_OPTIONS = [
  { value: "recommended", label: "Önerilen" },
  { value: "price_asc", label: "En Düşük Fiyat" },
  { value: "rating_desc", label: "En Yüksek Puan" },
]

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} dk`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} sa ${m} dk` : `${h} saat`
}

function FilterContent({
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  selectedDurations,
  setSelectedDurations,
  sortBy,
  setSortBy,
  onClose,
}: {
  selectedCategories: string[]
  setSelectedCategories: (v: string[]) => void
  priceRange: [number, number]
  setPriceRange: (v: [number, number]) => void
  selectedDurations: string[]
  setSelectedDurations: (v: string[]) => void
  sortBy: string
  setSortBy: (v: string) => void
  onClose?: () => void
}) {
  function toggleCategory(cat: string) {
    setSelectedCategories(
      selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat]
    )
  }

  function toggleDuration(id: string) {
    setSelectedDurations(
      selectedDurations.includes(id)
        ? selectedDurations.filter((d) => d !== id)
        : [...selectedDurations, id]
    )
  }

  function handleReset() {
    setSelectedCategories([])
    setPriceRange([0, 2000])
    setSelectedDurations([])
    setSortBy("recommended")
    onClose?.()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Sıralama</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="accent-[#7B2D35] h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#7B2D35] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Kategori</h3>
        <div className="space-y-2.5">
          {ALL_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                className="data-[state=checked]:bg-[#7B2D35] data-[state=checked]:border-[#7B2D35]"
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm text-gray-700 cursor-pointer hover:text-[#7B2D35]"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Fiyat Aralığı</h3>
          <span className="text-sm text-[#7B2D35] font-medium">
            ₺{priceRange[0]} – ₺{priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={2000}
          step={50}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="[&_[role=slider]]:bg-[#7B2D35] [&_[role=slider]]:border-[#7B2D35] [&_.range]:bg-[#7B2D35]"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>₺0</span>
          <span>₺2.000</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Süre</h3>
        <div className="space-y-2.5">
          {DURATION_OPTIONS.map((dur) => (
            <div key={dur.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`dur-${dur.id}`}
                checked={selectedDurations.includes(dur.id)}
                onCheckedChange={() => toggleDuration(dur.id)}
                className="data-[state=checked]:bg-[#7B2D35] data-[state=checked]:border-[#7B2D35]"
              />
              <Label
                htmlFor={`dur-${dur.id}`}
                className="text-sm text-gray-700 cursor-pointer hover:text-[#7B2D35]"
              >
                {dur.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white"
        onClick={handleReset}
      >
        Filtreleri Temizle
      </Button>
    </div>
  )
}

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <Link href={`/deneyimler/${exp.slug}`} className="group block">
      <div className="rounded-lg border border-gray-100 overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {exp.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
              Öne Çıkan
            </Badge>
          )}
          <Badge className="absolute bottom-3 left-3 bg-black/40 text-white border-0 text-xs backdrop-blur-sm">
            {exp.category}
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-[#7B2D35] transition-colors line-clamp-2">
            {exp.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{exp.shortDesc}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              {exp.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              {formatDuration(exp.durationMinutes)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium mb-4">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            <span>{exp.rating}</span>
            <span className="text-gray-400 font-normal">({exp.reviewCount} yorum)</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">kişi başı</span>
              <p className="text-lg font-bold text-gray-900 leading-none">₺{exp.price}</p>
            </div>
            <Button
              size="sm"
              className="bg-[#7B2D35] hover:bg-[#6a2630] text-white text-xs rounded-lg"
              onClick={(e) => e.preventDefault()}
              asChild
            >
              <Link href={`/deneyimler/${exp.slug}`}>İncele</Link>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ExperiencesContent() {
  const searchParams = useSearchParams()

  const qParam = searchParams.get("q") ?? ""
  const kategoriParam = searchParams.get("kategori") ?? ""

  const [searchQuery, setSearchQuery] = useState(qParam)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const mapped = KATEGORI_SLUG_MAP[kategoriParam]
    return mapped ? [mapped] : []
  })
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recommended")
  const [sheetOpen, setSheetOpen] = useState(false)

  // URL params değişirse state'i güncelle (tarayıcı geri/ileri)
  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "")
    const mapped = KATEGORI_SLUG_MAP[searchParams.get("kategori") ?? ""]
    setSelectedCategories(mapped ? [mapped] : [])
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = [...ALL_EXPERIENCES]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDesc.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      )
    }

    if (selectedCategories.length > 0) {
      list = list.filter((e) => selectedCategories.includes(e.category))
    }

    list = list.filter((e) => e.price >= priceRange[0] && e.price <= priceRange[1])

    if (selectedDurations.length > 0) {
      list = list.filter((e) =>
        selectedDurations.some((id) => {
          const opt = DURATION_OPTIONS.find((d) => d.id === id)!
          return e.durationMinutes >= opt.min && e.durationMinutes <= opt.max
        })
      )
    }

    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price)
    else if (sortBy === "rating_desc") list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))

    return list
  }, [searchQuery, selectedCategories, priceRange, selectedDurations, sortBy])

  const filterProps = {
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    selectedDurations,
    setSelectedDurations,
    sortBy,
    setSortBy,
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedDurations.length +
    (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Başlık + filtre butonu */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deneyimler</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  <span className="font-semibold text-[#7B2D35]">{filtered.length} deneyim</span>{" "}
                  bulundu
                </p>
              </div>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden flex items-center gap-2 border-[#7B2D35] text-[#7B2D35]"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtrele
                    {activeFilterCount > 0 && (
                      <Badge className="bg-[#7B2D35] text-white text-xs px-1.5 py-0 h-5">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrele
                    </SheetTitle>
                  </SheetHeader>
                  <FilterContent {...filterProps} onClose={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Arama kutusu */}
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ne denemek istiyorsunuz?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24 bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Filter className="h-4 w-4 text-[#7B2D35]" />
                  <h2 className="font-semibold text-gray-900">Filtreler</h2>
                  {activeFilterCount > 0 && (
                    <Badge className="ml-auto bg-[#7B2D35] text-white text-xs px-1.5 py-0 h-5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                <FilterContent {...filterProps} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-5xl mb-4">🔍</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Deneyim bulunamadı
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Farklı filtreler veya arama terimi deneyin
                  </p>
                  <Button
                    variant="outline"
                    className="border-[#7B2D35] text-[#7B2D35]"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategories([])
                      setPriceRange([0, 2000])
                      setSelectedDurations([])
                      setSortBy("recommended")
                    }}
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              ) : (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((exp) => (
                    <ExperienceCard key={exp.id} exp={exp} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ExperiencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#7B2D35] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExperiencesContent />
    </Suspense>
  )
}
