"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/yeni-sifre`,
    })

    if (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">E-posta gönderildi</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-700">{email}</span> adresine şifre
            sıfırlama bağlantısı gönderdik. Gelen kutunuzu kontrol edin.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Giriş sayfasına dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="lg:hidden text-center">
        <Link href="/" className="text-2xl font-bold text-[#7B2D35]">
          KonyamDa
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Şifremi unuttum</h1>
        <p className="mt-1 text-sm text-gray-500">
          E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sıfırlama Bağlantısı Gönder"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="font-medium text-[#7B2D35] hover:underline">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </div>
  )
}
