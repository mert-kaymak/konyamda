"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { createClient } from "@/lib/supabase/client"
import {
  CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react"

interface ExperienceDetail {
  slug: string
  title: string
  category: string
  location: string
  price: number
  rating: number
  reviewCount: number
  duration: string
  maxParticipants: number
  isFeatured?: boolean
  images: { id: number; url: string; label: string }[]
  description: string
  included: string[]
  notes: string[]
  organizer: {
    name: string
    title: string
    since: string
    rating: number
    totalReviews: number
    bio: string
    initials: string
  }
  reviews: { id: number; name: string; initials: string; rating: number; date: string; text: string }[]
}

const DETAILS: Record<string, ExperienceDetail> = {
  "mevlana-muzesi-ozel-rehberli-tur": {
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

Tur boyunca kalabalık gruplardan uzak, sadece sizin grubunuza özel bir deneyim yaşayacaksınız.`,
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
      { id: 1, name: "Ayşe Karagöz", initials: "AK", rating: 5, date: "Nisan 2025", text: "Ahmet Bey inanılmaz bilgili ve samimi biri. Müzeyi daha önce defalarca gezdim ama bu kadar derin anlatımı hiç duymamıştım." },
      { id: 2, name: "Mehmet Demir", initials: "MD", rating: 5, date: "Mart 2025", text: "Küçük grup olması çok iyiydi, rehberimizle birebir soru-cevap yapabildik. Müzenin arka bahçesindeki az bilinen bölümlere de gittik." },
      { id: 3, name: "Fatma Öztürk", initials: "FÖ", rating: 5, date: "Mart 2025", text: "Yurt dışından misafirlerimizi getirdik, çok etkilendiler. Rehberimiz İngilizce anlatımı da çok akıcıydı." },
    ],
  },

  "etli-ekmek-yapim-atolyesi": {
    slug: "etli-ekmek-yapim-atolyesi",
    title: "Etli Ekmek Yapım Atölyesi",
    category: "Konya Mutfağı",
    location: "Selçuklu, Konya",
    price: 280,
    rating: 4.8,
    reviewCount: 94,
    duration: "3 saat",
    maxParticipants: 12,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1632158930341-46604b637a0f?w=1200&q=85", label: "Atölye" },
      { id: 2, url: "https://images.unsplash.com/photo-1759736859407-a676ed566968?w=1200&q=85", label: "Malzemeler" },
      { id: 3, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Hamur" },
      { id: 4, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Fırın" },
      { id: 5, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Sonuç" },
    ],
    description: `Konya'nın simgesi ve tescilli coğrafi işaretli lezzeti etli ekmeği ustasından öğrenin. Bu atölyede hamur yoğurmaktan fırına vermeye kadar her adımı bizzat deneyimleyeceksiniz.

Yerel usta şefimiz, yüzyıllık geleneksel tarifi ve püf noktalarıyla size rehberlik edecek. Atölye boyunca hem öğrenecek hem de hazırladığınız lezzetleri yerinde tadacaksınız.

Atölye sonunda tarifinizi ve malzeme listesini içeren bir kartı hediye olarak alacaksınız.`,
    included: [
      "Tüm malzemeler dahil",
      "Önlük ve ekipman",
      "Usta şef rehberliği",
      "Hazırlanan yemeklerin tadımı",
      "Tarif kartı hediyesi",
      "Meşrubat ikramı",
    ],
    notes: [
      "Rahat kıyafet ve kapalı ayakkabı tercih edin",
      "Gıda alerjiniz varsa önceden belirtin",
      "Atölye başlangıcından 5 dk önce hazır olunuz",
      "Çocuklar 10 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Zeynep Arslan",
      title: "Aşçı & Atölye Eğitmeni",
      since: "3 yıldır organizatör",
      rating: 4.8,
      totalReviews: 187,
      bio: "Konya mutfağı üzerine uzmanlaşmış aşçı. Geleneksel tarifleri yaşatmak ve yaymak için atölyeler düzenliyorum.",
      initials: "ZA",
    },
    reviews: [
      { id: 1, name: "Canan Yıldız", initials: "CY", rating: 5, date: "Nisan 2025", text: "Hem çok eğlendik hem de harika bir etli ekmek yaptık. Zeynep Hanım çok sabırlı ve bilgili bir eğitmen." },
      { id: 2, name: "Ali Kaya", initials: "AK", rating: 5, date: "Mart 2025", text: "Evde de deneyeceğim. Tarif kartı çok işe yaradı, tüm püf noktaları yazılı." },
      { id: 3, name: "Selin Doğan", initials: "SD", rating: 4, date: "Şubat 2025", text: "Güzel bir deneyimdi, ortam temiz ve düzenliydi. Kesinlikle tavsiye ederim." },
    ],
  },

  "sille-koyu-fotograf-turu": {
    slug: "sille-koyu-fotograf-turu",
    title: "Sille Köyü Fotoğraf Turu",
    category: "Gezi & Tur",
    location: "Sille, Konya",
    price: 450,
    rating: 5.0,
    reviewCount: 57,
    duration: "4 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Köy Girişi" },
      { id: 2, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Kaya Kilisesi" },
      { id: 3, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Tarihi Sokaklar" },
      { id: 4, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Panorama" },
      { id: 5, url: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=1200&q=85", label: "Göl Manzarası" },
    ],
    description: `2000 yıllık tarihe sahip Sille Köyü, Konya'nın en az bilinen hazinelerinden biridir. Kaya kiliseleri, taş evleri ve dar sokakları ile fotoğraf tutkunlarının vazgeçilmez rotası haline gelmiştir.

Profesyonel fotoğrafçı rehberimiz eşliğinde köyün en güzel karelerini yakalayacaksınız. Işık analizi, kompozisyon ve post-prodüksiyon ipuçları da tur kapsamındadır.

Sabah erken saatlerinde başlayan tur, altın ışıkta çekim imkânı sunmaktadır.`,
    included: [
      "Profesyonel fotoğraf rehberi",
      "Ulaşım (Konya merkez çıkışlı)",
      "Sabah kahvaltısı",
      "Fotoğraf teknikleri eğitimi",
      "Tur sonrası 10 fotoğraf düzenleme desteği",
    ],
    notes: [
      "Kamera veya akıllı telefon getiriniz",
      "Rahat yürüyüş ayakkabısı şart",
      "Sabah 07:00'de hareket edilmektedir",
      "Hava koşullarına göre program değişebilir",
    ],
    organizer: {
      name: "Murat Şahin",
      title: "Profesyonel Fotoğrafçı",
      since: "4 yıldır organizatör",
      rating: 5.0,
      totalReviews: 143,
      bio: "Belgesel fotoğrafçısı. Konya ve çevresinin görsel hafızasını oluşturmaya çalışıyorum.",
      initials: "MŞ",
    },
    reviews: [
      { id: 1, name: "Ebru Çelik", initials: "EÇ", rating: 5, date: "Nisan 2025", text: "Hayatımın en güzel fotoğraf turuydu. Murat Bey hem teknik açıdan hem de yerleri seçme konusunda mükemmel." },
      { id: 2, name: "Tarık Uysal", initials: "TU", rating: 5, date: "Mart 2025", text: "Sille'yi hiç bilmiyordum, artık her gittiğimde ziyaret etmek istiyorum. Muhteşem bir yer." },
    ],
  },

  "sema-toreni-ozel-izleme": {
    slug: "sema-toreni-ozel-izleme",
    title: "Sema Töreni Özel İzleme",
    category: "Mevlana & Tasavvuf",
    location: "Karatay, Konya",
    price: 180,
    rating: 4.9,
    reviewCount: 203,
    duration: "1.5 saat",
    maxParticipants: 15,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Sema" },
      { id: 2, url: "https://plus.unsplash.com/premium_photo-1681053901938-a54612206f97?w=1200&q=85", label: "Ney Müziği" },
      { id: 3, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Semazenhane" },
      { id: 4, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Törenin Başlangıcı" },
      { id: 5, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Konya Gecesi" },
    ],
    description: `UNESCO Somut Olmayan Kültürel Miras listesindeki Mevlevi Sema törenini özel bir ortamda, kalabalık turistlerden uzak deneyimleyin.

Törenin her adımını anlatan uzman rehberimiz, Mevlevi geleneğinin tarihi ve felsefi arka planını aktararak izleme deneyiminizi derinleştirecektir.

Tur öncesi kısa bir brifing ve tur sonrası soru-cevap seansı dahildir.`,
    included: [
      "Özel sema izleme alanı (ön sıra)",
      "Uzman rehber anlatımı",
      "Türkçe/İngilizce brifing",
      "Çay ikramı",
      "Fotoğraf izni",
    ],
    notes: [
      "Tören süresince sessizlik ve saygı esastır",
      "Flaşlı fotoğraf çekimi yasaktır",
      "Düzgün kıyafet giyinilmesi beklenmektedir",
      "Tören başlamadan 15 dk önce hazır olunuz",
    ],
    organizer: {
      name: "Haluk Erdem",
      title: "Tasavvuf Araştırmacısı",
      since: "6 yıldır organizatör",
      rating: 4.9,
      totalReviews: 421,
      bio: "Mevlevi geleneği ve Konya tarihi üzerine uzman. Yüzlerce kişiye bu eşsiz deneyimi yaşattım.",
      initials: "HE",
    },
    reviews: [
      { id: 1, name: "Deniz Akman", initials: "DA", rating: 5, date: "Nisan 2025", text: "Daha önce kalabalık törenlere gitmiştim ama bu kadar içten bir ortamda izlemek çok farklıydı. Gözyaşlarımı tutamadım." },
      { id: 2, name: "Buse Yener", initials: "BY", rating: 5, date: "Nisan 2025", text: "Haluk Bey'in anlatımı olmasaydı yarısını anlayamazdım. Hem ruhani hem eğitici bir deneyim." },
      { id: 3, name: "Kaan Öz", initials: "KÖ", rating: 5, date: "Mart 2025", text: "Yabancı misafirlerimizle geldik, hepsi etkilendi. İngilizce anlatım da çok kaliteliydi." },
    ],
  },

  "karatay-medresesi-cini-boyama": {
    slug: "karatay-medresesi-cini-boyama",
    title: "Karatay Medresesi Çini Boyama",
    category: "Sanat & El Sanatları",
    location: "Karatay, Konya",
    price: 250,
    rating: 4.7,
    reviewCount: 76,
    duration: "1.5 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Çini Atölyesi" },
      { id: 2, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Boyama" },
      { id: 3, url: "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?w=1200&q=85", label: "Motifler" },
      { id: 4, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Medrese" },
      { id: 5, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Eserler" },
    ],
    description: `Selçuklu döneminin en önemli çini sanatını Karatay Medresesi'nin gölgesinde öğrenin. Usta çini sanatçısı eşliğinde geleneksel motifleri kendi eserinize aktaracaksınız.

Atölye sonunda boyamış olduğunuz çini karo sizi evinizde hatıra olarak karşılamaya devam edecek.

Başlangıç ve orta düzey için uygun, önceden deneyim gerekmemektedir.`,
    included: [
      "Çini karo ve boyalar",
      "Usta sanatçı rehberliği",
      "Apron ve ekipman",
      "Boyanan çini karo hediye",
      "Pişirme ve teslimat hizmeti",
    ],
    notes: [
      "Kıyafetlerinizi korumak için apron giyiniz",
      "Çini boyaları kalıcıdır, dikkatli olunuz",
      "Boyama süresi kişiye göre değişebilir",
      "Çocuklar 7 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Nesrin Kılıç",
      title: "Çini Sanatçısı",
      since: "7 yıldır organizatör",
      rating: 4.7,
      totalReviews: 234,
      bio: "Geleneksel Selçuklu çini sanatını yaşatmak için çalışıyorum. Atölyemde herkes sanatçı.",
      initials: "NK",
    },
    reviews: [
      { id: 1, name: "Gül Aydın", initials: "GA", rating: 5, date: "Nisan 2025", text: "Harika bir deneyim. Hiç çizim bilmememe rağmen çok güzel bir çini çıkardım, Nesrin Hanım çok yardımcı oldu." },
      { id: 2, name: "Serdar Koç", initials: "SK", rating: 4, date: "Mart 2025", text: "Kızımla birlikte katıldık, ikimiz de çok keyif aldık. Ürünlerimiz artık evimizde." },
    ],
  },

  "sufi-muzigi-ney-dersi": {
    slug: "sufi-muzigi-ney-dersi",
    title: "Sufi Müziği & Ney Tanışma Dersi",
    category: "Mevlana & Tasavvuf",
    location: "Selçuklu, Konya",
    price: 300,
    rating: 4.8,
    reviewCount: 42,
    duration: "2 saat",
    maxParticipants: 6,
    images: [
      { id: 1, url: "https://plus.unsplash.com/premium_photo-1681053901938-a54612206f97?w=1200&q=85", label: "Ney Dersi" },
      { id: 2, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Usta" },
      { id: 3, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Enstrümanlar" },
      { id: 4, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Atölye" },
      { id: 5, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Konya" },
    ],
    description: `Mevlevi müziğinin ruhu olan ney enstrümanıyla ilk defa tanışın. Ney ustamız size neyin yapısını, sesini ve tekniğini öğretirken Mevlevi müzik geleneğinin derin hikâyesini de aktaracak.

Bu ders, önceden müzik deneyimi olmayanlara özel tasarlanmış bir tanışma dersidir. Dersi beğenenler için sürekli ders programı da mevcuttur.`,
    included: [
      "Birebir ney dersi",
      "Ney kiralama",
      "Mevlevi müzik tarihi anlatımı",
      "Ders notları ve kaynaklar",
      "Çay ikramı",
    ],
    notes: [
      "Önceden müzik deneyimi gerekmez",
      "Rahat nefes alabilmek için sigara içmemeniz önerilir",
      "Ders günü en az 2 saat önce yemek yememek nefes kontrolü açısından faydalıdır",
    ],
    organizer: {
      name: "Semih Doğan",
      title: "Ney Ustası",
      since: "8 yıldır organizatör",
      rating: 4.8,
      totalReviews: 98,
      bio: "20 yıldır ney çalıyorum, 8 yıldır öğretiyorum. Mevlevi müziğini yaymak en büyük amacım.",
      initials: "SD",
    },
    reviews: [
      { id: 1, name: "İrem Polat", initials: "İP", rating: 5, date: "Nisan 2025", text: "Semih Bey'in sabrı ve öğretim yeteneği mükemmel. İlk kez ses çıkardığımda inanamadım." },
      { id: 2, name: "Onur Yıldız", initials: "OY", rating: 5, date: "Mart 2025", text: "Sadece ney değil, Mevlevi felsefesini de öğrendim. Çok zenginleştirici bir ders." },
    ],
  },

  "konya-gastronomi-turu": {
    slug: "konya-gastronomi-turu",
    title: "Konya Tarihi Çarşı Gastronomi Turu",
    category: "Konya Mutfağı",
    location: "Karatay, Konya",
    price: 380,
    rating: 4.9,
    reviewCount: 89,
    duration: "2.5 saat",
    maxParticipants: 12,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1759736859407-a676ed566968?w=1200&q=85", label: "Bedesten" },
      { id: 2, url: "https://images.unsplash.com/photo-1632158930341-46604b637a0f?w=1200&q=85", label: "Etli Ekmek" },
      { id: 3, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Tarihi Çarşı" },
      { id: 4, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Tatlılar" },
      { id: 5, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Baharat Çarşısı" },
    ],
    description: `Konya'nın tarihi Bedesten'inden başlayarak 6 farklı mekânda şehrin en özgün lezzetlerini tadacağınız bu turda gastronomi rehberimiz size her durağın hikâyesini anlatacak.

Fırın kebabı, etli ekmek, bamya çorbası, peksimetli tatlı ve daha fazlası sizi bekliyor. Yeme-içme kültürü açısından zengin bir şehir olan Konya'yı en lezzetli biçimde keşfedin.`,
    included: [
      "6 mekânda tadım",
      "Gastronomi rehberi",
      "Su ve içecek",
      "Tarihi çarşı turu",
      "Tariflerin yazılı olduğu kartlar",
    ],
    notes: [
      "Tur başlamadan önce çok tok olmamaya çalışın",
      "Gıda alerjiniz varsa önceden belirtin",
      "Yürüyüş ağırlıklı bir tur, rahat ayakkabı tercih edin",
      "Çocuklar için uygun",
    ],
    organizer: {
      name: "Leyla Arslan",
      title: "Gastronomi Rehberi",
      since: "5 yıldır organizatör",
      rating: 4.9,
      totalReviews: 267,
      bio: "Konya mutfağını ve lezzetlerini dünyaya tanıtmak için çalışıyorum. Her tur yeni bir lezzet yolculuğu.",
      initials: "LA",
    },
    reviews: [
      { id: 1, name: "Merve Güler", initials: "MG", rating: 5, date: "Nisan 2025", text: "Konya'ya defalarca geldim ama bu kadar kapsamlı bir tadım turu hiç yapmamıştım. Leyla Hanım'ın bilgisi muazzam." },
      { id: 2, name: "Burak Tan", initials: "BT", rating: 5, date: "Mart 2025", text: "6 mekân çok iyi seçilmiş, her biri birbirinden farklı. Fırın kebabı favorim oldu." },
      { id: 3, name: "Pınar Sarı", initials: "PS", rating: 5, date: "Şubat 2025", text: "Şehri tanımak için en güzel yol bu. Hem karnımız doydu hem de tarihi öğrendik." },
    ],
  },

  "beysehir-golu-tekne-turu": {
    slug: "beysehir-golu-tekne-turu",
    title: "Beyşehir Gölü Şövalye Adası Turu",
    category: "Doğa & Macera",
    location: "Beyşehir, Konya",
    price: 500,
    rating: 4.8,
    reviewCount: 61,
    duration: "4 saat",
    maxParticipants: 15,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=1200&q=85", label: "Beyşehir Gölü" },
      { id: 2, url: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=1200&q=85", label: "Tekne" },
      { id: 3, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Ada" },
      { id: 4, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Kubad Abad" },
      { id: 5, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Gün Batımı" },
    ],
    description: `Türkiye'nin en büyük tatlı su gölü Beyşehir Gölü'nde özel tekne ile Kubad Abad Sarayı'na ve Şövalye Adası'na yolculuk yapın.

13. yüzyıldan kalma Selçuklu sarayının kalıntılarını gezen rehberimiz, adanın ve gölün tarihini aktaracak. Göl kenarında öğle yemeği molası da tura dahildir.`,
    included: [
      "Özel tekne turu",
      "Tarih rehberi",
      "Öğle yemeği",
      "Konya merkez - Beyşehir ulaşımı",
      "Giriş biletleri",
    ],
    notes: [
      "Can yeleği tur boyunca giyilir",
      "Güneş kremi ve şapka getirin",
      "Deniz tutması olanlar önceden ilaç alsın",
      "Fotoğraf makinesi tavsiye edilir",
    ],
    organizer: {
      name: "Okan Kara",
      title: "Doğa Rehberi",
      since: "4 yıldır organizatör",
      rating: 4.8,
      totalReviews: 156,
      bio: "Beyşehir ve çevresini avucunun içi gibi biliyorum. Doğa ve tarih tutkunları için en iyi rotaları sunuyorum.",
      initials: "OK",
    },
    reviews: [
      { id: 1, name: "Tuba Yalçın", initials: "TY", rating: 5, date: "Nisan 2025", text: "Gölün ortasında tarihin içinde kaybolmak başka bir his. Okan Bey'in tekne kullanımı ve anlatımı harikaydı." },
      { id: 2, name: "Cem Aslan", initials: "CA", rating: 5, date: "Mart 2025", text: "Ailemizle en güzel tatil deneyimimiz oldu. Çocuklar da çok eğlendi." },
    ],
  },

  "meram-baglari-sonbahar-turu": {
    slug: "meram-baglari-sonbahar-turu",
    title: "Meram Bağları Sonbahar Turu",
    category: "Doğa & Macera",
    location: "Meram, Konya",
    price: 220,
    rating: 4.6,
    reviewCount: 38,
    duration: "3 saat",
    maxParticipants: 12,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=1200&q=85", label: "Bağlar" },
      { id: 2, url: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=1200&q=85", label: "Kahvaltı" },
      { id: 3, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Yürüyüş" },
      { id: 4, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Tarihi Köprü" },
      { id: 5, url: "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?w=1200&q=85", label: "Sonbahar" },
    ],
    description: `Şair Şems'in ve Mevlana'nın ilham aldığı Meram bağlarında sabahın erken saatlerinde doğa yürüyüşüne çıkın. Asırlık ağaçlar, tarihi su kemerleri ve bağ yolları sizi bekliyor.

Yürüyüş sonrası bağ kahvaltısında taze üzüm, ceviz ve yerel lezzetler ikram edilecek. Şiir okuma seansı ile tur tamamlanacak.`,
    included: [
      "Doğa rehberi",
      "Bağ kahvaltısı",
      "Şiir okuma seansı",
      "Botanik bilgilendirmesi",
    ],
    notes: [
      "Sabah serin olabilir, katman katman giyinin",
      "Rahat yürüyüş ayakkabısı şart",
      "Tur sabah 08:00'de başlar",
    ],
    organizer: {
      name: "Filiz Yılmaz",
      title: "Doğa ve Şiir Rehberi",
      since: "3 yıldır organizatör",
      rating: 4.6,
      totalReviews: 87,
      bio: "Meram bağlarını ve Konya şiir geleneğini birleştiren özgün turlar düzenliyorum.",
      initials: "FY",
    },
    reviews: [
      { id: 1, name: "Neslihan Ak", initials: "NA", rating: 5, date: "Ekim 2024", text: "Şehrin ortasında bu kadar huzurlu bir yer olduğuna inanamadım. Filiz Hanım'ın şiir seçimleri de çok güzeldi." },
      { id: 2, name: "Arda Demir", initials: "AD", rating: 4, date: "Ekim 2024", text: "Kahvaltı mükemmeldi, yürüyüş güzel ama biraz kısa kaldı. Tekrar geleceğim." },
    ],
  },

  "konya-geleneksel-kilim-dokuma": {
    slug: "konya-geleneksel-kilim-dokuma",
    title: "Geleneksel Konya Kilim Dokuma Atölyesi",
    category: "Sanat & El Sanatları",
    location: "Meram, Konya",
    price: 320,
    rating: 4.7,
    reviewCount: 53,
    duration: "2.5 saat",
    maxParticipants: 8,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?w=1200&q=85", label: "Kilim Tezgahı" },
      { id: 2, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Motifler" },
      { id: 3, url: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=1200&q=85", label: "Dokuma" },
      { id: 4, url: "https://images.unsplash.com/photo-1716754430696-22912c597421?w=1200&q=85", label: "Renkler" },
      { id: 5, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Eserler" },
    ],
    description: `Anadolu'nun en köklü el sanatlarından kilim dokumayı ustasından öğrenin. Yüzyıllardır nesilden nesile aktarılan geleneksel motifleri kendi kilim parçanıza işleyeceksiniz.

Her katılımcı kendi küçük kilim parçasını tamamlayarak evine götürecek. Ürettiğiniz eserin desenleri Konya'ya özgü geleneksel motifler içerecek.`,
    included: [
      "Kilim tezgahı ve malzemeler",
      "Usta rehber eşliği",
      "Motif şablonları",
      "Tamamlanan kilim parçası hediye",
      "Çay ve ikram",
    ],
    notes: [
      "Rahat oturabileceğiniz kıyafet tercih edin",
      "Uzun tırnaklı katılımcılar için eldiven sağlanır",
      "Sabır gerektiren bir atölyedir, acele etmemek önerilir",
      "Çocuklar 10 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Hatice Çetin",
      title: "Kilim Ustası",
      since: "10 yıldır organizatör",
      rating: 4.7,
      totalReviews: 178,
      bio: "Üç nesil kilim dokuma bilgisini taşıyan bir aileden geliyorum. Bu sanatı yaşatmak benim için bir görev.",
      initials: "HÇ",
    },
    reviews: [
      { id: 1, name: "Rüya Özer", initials: "RÖ", rating: 5, date: "Mart 2025", text: "Sabah gitmiştim ama o kadar çektim ki öğleye kadar kaldım. Hatice Hanım çok ilgili ve bilgili." },
      { id: 2, name: "Emre Can", initials: "EC", rating: 4, date: "Şubat 2025", text: "Ellerimle bir şey üretmek çok tatmin ediciydi. Küçük kilimim artık evimin en değerli parçası." },
    ],
  },
}

function formatDate(date: Date) {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function ImageGallery({
  images,
  activeId,
  onSelect,
}: {
  images: ExperienceDetail["images"]
  activeId: number
  onSelect: (id: number) => void
}) {
  const active = images.find((i) => i.id === activeId) ?? images[0]

  return (
    <div className="space-y-2">
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

function BookingCard({
  price,
  rating,
  reviewCount,
  maxParticipants,
  experienceSlug,
}: {
  price: number
  rating: number
  reviewCount: number
  maxParticipants: number
  experienceSlug: string
}) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [participants, setParticipants] = useState(1)
  const [calOpen, setCalOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const total = price * participants

  async function handleBooking() {
    if (!selectedDate) return
    setStatus("loading")
    setErrorMsg("")

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    // Supabase'den experience UUID'sini slug ile bul
    const { data: expRow } = await supabase
      .from("experiences")
      .select("id")
      .eq("slug", experienceSlug)
      .single()

    if (!expRow) {
      setStatus("error")
      setErrorMsg("Bu deneyim henüz rezervasyon sistemine eklenmemiş. Yakında aktif olacak.")
      return
    }

    const { error } = await supabase.from("bookings").insert({
      experience_id: expRow.id,
      user_id: user.id,
      participant_count: participants,
      booking_date: selectedDate.toISOString().split("T")[0],
      total_price: total,
      status: "pending",
    })

    if (error) {
      setStatus("error")
      setErrorMsg("Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.")
    } else {
      setStatus("success")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Rezervasyon Talebiniz Alındı!</h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(selectedDate!)} · {participants} kişi · ₺{total}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Organizatör en kısa sürede sizinle iletişime geçecek.
          </p>
        </div>
        <Link href="/dashboard" className="block">
          <Button className="w-full bg-[#7B2D35] hover:bg-[#6a2630] text-white">
            Rezervasyonlarım
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-100 shadow-lg bg-white p-6 space-y-5">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">₺{price}</span>
        <span className="text-gray-500 mb-0.5">/ kişi</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-amber-500 font-medium -mt-2">
        <Star className="h-4 w-4 fill-amber-500" />
        <span>{rating}</span>
        <span className="text-gray-400 font-normal">({reviewCount} yorum)</span>
      </div>

      <Separator />

      {status === "error" && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {errorMsg}
        </div>
      )}

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
            onClick={() => setParticipants((p) => Math.min(maxParticipants, p + 1))}
            disabled={participants >= maxParticipants}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400">Maksimum {maxParticipants} kişi</p>
      </div>

      <Separator />

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

      <Button
        className="w-full h-12 text-base font-semibold bg-[#7B2D35] hover:bg-[#6a2630] text-white rounded-lg shadow-md"
        disabled={!selectedDate || status === "loading"}
        onClick={handleBooking}
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : selectedDate ? (
          "Rezervasyon Talebi Gönder"
        ) : (
          "Önce Tarih Seçin"
        )}
      </Button>

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

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeImage, setActiveImage] = useState(1)

  const exp = DETAILS[slug]

  if (!exp) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-5xl">🔍</p>
            <h1 className="text-xl font-bold text-gray-900">Deneyim bulunamadı</h1>
            <Link href="/deneyimler">
              <Button className="bg-[#7B2D35] hover:bg-[#6a2630] text-white">
                Tüm Deneyimler
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">

          <Link
            href="/deneyimler"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7B2D35] transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Tüm Deneyimler
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              <ImageGallery
                images={exp.images}
                activeId={activeImage}
                onSelect={setActiveImage}
              />

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

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bu Deneyim Hakkında</h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  {exp.description.trim().split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <Separator />

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

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingCard
                  price={exp.price}
                  rating={exp.rating}
                  reviewCount={exp.reviewCount}
                  maxParticipants={exp.maxParticipants}
                  experienceSlug={exp.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
