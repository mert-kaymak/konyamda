# KonyamDa

Konya'nın yerel deneyimlerini — atölye, tur ve aktivitelerini — bir araya getiren rezervasyon platformu. Organizatörler kendi deneyimlerini yönetebilir, kullanıcılar keşfedip rezervasyon yapabilir.

---

## Özellikler

- **Kullanıcı tarafı** — Deneyimleri keşfet, rezervasyon yap, geçmişi takip et
- **Organizatör paneli** — Deneyim ekle / düzenle / sil, rezervasyonları görüntüle
- **Kimlik doğrulama** — E-posta + şifre ve Google OAuth (Supabase Auth)
- **Şifre sıfırlama** — E-posta ile sıfırlama akışı
- **Rol tabanlı erişim** — `is_organizer` bayrağı ile ayrı paneller
- **Route koruması** — `proxy.ts` (Next.js 16 Middleware) ile sunucu taraflı yönlendirme

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Backend / Auth / DB | Supabase (PostgreSQL + Row Level Security) |
| Dil | TypeScript |
| Font | Geist (next/font) |

---

## Ön Gereksinimler

- Node.js 18+
- Bir [Supabase](https://supabase.com) projesi

---

## Kurulum

### 1. Depoyu klonla

```bash
git clone <repo-url>
cd konyamda
npm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp .env.example .env.local
```

`.env.local` dosyasını aç ve Supabase proje bilgilerini doldur:

```
NEXT_PUBLIC_SUPABASE_URL=https://<proje-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

> Supabase Dashboard → Project Settings → API sekmesinden bulabilirsin.

### 3. Veritabanı şemasını çalıştır

Supabase Dashboard → SQL Editor'e git ve `supabase/schema.sql` dosyasının tüm içeriğini yapıştırıp çalıştır.

Bu işlem şu tabloları oluşturur:
- `profiles` — Kullanıcı profilleri (auth trigger ile otomatik)
- `categories` — Deneyim kategorileri (başlangıç verileriyle)
- `experiences` — Deneyimler
- `bookings` — Rezervasyonlar
- `reviews` — Değerlendirmeler

### 4. Google OAuth (isteğe bağlı)

Supabase Dashboard → Authentication → Providers → Google bölümünde OAuth credentials ekle.
Callback URL: `https://<domain>/auth/callback`

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

---

## Scriptler

```bash
npm run dev      # Geliştirme sunucusu (Turbopack)
npm run build    # Üretim build'i
npm run start    # Üretim sunucusu
```

---

## Proje Yapısı

```
konyamda/
├── app/
│   ├── (auth)/              # Auth layout grubu
│   │   ├── login/
│   │   ├── register/
│   │   ├── sifremi-unuttum/
│   │   └── yeni-sifre/
│   ├── auth/callback/       # OAuth & şifre sıfırlama callback
│   ├── dashboard/           # Kullanıcı paneli
│   ├── deneyimler/          # Liste ve detay sayfaları
│   ├── organizator/         # Organizatör paneli (korumalı)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Ana sayfa
├── components/
│   ├── ui/                  # shadcn bileşenleri
│   ├── navbar.tsx
│   └── footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Tarayıcı taraflı Supabase client
│   │   └── server.ts        # Sunucu taraflı Supabase client
│   └── utils.ts
├── supabase/
│   └── schema.sql           # Veritabanı şeması + RLS politikaları
├── types/
│   └── index.ts
├── proxy.ts                 # Route koruması (Next.js 16 Middleware)
├── next.config.ts
└── .env.example
```

---

## Yayına Alma (Vercel)

1. Vercel'e projeyi import et
2. Environment Variables bölümüne `.env.local` içindeki değişkenleri ekle
3. Deploy et — Vercel Next.js'i otomatik algılar

Alternatif olarak herhangi bir Node.js 18+ ortamında:

```bash
npm run build
npm run start
```

---

## Veritabanı Notları

- Tüm tablolarda **Row Level Security (RLS)** aktif
- Yeni kullanıcı kaydında `profiles` tablosu otomatik doldurulur (trigger)
- Organizatör yetkisi: `profiles.is_organizer = true`
- Deneyim ekleme sadece `is_organizer = true` olan kullanıcılara izin verir
