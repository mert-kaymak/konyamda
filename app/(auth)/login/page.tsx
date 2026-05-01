"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

function toTurkish(msg: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-posta veya şifre hatalı.",
    "Email not confirmed": "E-posta adresinizi doğrulamanız gerekiyor.",
    "Too many requests": "Çok fazla deneme yapıldı. Lütfen bekleyin.",
    "User not found": "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.",
    "auth_callback_failed": "Giriş sırasında bir hata oluştu. Tekrar deneyin.",
  }
  return map[msg] ?? msg
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(toTurkish(error.message))
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Mobilde görünen logo */}
      <div className="lg:hidden text-center">
        <Link href="/" className="text-2xl font-bold text-[#7B2D35]">
          konyamda
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tekrar hoş geldiniz</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hesabınıza giriş yapın, Konya&apos;yı keşfetmeye devam edin.
        </p>
      </div>

      {/* Hata mesajı */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Şifre</Label>
            <Link
              href="/sifremi-unuttum"
              className="text-xs text-[#7B2D35] hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Giriş Yap"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Hesabınız yok mu?{" "}
        <Link href="/register" className="font-medium text-[#7B2D35] hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  )
}
