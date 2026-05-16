<div align="center">
  <img src="public/logo.png" alt="konyamda logo" width="160" />

  <h1>konyamda</h1>

  <p>
    Konya'nın yerel deneyimlerini keşfet, rezervasyon yap, yaşat.<br/>
    <em>Discover, book and experience the best of Konya.</em>
  </p>

  <p>
    <a href="https://konyam-da.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Canlı%20Site-konyam--da.vercel.app-7B2D35?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Vercel-deployed-black?style=flat-square&logo=vercel" />
  </p>
</div>

---

## Hakkında / About

**TR:** konyamda, Konya'nın atölye, tur ve aktivitelerini tek çatı altında toplayan yerel deneyim platformudur. Kullanıcılar ilgi alanlarına göre deneyim keşfedip rezervasyon yaparken, organizatörler kendi deneyimlerini kolayca yönetebilir.

**EN:** konyamda is a local experience marketplace built for Konya, Turkey. Users explore and book workshops, tours, and activities across five categories, while organizers manage their listings and reservations through a dedicated dashboard.

---

## Özellikler / Features

- **Deneyim Keşfi** — Kategori ve arama filtreleriyle 50+ özgün yerel deneyime ulaş
- **Rezervasyon Sistemi** — Anlık rezervasyon yap, geçmişini ve durumunu takip et
- **Kimlik Doğrulama** — E-posta/şifre ve Google OAuth ile güvenli giriş (Supabase Auth)
- **Rol Tabanlı Erişim** — Kullanıcı ve organizatör için ayrı paneller, sunucu taraflı route koruması
- **Organizatör Paneli** — Deneyim ekle, düzenle, sil; gelen rezervasyonları görüntüle
- **Şifre Sıfırlama** — E-posta tabanlı güvenli sıfırlama akışı

---

## Teknoloji Yığını / Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript 5 |
| UI | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Backend / Auth / DB | Supabase (PostgreSQL + Row Level Security) |
| Deploy | Vercel |
| Font | Geist (next/font) |

---

## Ekran Görüntüleri / Screenshots

> Ekran görüntüleri yakında eklenecektir.
> *Screenshots coming soon.*

| Ana Sayfa | Deneyimler | Organizatör Paneli |
|:---------:|:----------:|:-----------------:|
| ![Ana Sayfa](docs/screenshots/home.png) | ![Deneyimler](docs/screenshots/experiences.png) | ![Organizatör](docs/screenshots/organizer.png) |

---

## Kurulum / Setup

### Ön gereksinimler

- Node.js 18+
- Bir [Supabase](https://supabase.com) projesi

### 1. Repoyu klonla

```bash
git clone https://github.com/mert-kaymak/KonyamDa.git
cd KonyamDa
npm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp .env.example .env.local
```

`.env.local` dosyasını açıp Supabase bilgilerini gir:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proje-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

> Supabase Dashboard → Project Settings → API

### 3. Veritabanı şemasını çalıştır

Supabase Dashboard → SQL Editor'e git, `supabase/schema.sql` içeriğini yapıştır ve çalıştır.

Oluşturulan tablolar: `profiles`, `categories`, `experiences`, `bookings`, `reviews`

### 4. (İsteğe bağlı) Google OAuth

Supabase Dashboard → Authentication → Providers → Google  
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

## Ekip / Team

<table>
  <tr>
    <td align="center">
      <img src="public/mert.jpg.png" width="80" style="border-radius:50%" /><br/>
      <b>Mert Kaymak</b><br/>
      <sub>Kurucu & CEO</sub>
    </td>
    <td align="center">
      <img src="public/ahmet.jpg.jpeg" width="80" style="border-radius:50%" /><br/>
      <b>Ahmet Alperen Arslan</b><br/>
      <sub>Kurucu Ortak & CTO</sub>
    </td>
    <td align="center">
      <img src="public/toygun.jpg.jpeg" width="80" style="border-radius:50%" /><br/>
      <b>Toygun Galyan</b><br/>
      <sub>Kurucu Ortak & CMO</sub>
    </td>
  </tr>
</table>

---

## İletişim / Contact

**E-posta:** iletisim.konyamda@gmail.com  
**Web:** [konyam-da.vercel.app](https://konyam-da.vercel.app)  
**Adres:** Selçuklu, Konya, Türkiye

---

<div align="center">
  <sub>© 2026 konyamda — Konya'nın en canlı deneyim platformu</sub>
</div>
