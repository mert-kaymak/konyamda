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
  "mevlana-muzesi-rehberli-tur": {
    slug: "mevlana-muzesi-rehberli-tur",
    title: "Mevlana Müzesi Rehberli Tur",
    category: "Kültür & Tarih",
    location: "Karatay, Konya",
    price: 350,
    rating: 4.9,
    reviewCount: 243,
    duration: "2 saat",
    maxParticipants: 8,
    isFeatured: true,
    images: [
      { id: 1, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Müze Girişi" },
      { id: 2, url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=85", label: "Türbe" },
      { id: 3, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Çini Köşk" },
      { id: 4, url: "https://images.unsplash.com/photo-Hw9wHGvGZdE?w=1200&q=85", label: "Yeşil Kubbe" },
      { id: 5, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Semazenhane" },
    ],
    description: `Hz. Mevlana'nın yeşil kubbesinin altında, 13. yüzyıldan kalma el yazmalarını, Sema kostümlerini ve nadide Selçuklu eserlerini uzman tarih rehberi eşliğinde keşfedin. Müzenin semahane, dervişane ve mutfak bölümlerini gezerken Mevlevi kültürünün 800 yıllık derinliğine ineceksiniz.

Rehberimiz, sergilenen eserlerin arkasındaki hikayeleri ve Mevlana'nın felsefesini canlı anlatımıyla aktaracak. Kalabalık gruplardan uzak, küçük ve samimi bir ortamda birebir soru-cevap imkânı da bulacaksınız.

Tur sonunda müzenin dijital rehber kitapçığı e-posta ile gönderilecektir.`,
    included: [
      "Uzman tarihçi rehber eşliği",
      "Müze giriş bileti dahil",
      "Kablosuz kulaklık sistemi",
      "Türkçe ve İngilizce anlatım",
      "Fotoğraf molaları",
      "Dijital rehber kitapçığı",
    ],
    notes: [
      "Saygılı kıyafet giyinilmesi önerilir, omuzlar ve dizler örtülü olmalı",
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

  "sema-toreni-izleme": {
    slug: "sema-toreni-izleme",
    title: "Sema Töreni İzleme",
    category: "Mevlana & Tasavvuf",
    location: "Selçuklu, Konya",
    price: 180,
    rating: 4.9,
    reviewCount: 318,
    duration: "1 saat 15 dk",
    maxParticipants: 15,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo--hp5d9O3MEk?w=1200&q=85", label: "Sema Töreni" },
      { id: 2, url: "https://images.unsplash.com/photo-v6gfZmFMpt4?w=1200&q=85", label: "Semazenhane" },
      { id: 3, url: "https://images.unsplash.com/photo-3a1MNMRdxaA?w=1200&q=85", label: "Dönen Dervişler" },
      { id: 4, url: "https://images.unsplash.com/photo-Je0M8I4O2qU?w=1200&q=85", label: "Ruhani Atmosfer" },
      { id: 5, url: "https://images.unsplash.com/photo-SqQ9btOnu-E?w=1200&q=85", label: "Tören Anı" },
    ],
    description: `UNESCO Somut Olmayan Kültürel Miras listesindeki Mevlevi Sema törenini özel ve samimi bir ortamda, kalabalık turistlerden uzak izleyin. Beyaz tennureler içinde dönen semazenlerin her hareketi Mevlana'nın felsefesindeki ölüm, aşk ve yeniden doğuşu sembolize eder.

Törenin anlam ve tarihini anlatan tasavvuf araştırmacısı rehberimiz, tören öncesinde kısa bir brifing sunacak. Ney, kudüm ve ilahi eşliğinde gerçekleşen 75 dakikalık tören, ruhani ve sanatsal açıdan unutulmaz bir deneyim sunuyor.

Tören bitiminde rehberimizle soru-cevap seansı yapılacak, çay ikram edilecektir.`,
    included: [
      "Özel izleme alanı (ön sıra)",
      "Tasavvuf araştırmacısı rehber anlatımı",
      "Türkçe/İngilizce brifing",
      "Çay ikramı",
      "Fotoğraf izni (flaşsız)",
    ],
    notes: [
      "Tören süresince sessizlik ve saygı esastır",
      "Flaşlı fotoğraf çekimi kesinlikle yasaktır",
      "Düzgün ve saygılı kıyafet giyinilmesi beklenmektedir",
      "Tören başlamadan 15 dk önce hazır olunuz",
      "Çocuklar 12 yaş ve üzeri katılabilir",
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

  "etli-ekmek-yapim-atolyesi": {
    slug: "etli-ekmek-yapim-atolyesi",
    title: "Etli Ekmek Yapım Atölyesi",
    category: "Konya Mutfağı",
    location: "Selçuklu, Konya",
    price: 280,
    rating: 4.8,
    reviewCount: 127,
    duration: "3 saat",
    maxParticipants: 12,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-I0ha_pMquU4?w=1200&q=85", label: "Geleneksel Fırın" },
      { id: 2, url: "https://images.unsplash.com/photo-bPqMD7uSrJg?w=1200&q=85", label: "Hamur Yoğurma" },
      { id: 3, url: "https://images.unsplash.com/photo-tCPk4-sHSkY?w=1200&q=85", label: "Hazırlık" },
      { id: 4, url: "https://images.unsplash.com/photo-s4lvaXKUyxU?w=1200&q=85", label: "Şekillendirme" },
      { id: 5, url: "https://images.unsplash.com/photo-MNIY0kO-lAw?w=1200&q=85", label: "Sıcak Ekmek" },
    ],
    description: `Konya'nın tescilli coğrafi işaretli lezzeti ve şehrin sembolü etli ekmeği, geleneksel taş fırında usta şef rehberliğinde baştan sona kendiniz yapın. Un seçiminden hamur yoğurmaya, iç harç hazırlamaktan fırına sürmeye kadar her adımı bizzat deneyimleyeceksiniz.

Yüzyıllık geleneksel tarifi ve püf noktalarını öğrenirken atölye boyunca hem eğlenecek hem de hazırladığınız etli ekmeği fırından çıkar çıkmaz sıcak sıcak tadacaksınız.

Atölye sonunda kişiselleştirilmiş tarif kartı ve malzeme listesi hediye olarak verilmektedir.`,
    included: [
      "Tüm malzemeler dahil",
      "Önlük ve ekipman",
      "Usta şef rehberliği",
      "Hazırlanan etli ekmeğin tadımı",
      "Kişiselleştirilmiş tarif kartı",
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

  "firin-kebabi-yapim-atolyesi": {
    slug: "firin-kebabi-yapim-atolyesi",
    title: "Fırın Kebabı Yapım Atölyesi",
    category: "Konya Mutfağı",
    location: "Karatay, Konya",
    price: 320,
    rating: 4.7,
    reviewCount: 84,
    duration: "4 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85", label: "Fırın Kebabı" },
      { id: 2, url: "https://images.unsplash.com/photo-1632158930341-46604b637a0f?w=1200&q=85", label: "Hazırlık" },
      { id: 3, url: "https://images.unsplash.com/photo-1759736859407-a676ed566968?w=1200&q=85", label: "Baharatlar" },
      { id: 4, url: "https://images.unsplash.com/photo-9Lsxip60s20?w=1200&q=85", label: "Taş Fırın" },
      { id: 5, url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", label: "Servis" },
    ],
    description: `Konya mutfağının vazgeçilmez ikinci lezzeti fırın kebabını; kuzu etini seçmekten, tuz ve karabiber ile sadece ustalıkla hazırlamaya kadar tüm süreçte usta kebapçı rehberliğinde öğrenin. Geleneksel taş fırında saatlerce yavaşça pişen et, Konya'ya özgü tekniklerle hazırlanır.

Etin marinasyon, fırın sıcaklığı ve pişirme süresi gibi kritik püf noktalarını öğrenirken hazırlıklarınızı yapacak, ardından fırından çıkan kebabı yöresel ekmek ve ayranla birlikte tadacaksınız.

Atölye, sabah hazırlık ve öğlen tadım şeklinde iki bölümden oluşmaktadır.`,
    included: [
      "Tüm malzemeler dahil",
      "Usta kebapçı rehberliği",
      "Taş fırın deneyimi",
      "Hazırlanan kebabın tadımı",
      "Yöresel ekmek ve ayran",
      "Tarif kartı",
    ],
    notes: [
      "Sabah erken başlanacak için 09:00'da hazır olunuz",
      "Gıda alerjiniz varsa önceden belirtin",
      "Rahat kıyafet ve kapalı ayakkabı önerilir",
      "Pişirme süresi 3-4 saattir, sabırlı olunuz",
    ],
    organizer: {
      name: "Mustafa Karakaş",
      title: "Usta Kebapçı",
      since: "8 yıldır organizatör",
      rating: 4.7,
      totalReviews: 203,
      bio: "40 yıllık aile kebapçılık geleneğini sürdürüyorum. Konya fırın kebabının sırlarını sizinle paylaşmaktan mutluluk duyuyorum.",
      initials: "MK",
    },
    reviews: [
      { id: 1, name: "Serkan Aydın", initials: "SA", rating: 5, date: "Nisan 2025", text: "Fırın kebabının bu kadar emek gerektirdiğini bilmiyordum. Mustafa Bey her adımı tek tek anlattı, mükemmeldi." },
      { id: 2, name: "Gülay Çelik", initials: "GÇ", rating: 5, date: "Mart 2025", text: "Yediğimiz en iyi fırın kebabıydı, üstelik biz yaptık! Harika bir deneyim." },
      { id: 3, name: "Barış Yıldırım", initials: "BY", rating: 4, date: "Şubat 2025", text: "Biraz uzun sürdü ama sabır gerektiriyor zaten. Sonuç inanılmazdı." },
    ],
  },

  "catalhoyuk-arkeolojik-tur": {
    slug: "catalhoyuk-arkeolojik-tur",
    title: "Çatalhöyük Arkeolojik Alan Turu",
    category: "Kültür & Tarih",
    location: "Çumra, Konya",
    price: 400,
    rating: 4.8,
    reviewCount: 89,
    duration: "3 saat",
    maxParticipants: 10,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=1200&q=85", label: "Kazı Alanı" },
      { id: 2, url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=85", label: "Arkeolojik Bulgular" },
      { id: 3, url: "https://images.unsplash.com/photo-G7LWlDEg6hg?w=1200&q=85", label: "Alan Müzesi" },
      { id: 4, url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=85", label: "Sergi" },
      { id: 5, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Konya Ovası" },
    ],
    description: `MÖ 7400-6200 yıllarına tarihlenen Çatalhöyük, dünyada bilinen en eski kentsel yerleşim yerlerinden biridir ve 2012'den bu yana UNESCO Dünya Mirası Listesi'ndedir. Uzman arkeolog rehberimiz eşliğinde aktif kazı alanlarını, korunmuş ev kalıntılarını ve on binlerce yıl önceki insanlık yaşantısının izlerini yakından göreceksiniz.

Alandaki ziyaretçi merkezinde bulunan özgün buluntular; duvar resimleri, heykelcikler ve günlük kullanım eşyaları Konya Ovasındaki bu antik şehrin gizemini gözler önüne seriyor. Rehberimiz, Neolitik dönem insan topluluklarının sosyal yapısını ve yaşam biçimini anlaşılır dille aktaracak.

Tur öncesi Konya merkez çıkışlı ulaşım dahildir.`,
    included: [
      "Uzman arkeolog rehber eşliği",
      "Konya merkez - Çumra ulaşımı",
      "Alan giriş bileti dahil",
      "Ziyaretçi merkezi turu",
      "Türkçe ve İngilizce anlatım",
    ],
    notes: [
      "Güneş kremi ve şapka getirin; alan açık havadadır",
      "Rahat yürüyüş ayakkabısı şart",
      "Alanda toprak zemin bulunmaktadır, dikkatli yürüyünüz",
      "Kazı alanlarında çit dışına çıkmak yasaktır",
      "Yeterli su bulundurunuz",
    ],
    organizer: {
      name: "Dr. Elif Çetin",
      title: "Arkeolog & Alan Rehberi",
      since: "6 yıldır organizatör",
      rating: 4.9,
      totalReviews: 178,
      bio: "Selçuk Üniversitesi Arkeoloji öğretim üyesi. Çatalhöyük kazılarında aktif olarak görev aldım, bu eşsiz alanı sizinle keşfetmek istiyorum.",
      initials: "EÇ",
    },
    reviews: [
      { id: 1, name: "Burak Kaya", initials: "BK", rating: 5, date: "Nisan 2025", text: "Dr. Elif Hanım'ın anlatımı olmasaydı kuru bir arkeoloji ziyaretine dönerdi. Tarihi bu kadar canlı anlatan birine ilk kez rastladım." },
      { id: 2, name: "Nergis Polat", initials: "NP", rating: 5, date: "Mart 2025", text: "9000 yıl önceki insanların yaşattığı bu yerde zaman kayboluyor. Mutlaka görülmesi gereken bir yer." },
      { id: 3, name: "Ozan Demir", initials: "OD", rating: 4, date: "Mart 2025", text: "Konya'ya defalarca gelmiştim ama Çatalhöyük'ü hiç ziyaret etmemiştim. Artık favorim." },
    ],
  },

  "sille-koyu-fotograf-turu": {
    slug: "sille-koyu-fotograf-turu",
    title: "Sille Köyü Fotoğraf Turu",
    category: "Gezi & Tur",
    location: "Selçuklu, Konya",
    price: 450,
    rating: 5.0,
    reviewCount: 73,
    duration: "4 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-qAroWT1XMic?w=1200&q=85", label: "Köy Girişi" },
      { id: 2, url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=85", label: "Kaya Kilisesi" },
      { id: 3, url: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=1200&q=85", label: "Tarihi Sokaklar" },
      { id: 4, url: "https://images.unsplash.com/photo-1529060256154-8dca470c3325?w=1200&q=85", label: "Eski Köprü" },
      { id: 5, url: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=1200&q=85", label: "Sille Gölü" },
    ],
    description: `Konya merkeze yalnızca 8 km uzaklıkta yer alan Sille, Frig, Bizans ve Selçuklu dönemlerinin izlerini bir arada taşıyan 2000 yıllık kadim bir köydür. Hagia Eleni Kilisesi, kaya oyma şapeller, taş evler ve Orta Çağ'dan kalma dar sokakları ile fotoğraf tutkunlarının gizli cennetidir.

Profesyonel fotoğrafçı rehberimiz eşliğinde altın saat ışığında köyün en ikonografik noktalarını keşfedecek, kompozisyon ve ışık kullanımı konusunda pratik ipuçları öğreneceksiniz.

Sabah 07:00'de başlayan tur, gün içindeki en yumuşak doğal ışıkta çekim imkânı sunar.`,
    included: [
      "Profesyonel fotoğrafçı rehberi",
      "Konya merkez çıkışlı ulaşım",
      "Sabah kahvaltısı",
      "Fotoğraf teknikleri eğitimi",
      "Tur sonrası 10 fotoğraf düzenleme desteği",
    ],
    notes: [
      "Kamera veya akıllı telefon getiriniz",
      "Rahat yürüyüş ayakkabısı şart, bazı bölgeler taş döşemeli",
      "Sabah 07:00'de hareket edilmektedir, geç kalınmayınız",
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
      { id: 3, name: "Hülya Arslan", initials: "HA", rating: 5, date: "Şubat 2025", text: "Telefon kamerasıyla katılmıştım ama gelen fotoğraflar inanılmaz çıktı. Murat Bey'in yönlendirmeleri sayesinde." },
    ],
  },

  "beysehir-golu-tekne-turu": {
    slug: "beysehir-golu-tekne-turu",
    title: "Beyşehir Gölü Tekne Turu",
    category: "Doğa & Macera",
    location: "Beyşehir, Konya",
    price: 500,
    rating: 4.8,
    reviewCount: 91,
    duration: "5 saat",
    maxParticipants: 15,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1764789998734-653c1370ab01?w=1200&q=85", label: "Beyşehir Gölü" },
      { id: 2, url: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=1200&q=85", label: "Tekne" },
      { id: 3, url: "https://images.unsplash.com/photo-Z-Xqx6iax_k?w=1200&q=85", label: "Şövalye Adası" },
      { id: 4, url: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=1200&q=85", label: "Kubad Abad" },
      { id: 5, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Gün Batımı" },
    ],
    description: `650 km²'lik yüzölçümüyle Türkiye'nin en büyük tatlı su gölü Beyşehir'de özel tekne ile 32 adacıktan oluşan gölü keşfederek 13. yüzyıldan kalma Selçuklu sarayı Kubad Abad'a ve eşsiz doğası ile Şövalye Adası'na yolculuk yapın.

Göl kenarında yetişen sazlıklar, pelikan kolonileri ve berrak sular arasında ilerlerken tarih rehberimiz Kubad Abad Sarayı'nın çini kalıntılarını ve Selçuklu dönemi deniz ticaretinin hikayesini aktaracak.

Tura öğle yemeği ve Konya merkez - Beyşehir arası ulaşım dahildir.`,
    included: [
      "Özel tekne turu",
      "Tarih & doğa rehberi",
      "Öğle yemeği (göl balığı)",
      "Konya merkez - Beyşehir ulaşımı",
      "Giriş biletleri",
      "Can yeleği",
    ],
    notes: [
      "Can yeleği tur boyunca giyilir",
      "Güneş kremi, şapka ve güneş gözlüğü getirin",
      "Deniz tutması olanlar önceden ilaç alsın",
      "Fotoğraf makinesi şiddetle tavsiye edilir",
      "Sabah 09:00'da Konya merkez buluşma noktasından hareket edilir",
    ],
    organizer: {
      name: "Okan Kara",
      title: "Doğa & Tekne Rehberi",
      since: "4 yıldır organizatör",
      rating: 4.8,
      totalReviews: 156,
      bio: "Beyşehir Gölü'nü ve çevresini avucunun içi gibi biliyorum. Doğa ve tarih tutkunları için en iyi rotaları sunuyorum.",
      initials: "OK",
    },
    reviews: [
      { id: 1, name: "Tuba Yalçın", initials: "TY", rating: 5, date: "Nisan 2025", text: "Gölün ortasında tarihin içinde kaybolmak başka bir his. Okan Bey'in tekne kullanımı ve anlatımı harikaydı." },
      { id: 2, name: "Cem Aslan", initials: "CA", rating: 5, date: "Mart 2025", text: "Ailemizle en güzel tatil deneyimimiz oldu. Çocuklar da çok eğlendi." },
      { id: 3, name: "Yıldız Kaya", initials: "YK", rating: 5, date: "Şubat 2025", text: "Göl balığı öğle yemeği çok lezzetliydi. Kubad Abad kalıntıları muhteşem." },
    ],
  },

  "geleneksel-cini-boyama": {
    slug: "geleneksel-cini-boyama",
    title: "Geleneksel Çini Boyama Atölyesi",
    category: "Sanat & El Sanatları",
    location: "Karatay, Konya",
    price: 300,
    rating: 4.7,
    reviewCount: 112,
    duration: "2 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Çini Atölyesi" },
      { id: 2, url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=85", label: "Motifler" },
      { id: 3, url: "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?w=1200&q=85", label: "Boyama" },
      { id: 4, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Karatay Çinisi" },
      { id: 5, url: "https://images.unsplash.com/photo-H0l97Gy_PqA?w=1200&q=85", label: "Eserler" },
    ],
    description: `Karatay Medresesi'nin duvarlarını süsleyen turkuaz ve kobalt mavisi Selçuklu çinilerinden ilham alarak, usta çini sanatçısı eşliğinde geleneksel geometrik ve bitkisel motifleri kendi çini karonuza işleyin.

Boyama tekniklerini, renk seçimini ve Selçuklu sanatının özgün stilini öğrenirken yarattığınız eser evinizde yıllarca yaşayacak. Önceden çizim veya sanat deneyimi gerekmemektedir; her seviyeye uygun şablonlar sunulmaktadır.

Boyanan çini karo pişirme sürecinden geçirilerek bir hafta içinde adresinize teslim edilir.`,
    included: [
      "Hazır çini karo ve özel boyalar",
      "Usta çini sanatçısı rehberliği",
      "Önlük ve ekipman",
      "Boyanan çini karo (pişirilmiş halde teslim)",
      "Çay ikramı",
    ],
    notes: [
      "Kıyafetlerinizi korumak için önlük giyiniz",
      "Çini boyaları kalıcıdır, dikkatli olunuz",
      "Boyama süresi kişiye göre 1,5-2 saat arasında değişebilir",
      "Çocuklar 7 yaş ve üzeri katılabilir",
      "Pişirilmiş karo teslimatı 1 hafta içinde yapılmaktadır",
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
      { id: 3, name: "Melek Yıldız", initials: "MY", rating: 5, date: "Şubat 2025", text: "Çiniyi pişirilmiş halde teslim alınca çok mutlu oldum. Her şey organize edilmişti." },
    ],
  },

  "hat-sanati-atolyesi": {
    slug: "hat-sanati-atolyesi",
    title: "Hat Sanatı Atölyesi",
    category: "Sanat & El Sanatları",
    location: "Selçuklu, Konya",
    price: 250,
    rating: 4.6,
    reviewCount: 58,
    duration: "2,5 saat",
    maxParticipants: 8,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-n3rOsLFh2ZY?w=1200&q=85", label: "Hat Sanatı" },
      { id: 2, url: "https://images.unsplash.com/photo-xa-4NdR5z1c?w=1200&q=85", label: "İslam Kaligrafi" },
      { id: 3, url: "https://images.unsplash.com/photo-1sYWWe6Bgzw?w=1200&q=85", label: "Altın Yazı" },
      { id: 4, url: "https://images.unsplash.com/photo-8tPuaW7L21M?w=1200&q=85", label: "Kalem Çalışması" },
      { id: 5, url: "https://images.unsplash.com/photo-GXkCBYRtBOQ?w=1200&q=85", label: "Eserler" },
    ],
    description: `İslam medeniyetinin en köklü sanat formlarından hat sanatının temellerini, Konya'nın köklü hat geleneğinden gelen usta hattat eşliğinde öğrenin. Kamış kalem tutmaktan başlayarak Nesih ve Sülüs yazı stillerinde harfler, kelimeler ve kısa cümleler yazmayı pratik yapacaksınız.

Mevlana'nın şiirlerinden seçilmiş kısa bir beyiti kendi el yazınıza aktaracak, atölye sonunda çerçevelenmiş eserinizi eve götüreceksiniz. Her katılımcıya kişisel kalem ve mürekkep seti hediye edilmektedir.

Önceden hat veya kaligrafi deneyimi gerekmemektedir; tamamen yeni başlayanlar için tasarlanmıştır.`,
    included: [
      "Kamış kalem ve mürekkep seti (hediye)",
      "Usta hattat rehberliği",
      "Özel hat kağıdı ve alıştırma setleri",
      "Çerçevelenmiş eser (atölye sonunda)",
      "Çay ikramı",
    ],
    notes: [
      "Önceden hat deneyimi gerekmez",
      "Sabır gerektiren bir sanattır; acele etmemek önerilir",
      "Rahat oturabileceğiniz kıyafet tercih edin",
      "Çocuklar 12 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Hasan Demirel",
      title: "Usta Hattat",
      since: "9 yıldır organizatör",
      rating: 4.6,
      totalReviews: 134,
      bio: "İstanbul Geleneksel Sanatlar Enstitüsü mezunu hattat. Konya'da hat sanatını yaşatmak ve yaymak için atölye düzenliyorum.",
      initials: "HD",
    },
    reviews: [
      { id: 1, name: "Zehra Akın", initials: "ZA", rating: 5, date: "Nisan 2025", text: "Hasan Bey çok sabırlı bir hoca. İlk kez kalem tuttum ama atölye sonunda gerçek bir eser ortaya çıkardım." },
      { id: 2, name: "Tolga Yılmaz", initials: "TY", rating: 4, date: "Mart 2025", text: "Hat sanatının bu kadar derin bir felsefesi olduğunu bilmiyordum. Hem sanat hem kültür öğrendim." },
      { id: 3, name: "Rana Sezer", initials: "RS", rating: 5, date: "Şubat 2025", text: "Çerçevelenmiş eserimi evimin en değerli köşesine astım. Çok özel bir hediye oldu." },
    ],
  },

  "karatay-medresesi-rehberli-tur": {
    slug: "karatay-medresesi-rehberli-tur",
    title: "Karatay Medresesi Rehberli Tur",
    category: "Kültür & Tarih",
    location: "Karatay, Konya",
    price: 220,
    rating: 4.8,
    reviewCount: 156,
    duration: "1,5 saat",
    maxParticipants: 12,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=85", label: "Çini Kubbe" },
      { id: 2, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Medrese Girişi" },
      { id: 3, url: "https://images.unsplash.com/photo-1518899150575-5ac29fbe2f3e?w=1200&q=85", label: "Çini Koleksiyon" },
      { id: 4, url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=85", label: "Taş İşleme" },
      { id: 5, url: "https://images.unsplash.com/photo-k_PC-oqarxo?w=1200&q=85", label: "Avlu" },
    ],
    description: `Anadolu Selçuklu Devleti döneminde 1251 yılında inşa edilen Karatay Medresesi, Türk-İslam mimarisinin en nadide örneklerinden biridir. Bugün Çini Eserler Müzesi olarak hizmet veren medresenin asıl büyüsü, türkuaz ve kobalt mavisi çinilerle döşeli nefes kesici 24 dilimli kubbesindedir.

Uzman rehberimiz, medresenin taç kapısındaki geometrik mukarnas bezemeleri, kubbe çinilerindeki yıldız desenlerinin matematiksel anlamını ve müzede sergilenen Selçuklu çini koleksiyonunu derinlemesine anlatacak.

Karatay Medresesi, Alaaddin Camii ve İnce Minareli Medrese'yi kapsayan üçlü tarihi tur paketi de mevcuttur.`,
    included: [
      "Uzman sanat tarihi rehberi",
      "Müze giriş bileti dahil",
      "Türkçe ve İngilizce anlatım",
      "Fotoğraf molaları",
      "Bilgi kartı seti",
    ],
    notes: [
      "Flaşlı fotoğraf çekimi müze kuralları gereği yasaktır",
      "Müze içinde saygılı ve sessiz olunması beklenmektedir",
      "Tur başlangıcından 10 dk önce medrese önünde olunuz",
      "Büyük çantalar girişte emanete bırakılabilir",
    ],
    organizer: {
      name: "Sema Arslan",
      title: "Sanat Tarihi Rehberi",
      since: "5 yıldır organizatör",
      rating: 4.8,
      totalReviews: 289,
      bio: "Sanat tarihi lisansüstü mezunu, müze rehberi. Selçuklu mimarisini tutkuyla anlatıyorum.",
      initials: "SA",
    },
    reviews: [
      { id: 1, name: "Kemal Şahin", initials: "KŞ", rating: 5, date: "Nisan 2025", text: "Karatay'ı daha önce de gezmiştim ama Sema Hanım'ın anlatımından sonra adeta yeniden keşfettim. Kubbedeki yıldız desenlerinin anlamını öğrenmek çok etkileyiciydi." },
      { id: 2, name: "İlknur Doğan", initials: "İD", rating: 5, date: "Mart 2025", text: "Selçuklu sanatını bu kadar ayrıntılı anlatan ikinci bir rehber görmedim. Harika bir deneyim." },
      { id: 3, name: "Emrah Can", initials: "EC", rating: 4, date: "Şubat 2025", text: "Kısa ama yoğun ve bilgi dolu bir tur. Kesinlikle tavsiye ederim." },
    ],
  },

  "alaaddin-tepesi-tarihi-tur": {
    slug: "alaaddin-tepesi-tarihi-tur",
    title: "Alaaddin Tepesi Tarihi Tur",
    category: "Kültür & Tarih",
    location: "Selçuklu, Konya",
    price: 200,
    rating: 4.7,
    reviewCount: 104,
    duration: "1,5 saat",
    maxParticipants: 12,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=85", label: "Alaaddin Tepesi" },
      { id: 2, url: "https://plus.unsplash.com/premium_photo-1664475030299-590e428e77c0?w=1200&q=85", label: "Alaaddin Camii" },
      { id: 3, url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=85", label: "Sultan Türbeleri" },
      { id: 4, url: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=1200&q=85", label: "Selçuklu Köşkü" },
      { id: 5, url: "https://images.unsplash.com/photo-wh6JbIYKe3A?w=1200&q=85", label: "Konya Panoraması" },
    ],
    description: `Konya'nın tam kalbinde yükselen Alaaddin Tepesi, 12. yüzyıldan itibaren Anadolu Selçuklu Sultanlığı'nın merkezi olmuştur. Anadolu Selçuklularının sekiz sultanının mezarını barındıran Alaaddin Camii, 12. yüzyılda başlayıp 13. yüzyılda tamamlanan ve Anadolu'nun en eski camilerinden biridir.

Uzman rehberimiz, Selçuklu köşkü kalıntılarını, sultan türbelerini ve Konya'nın kuş bakışı manzarasını anlatırken şehrin 2500 yıllık yerleşim tarihine ışık tutacak. Konyanın en stratejik noktasından şehre bakan bu tepe, tarih ve şehircilik açısından eşsiz bir perspektif sunar.

Tur, Alaaddin Camii'nin iç mekanını ve türbeleri de kapsamaktadır.`,
    included: [
      "Uzman tarih rehberi",
      "Alaaddin Camii ve türbe ziyareti",
      "Türkçe ve İngilizce anlatım",
      "Konya haritası ve bilgi kitapçığı",
    ],
    notes: [
      "Camiye girerken başörtüsü ve çorap gerekmektedir",
      "Rahat yürüyüş ayakkabısı önerilir",
      "Tepe çıkışı için fiziksel olarak uygun olunmalı",
      "Tur başlangıcından 10 dk önce tepe girişinde olunuz",
    ],
    organizer: {
      name: "Ümit Koç",
      title: "Tarih & Şehir Rehberi",
      since: "7 yıldır organizatör",
      rating: 4.7,
      totalReviews: 256,
      bio: "Konya'nın 2500 yıllık tarihini sokak sokak, taş taş bilen bir rehberim. Şehrin hafızasını aktarmak en büyük tutkum.",
      initials: "ÜK",
    },
    reviews: [
      { id: 1, name: "Sevda Aydın", initials: "SA", rating: 5, date: "Nisan 2025", text: "Konya'da büyüdüm ama Alaaddin Tepesi'nin bu kadar zengin bir tarihe sahip olduğunu Ümit Bey sayesinde öğrendim." },
      { id: 2, name: "Barış Kaya", initials: "BK", rating: 5, date: "Mart 2025", text: "Kısa ama çok etkili bir tur. Selçuklu sultanlarının türbelerini ziyaret etmek gerçekten etkileyiciydi." },
      { id: 3, name: "Lale Polat", initials: "LP", rating: 4, date: "Şubat 2025", text: "Konya manzarası tepeden çok güzel. Rehber bilgili, anlatım akıcı." },
    ],
  },

  "konya-mutfagi-yemek-atolyesi": {
    slug: "konya-mutfagi-yemek-atolyesi",
    title: "Konya Mutfağı Yemek Atölyesi",
    category: "Konya Mutfağı",
    location: "Meram, Konya",
    price: 380,
    rating: 4.9,
    reviewCount: 67,
    duration: "3,5 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", label: "Atölye" },
      { id: 2, url: "https://images.unsplash.com/photo-1632158930341-46604b637a0f?w=1200&q=85", label: "Etli Ekmek" },
      { id: 3, url: "https://images.unsplash.com/photo-1759736859407-a676ed566968?w=1200&q=85", label: "Malzemeler" },
      { id: 4, url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85", label: "Kebap" },
      { id: 5, url: "https://images.unsplash.com/photo-wrvQCkhL4sk?w=1200&q=85", label: "Sofra" },
    ],
    description: `Konya'nın tescilli yöresel lezzetlerini tek bir atölyede keşfedin: etli ekmek hamurundan bamya çorbasına, fırın kebabından tirit ve peksimetli tatlıya kadar şehrin damak hafızasını oluşturan tarifleri uzman şef eşliğinde pişireceksiniz.

Şefimiz, her yemeğin tarihsel kökenini ve Konya mutfağındaki yerine dair bilgileri aktarırken siz pişirme sürecine aktif olarak katılacaksınız. Atölye sonunda hazırladığınız tüm yemekleri bir arada sofrada birlikte tadacaksınız.

Katılımcılara kişiselleştirilmiş Konya mutfağı tarif defteri hediye edilmektedir.`,
    included: [
      "Tüm malzemeler dahil",
      "Önlük ve ekipman",
      "Uzman şef rehberliği",
      "Hazırlanan tüm yemeklerin sofra tadımı",
      "Kişiselleştirilmiş tarif defteri",
      "Meşrubat ve çay ikramı",
    ],
    notes: [
      "Rahat kıyafet ve kapalı ayakkabı tercih edin",
      "Gıda alerjiniz varsa önceden belirtin",
      "Tok gelmeyin, yemek yiyeceksiniz",
      "Çocuklar 10 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Leyla Arslan",
      title: "Şef & Gastronomi Rehberi",
      since: "5 yıldır organizatör",
      rating: 4.9,
      totalReviews: 267,
      bio: "Konya mutfağını ve lezzetlerini dünyaya tanıtmak için çalışıyorum. Her atölye yeni bir lezzet yolculuğu.",
      initials: "LA",
    },
    reviews: [
      { id: 1, name: "Merve Güler", initials: "MG", rating: 5, date: "Nisan 2025", text: "Konya mutfağının bu kadar zengin olduğunu bilmiyordum. Leyla Hanım hem lezzetli hem eğlenceli bir atölye hazırlamış." },
      { id: 2, name: "Burak Tan", initials: "BT", rating: 5, date: "Mart 2025", text: "Tüm yemekleri kendimiz yaptık ve sonunda sofrada hep birlikte yedik. Çok özel bir deneyim." },
      { id: 3, name: "Pınar Sarı", initials: "PS", rating: 5, date: "Şubat 2025", text: "Tarif defteri çok kullanışlı, evde de deneytim. Bamya çorbası favorim oldu." },
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
