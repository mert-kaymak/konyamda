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
  "etli-ekmek-yapim-atolyesi": {
    slug: "etli-ekmek-yapim-atolyesi",
    title: "Etli Ekmek Yapım Atölyesi",
    category: "Yemek & Mutfak",
    location: "Selçuklu, Konya",
    price: 280,
    rating: 4.9,
    reviewCount: 142,
    duration: "3 saat",
    maxParticipants: 10,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/37290076/pexels-photo-37290076.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Etli Ekmek" },
      { id: 2, url: "https://images.pexels.com/photos/37290074/pexels-photo-37290074.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Hamur Hazırlığı" },
      { id: 3, url: "https://images.pexels.com/photos/37290077/pexels-photo-37290077.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Malzemeler" },
      { id: 4, url: "https://images.pexels.com/photos/37290084/pexels-photo-37290084.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Fırın" },
      { id: 5, url: "https://images.pexels.com/photos/37290088/pexels-photo-37290088.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Sonuç" },
    ],
    description: `Konya'nın vazgeçilmez lezzeti etli ekmeği ustadan öğrenin. Hamurunuzu yoğurun, iç harcını hazırlayın ve taş fırında pişirin. Atölye sonunda yaptığınız etli ekmeği arkadaşlarınızla yiyin!

Konya'nın tescilli coğrafi işaretli lezzeti etli ekmeği, geleneksel taş fırında usta şef rehberliğinde baştan sona kendiniz yapın. Un seçiminden hamur yoğurmaya, iç harç hazırlamaktan fırına sürmeye kadar her adımı bizzat deneyimleyeceksiniz.

Yüzyıllık geleneksel tarifi ve tüm püf noktalarını öğrenirken atölye boyunca hem eğlenecek hem de hazırladığınız etli ekmeği fırından çıkar çıkmaz sıcak sıcak tadacaksınız. Atölye sonunda kişiselleştirilmiş tarif kartı hediye edilir.`,
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
      rating: 4.9,
      totalReviews: 187,
      bio: "Konya mutfağı üzerine uzmanlaşmış aşçı. Geleneksel tarifleri yaşatmak ve yaymak için atölyeler düzenliyorum.",
      initials: "ZA",
    },
    reviews: [
      { id: 1, name: "Canan Yıldız", initials: "CY", rating: 5, date: "Nisan 2026", text: "Hem çok eğlendik hem de harika bir etli ekmek yaptık. Zeynep Hanım çok sabırlı ve bilgili bir eğitmen." },
      { id: 2, name: "Ali Kaya", initials: "AK", rating: 5, date: "Mart 2026", text: "Evde de deneyeceğim. Tarif kartı çok işe yaradı, tüm püf noktaları yazılı." },
      { id: 3, name: "Selin Doğan", initials: "SD", rating: 4, date: "Şubat 2026", text: "Güzel bir deneyimdi, ortam temiz ve düzenliydi. Kesinlikle tavsiye ederim." },
    ],
  },

  "sille-koyu-fotograf-turu": {
    slug: "sille-koyu-fotograf-turu",
    title: "Sille Köyü Fotoğraf Turu",
    category: "Fotoğrafçılık & Sanat",
    location: "Meram, Konya",
    price: 350,
    rating: 4.9,
    reviewCount: 86,
    duration: "4 saat",
    maxParticipants: 10,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/37063407/pexels-photo-37063407.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Sille Köyü" },
      { id: 2, url: "https://images.pexels.com/photos/27954698/pexels-photo-27954698.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Taş Sokaklar" },
      { id: 3, url: "https://images.pexels.com/photos/34152794/pexels-photo-34152794.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Antik Kilise" },
      { id: 4, url: "https://images.pexels.com/photos/18484626/pexels-photo-18484626.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Köy Atmosferi" },
      { id: 5, url: "https://images.pexels.com/photos/37063361/pexels-photo-37063361.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Tarihi Yapılar" },
    ],
    description: `Konya'nın tarihi Sille Köyü'nde instagramlık kareler yakalayın. Taş sokaklar, antik kiliseler ve köy atmosferinde rehber eşliğinde fotoğraf çekimi teknikleri öğrenin.

Konya merkeze yalnızca 8 km uzaklıktaki Sille, Frig, Bizans ve Selçuklu dönemlerinin izlerini bir arada taşıyan 2000 yıllık kadim bir köydür. Hagia Eleni Kilisesi, kaya oyma şapeller ve dar taş sokaklarıyla fotoğraf tutkunlarının gizli cennetidir.

Profesyonel fotoğrafçı rehberimiz eşliğinde kompozisyon, ışık kullanımı ve perspektif konularında pratik eğitim alırken muhteşem kareler yakalayacaksınız.`,
    included: [
      "Profesyonel fotoğrafçı rehberi",
      "Konya merkez - Sille ulaşımı",
      "Fotoğraf teknikleri eğitimi",
      "Sabah kahvaltısı",
      "Tur sonrası 10 fotoğraf düzenleme desteği",
    ],
    notes: [
      "Kamera veya akıllı telefon getiriniz",
      "Rahat yürüyüş ayakkabısı şart, bazı bölgeler taş döşemeli",
      "Sabah 07:00'de hareket edilmektedir, geç kalmayınız",
      "Hava koşullarına göre program değişebilir",
    ],
    organizer: {
      name: "Murat Şahin",
      title: "Profesyonel Fotoğrafçı",
      since: "4 yıldır organizatör",
      rating: 4.9,
      totalReviews: 143,
      bio: "Belgesel fotoğrafçısı. Konya ve çevresinin görsel hafızasını oluşturmaya çalışıyorum.",
      initials: "MŞ",
    },
    reviews: [
      { id: 1, name: "Ebru Çelik", initials: "EÇ", rating: 5, date: "Nisan 2026", text: "Hayatımın en güzel fotoğraf turuydu. Murat Bey hem teknik açıdan hem de yerleri seçme konusunda mükemmeldi." },
      { id: 2, name: "Tarık Uysal", initials: "TU", rating: 5, date: "Mart 2026", text: "Sille'yi hiç bilmiyordum, artık her gittiğimde ziyaret etmek istiyorum. Muhteşem bir yer." },
      { id: 3, name: "Hülya Arslan", initials: "HA", rating: 5, date: "Şubat 2026", text: "Telefon kamerasıyla katılmıştım ama gelen fotoğraflar inanılmaz çıktı. Murat Bey'in yönlendirmeleri sayesinde." },
    ],
  },

  "geleneksel-cini-boyama-atolyesi": {
    slug: "geleneksel-cini-boyama-atolyesi",
    title: "Geleneksel Çini Boyama Atölyesi",
    category: "Sanat & El Sanatları",
    location: "Karatay, Konya",
    price: 320,
    rating: 4.8,
    reviewCount: 124,
    duration: "2,5 saat",
    maxParticipants: 10,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/34512918/pexels-photo-34512918.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Çini Boyama" },
      { id: 2, url: "https://images.pexels.com/photos/27305610/pexels-photo-27305610.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Motifler" },
      { id: 3, url: "https://images.pexels.com/photos/34458891/pexels-photo-34458891.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Boyama Süreci" },
      { id: 4, url: "https://images.pexels.com/photos/26608833/pexels-photo-26608833.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Eserler" },
      { id: 5, url: "https://images.pexels.com/photos/34516581/pexels-photo-34516581.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Atölye" },
    ],
    description: `Yüzyıllık Türk çini sanatını deneyimleyin. Uzman bir sanatçı eşliğinde kendi çini tabağınızı tasarlayın ve boyayın. Atölye sonunda eserinizi eve götürün!

Karatay Medresesi'nin duvarlarını süsleyen turkuaz ve kobalt mavisi Selçuklu çinilerinden ilham alarak, geleneksel geometrik ve bitkisel motifleri kendi çini karonuza işleyeceksiniz. Önceden çizim veya sanat deneyimi gerekmemektedir.

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
      "Boyama süresi kişiye göre 2-2,5 saat arasında değişebilir",
      "Çocuklar 7 yaş ve üzeri katılabilir",
      "Pişirilmiş karo teslimatı 1 hafta içinde yapılmaktadır",
    ],
    organizer: {
      name: "Nesrin Kılıç",
      title: "Çini Sanatçısı",
      since: "7 yıldır organizatör",
      rating: 4.8,
      totalReviews: 234,
      bio: "Geleneksel Selçuklu çini sanatını yaşatmak için çalışıyorum. Atölyemde herkes sanatçı olabilir.",
      initials: "NK",
    },
    reviews: [
      { id: 1, name: "Gül Aydın", initials: "GA", rating: 5, date: "Nisan 2026", text: "Harika bir deneyim. Hiç çizim bilmememe rağmen çok güzel bir çini çıkardım, Nesrin Hanım çok yardımcı oldu." },
      { id: 2, name: "Serdar Koç", initials: "SK", rating: 4, date: "Mart 2026", text: "Kızımla birlikte katıldık, ikimiz de çok keyif aldık. Ürünlerimiz artık evimizde." },
      { id: 3, name: "Melek Yıldız", initials: "MY", rating: 5, date: "Şubat 2026", text: "Çiniyi pişirilmiş halde teslim alınca çok mutlu oldum. Her şey organize edilmişti." },
    ],
  },

  "beysehir-golu-gun-batimi-teknesi": {
    slug: "beysehir-golu-gun-batimi-teknesi",
    title: "Beyşehir Gölü Gün Batımı Teknesi",
    category: "Doğa & Macera",
    location: "Beyşehir, Konya",
    price: 450,
    rating: 4.9,
    reviewCount: 103,
    duration: "3 saat",
    maxParticipants: 15,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/19046796/pexels-photo-19046796.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Gün Batımı Teknesi" },
      { id: 2, url: "https://images.pexels.com/photos/14694302/pexels-photo-14694302.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Beyşehir Gölü" },
      { id: 3, url: "https://images.pexels.com/photos/4995191/pexels-photo-4995191.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Tekne" },
      { id: 4, url: "https://images.pexels.com/photos/21578697/pexels-photo-21578697.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Göl Manzarası" },
      { id: 5, url: "https://images.pexels.com/photos/28588616/pexels-photo-28588616.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Akşam Işığı" },
    ],
    description: `Türkiye'nin en büyük tatlı su gölü Beyşehir'de gün batımını tekne üzerinde izleyin. Arkadaşlarınızla unutulmaz bir akşam geçirin, göl manzarasında müzik ve eğlence!

