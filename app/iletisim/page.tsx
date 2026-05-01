"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "E-posta",
    value: "merhaba@konyamda.com",
    href: "mailto:merhaba@konyamda.com",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+90 332 000 00 00",
    href: "tel:+903320000000",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Selçuklu, Konya, Türkiye",
    href: null,
  },
]

export default function IletisimPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#7B2D35] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <p className="text-[#f0c4c8]/70 text-sm font-medium uppercase tracking-widest mb-4">
              İletişim
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bizimle iletişime geçin</h1>
            <p className="text-white/70 leading-relaxed">
              Sorularınız, organizatör başvurunuz veya iş birliği teklifleriniz için
              aşağıdaki formu doldurun ya da doğrudan ulaşın.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                {sent ? (
                  <div className="flex flex-col items-center justify-center text-center h-full py-8 gap-4">
                    <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a]">Mesajınız alındı!</h3>
                    <p className="text-sm text-gray-500">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 border-[#7B2D35] text-[#7B2D35]"
                      onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }) }}
                    >
                      Yeni mesaj gönder
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Mesaj Gönder</h2>

                    <div className="space-y-1.5">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Adınız Soyadınız"
                        className="h-11"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="ornek@email.com"
                        className="h-11"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">Mesaj</Label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="Mesajınızı buraya yazın..."
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-[#1a1a1a] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
                    >
                      Gönder
                    </Button>
                  </form>
                )}
              </div>

              {/* İletişim bilgileri */}
              <div className="flex flex-col justify-center gap-8">
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Doğrudan ulaşın</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Hafta içi 09:00–18:00 saatleri arasında tüm kanallardan
                    destek sağlıyoruz.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-[#7B2D35]/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-[#7B2D35]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium text-[#1a1a1a] hover:text-[#7B2D35] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[#1a1a1a]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#7B2D35] text-white rounded-lg p-6">
                  <p className="font-semibold mb-1">Organizatör olmak ister misiniz?</p>
                  <p className="text-sm text-white/70 mb-4">
                    Kendi deneyimlerinizi oluşturun, Konya&apos;ya değer katın.
                  </p>
                  <a
                    href="/organizator"
                    className="inline-block text-sm font-medium text-[#f0c4c8] hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Organizatör başvurusu yap →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