650 km²'lik yüzölçümüyle Beyşehir Gölü, berrak suları, 32 adacığı ve Toros Dağları siluetiyle eşsiz bir ortam sunar. Gün batımıyla birlikte göl, turuncu ve pembe tonlara bürünerek büyülü bir atmosfer yaratır.

Teknede canlı müzik, atıştırmalıklar ve sıcak içeceklerle gün batımının tadını çıkarırken Beyşehir'in 13. yüzyıldan kalma Selçuklu mirasına dair kısa bir anlatım da dinleyebilirsiniz.`,
    included: [
      "Özel tekne turu (3 saat)",
      "Canlı müzik",
      "Atıştırmalık ve meşrubat",
      "Can yeleği",
      "Gün batımı fotoğraf rehberi",
    ],
    notes: [
      "Can yeleği tur boyunca giyilir",
      "Güneş kremi, şapka ve güneş gözlüğü getirin",
      "Deniz tutması olanlar önceden ilaç alsın",
      "Fotoğraf makinesi şiddetle tavsiye edilir",
      "Akşam 17:30'da Beyşehir iskelesinden hareket edilir",
    ],
    organizer: {
      name: "Okan Kara",
      title: "Doğa & Tekne Rehberi",
      since: "4 yıldır organizatör",
      rating: 4.9,
      totalReviews: 178,
      bio: "Beyşehir Gölü'nü ve çevresini avucunun içi gibi biliyorum. Doğa tutkunları için en iyi rotaları sunuyorum.",
      initials: "OK",
    },
    reviews: [
      { id: 1, name: "Tuba Yalçın", initials: "TY", rating: 5, date: "Nisan 2026", text: "Gün batımını gölde izlemek tarif edilemez bir his. Okan Bey harika bir organizasyon yaptı." },
      { id: 2, name: "Cem Aslan", initials: "CA", rating: 5, date: "Mart 2026", text: "Ailemizle en güzel akşamımız oldu. Canlı müzik atmosferi muhteşemdi." },
      { id: 3, name: "Yıldız Kaya", initials: "YK", rating: 5, date: "Şubat 2026", text: "Konya'ya her gelişimde tekrar katılmak istediğim bir deneyim. Göl manzarası inanılmaz." },
    ],
  },

  "leylekler-vadisi-doga-yuruyu": {
    slug: "leylekler-vadisi-doga-yuruyu",
    title: "Leylekler Vadisi Doğa Yürüyüşü",
    category: "Doğa & Macera",
    location: "Konya",
    price: 200,
    rating: 4.7,
    reviewCount: 68,
    duration: "4 saat",
    maxParticipants: 12,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/33669894/pexels-photo-33669894.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Vadi Manzarası" },
      { id: 2, url: "https://images.pexels.com/photos/32366539/pexels-photo-32366539.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Doğa Yürüyüşü" },
      { id: 3, url: "https://images.pexels.com/photos/34271800/pexels-photo-34271800.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Kuş Gözlemi" },
      { id: 4, url: "https://images.pexels.com/photos/32532262/pexels-photo-32532262.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Piknik Alanı" },
      { id: 5, url: "https://images.pexels.com/photos/10642193/pexels-photo-10642193.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Vadi" },
    ],
    description: `Konya'nın saklı cenneti Leylekler Vadisi'nde rehber eşliğinde doğa yürüyüşü yapın. Kuş gözlemi, piknik ve nefes kesen vadi manzarası sizi bekliyor!

Şehrin gürültüsünden uzakta, doğanın tam kalbinde gerçekleşen bu yürüyüşte bölgenin flora ve faunası hakkında bilgi edinirken leyleklerin doğal yaşam alanlarını gözlemleyeceksiniz.

Yürüyüşün ortasında gölgeli bir alanda hazırlanan piknik molası, hem dinlenme hem de sosyalleşme imkânı sunar. Doğa rehberimiz bölgenin ekolojisini ve kuş türlerini anlaşılır dille aktaracak.`,
    included: [
      "Uzman doğa rehberi",
      "Piknik yiyecekleri ve içecekler",
      "Dürbün kullanım imkânı",
      "Doğa ve kuş gözlemi rehber kitabı",
      "Konya merkez - vadi ulaşımı",
    ],
    notes: [
      "Rahat yürüyüş ayakkabısı zorunludur",
      "Güneş kremi ve şapka getirin",
      "Yeterli su bulundurunuz (1.5 lt önerilir)",
      "Hamile ve kronik rahatsızlığı olanlar önceden belirtsin",
      "Sabah 08:00'de hareket edilmektedir",
    ],
    organizer: {
      name: "Ayşe Doğan",
      title: "Doğa Rehberi & Biyolog",
      since: "5 yıldır organizatör",
      rating: 4.7,
      totalReviews: 112,
      bio: "Biyoloji mezunu, sertifikalı doğa rehberi. Konya'nın doğal güzelliklerini keşfetmek ve korumak için çalışıyorum.",
      initials: "AD",
    },
    reviews: [
      { id: 1, name: "Mert Güneş", initials: "MG", rating: 5, date: "Nisan 2026", text: "Konya'nın böyle bir doğa harikasına sahip olduğunu bilmiyordum. Ayşe Hanım çok bilgili ve enerjik bir rehber." },
      { id: 2, name: "Deniz Yıldız", initials: "DY", rating: 4, date: "Mart 2026", text: "Leylekleri yakından görmek muhteşemdi. Piknik alanı da çok güzeldi, tavsiye ederim." },
      { id: 3, name: "Berk Çetin", initials: "BÇ", rating: 5, date: "Şubat 2026", text: "Şehrin içinde bu kadar huzurlu bir yer olduğuna şaşırdım. Kesinlikle tekrar katılacağım." },
    ],
  },

  "mevlana-muzesi-gece-turu-sema": {
    slug: "mevlana-muzesi-gece-turu-sema",
    title: "Mevlana Müzesi Gece Turu + Sema",
    category: "Kültür & Tarih",
    location: "Karatay, Konya",
    price: 400,
    rating: 5.0,
    reviewCount: 97,
    duration: "3 saat",
    maxParticipants: 12,
    isFeatured: true,
    images: [
      { id: 1, url: "https://images.pexels.com/photos/36919394/pexels-photo-36919394.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Mevlana Müzesi" },
      { id: 2, url: "https://images.pexels.com/photos/32566167/pexels-photo-32566167.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Gece Turu" },
      { id: 3, url: "https://images.pexels.com/photos/34946062/pexels-photo-34946062.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Sema Töreni" },
      { id: 4, url: "https://images.pexels.com/photos/33420517/pexels-photo-33420517.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Ruhani Atmosfer" },
      { id: 5, url: "https://images.pexels.com/photos/32083666/pexels-photo-32083666.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Konya Gecesi" },
    ],
    description: `Mevlana Müzesi'ni uzman rehber eşliğinde keşfedin, akşam Kültür Merkezi'nde canlı sema gösterisi izleyin. Konya'nın ruhani atmosferini en güzel şekilde deneyimleyin!

Hz. Mevlana'nın yeşil kubbesinin altında, 13. yüzyıldan kalma el yazmalarını ve nadide Selçuklu eserlerini gece sessizliğinde keşfedeceksiniz. Müze turu sonrası Konya Kültür Merkezi'nde gerçekleşen özel sema gösterisinde dönen dervişlerin ruhani dansını ön sıradan izleyeceksiniz.

Bu kombinasyon, Konya'nın Mevlevi mirasını en derin şekilde deneyimlemek isteyenler için özel olarak tasarlanmıştır.`,
    included: [
      "Uzman tarih & tasavvuf rehberi",
      "Müze giriş bileti",
      "Özel sema gösterisi bileti (ön sıra)",
      "Tör sonrası çay ikramı",
      "Türkçe ve İngilizce anlatım",
    ],
    notes: [
      "Saygılı kıyafet giyinilmesi önerilir",
      "Müze ve sema alanında sessizlik esastır",
      "Flaşlı fotoğraf çekimi kesinlikle yasaktır",
      "Tur başlamadan 15 dk önce müze girişinde olunuz",
      "Çocuklar 12 yaş ve üzeri katılabilir",
    ],
    organizer: {
      name: "Ahmet Yılmaz",
      title: "Tarih & Kültür Rehberi",
      since: "5 yıldır organizatör",
      rating: 5.0,
      totalReviews: 312,
      bio: "Selçuk Üniversitesi Tarih bölümü mezunu, profesyonel turist rehberi. Mevlevi kültürü ve Konya tarihi üzerine uzman.",
      initials: "AY",
    },
    reviews: [
      { id: 1, name: "Ayşe Karagöz", initials: "AK", rating: 5, date: "Nisan 2026", text: "Müze turu ve ardından sema — bu ikiliyi aynı gecede yaşamak inanılmazdı. Ahmet Bey'in anlatımı çok etkileyiciydi." },
      { id: 2, name: "Mehmet Demir", initials: "MD", rating: 5, date: "Mart 2026", text: "Konya'ya birçok kez geldim ama bu deneyim gerçekten farklıydı. Sema'yı ön sıradan izlemek büyülüydü." },
      { id: 3, name: "Fatma Öztürk", initials: "FÖ", rating: 5, date: "Mart 2026", text: "Yurt dışından misafirlerimizi getirdik, hepsi hayran kaldı. Konya'nın ruhunu tam hissettiren bir gece." },
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
  experienceTitle,
}: {
  price: number
  rating: number
  reviewCount: number
  maxParticipants: number
  experienceSlug: string
  experienceTitle: string
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

    const { error } = await supabase.from("bookings").insert({
      experience_slug: experienceSlug,
      experience_title: experienceTitle,
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
          <><Loader2 className="h-5 w-5 animate-spin mr-2" />Gönderiliyor...</>
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
                  experienceTitle={exp.title}
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
