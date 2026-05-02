"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"

function toTurkish(msg: string): string {
  const map: Record<string, string> = {
    "User already registered": "Bu e-posta adresi zaten kayıtlı.",
    "Password should be at least 6 characters": "Şifre en az 6 karakter olmalıdır.",
    "Unable to validate email address: invalid format": "Geçersiz e-posta adresi.",
    "Signup is disabled": "Kayıt şu an kapalı.",
    "Email rate limit exceeded": "Çok fazla deneme yapıldı, lütfen bekleyin.",
  }
  return map[msg] ?? msg
}

function PasswordStrength({ password }: { password: string }) {
  const score = [/.{6,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password)
  ).length

  if (!password) return null

  const levels = [
    { label: "Çok Zayıf", color: "bg-red-400" },
    { label: "Zayıf", color: "bg-orange-400" },
    { label: "Orta", color: "bg-yellow-400" },
    { label: "Güçlü", color: "bg-green-400" },
    { label: "Çok Güçlü", color: "bg-green-600" },
  ]
  const level = levels[Math.max(0, score - (score > 0 ? 1 : 0))]

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? level.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">{level.label}</p>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isOrganizer, setIsOrganizer] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // İstemci tarafı doğrulama
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      return
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      return
    }

    setLoading(true)
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(toTurkish(signUpError.message))
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  if (success) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Neredeyse tamam!</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">{success}</p>
        </div>
        <Button asChild className="w-full bg-[#7B2D35] hover:bg-[#6a2630] text-white">
          <Link href="/login">Giriş Sayfasına Dön</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Mobilde logo */}
      <div className="lg:hidden text-center">
        <Link href="/" className="text-2xl font-bold text-[#7B2D35]">
          konyamda
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hesap oluşturun</h1>
        <p className="mt-1 text-sm text-gray-500">
          Konya&apos;nın en güzel deneyimlerine katılın.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Ad Soyad */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Adınız Soyadınız"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11"
          />
        </div>

        {/* E-posta */}
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

        {/* Şifre */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="En az 6 karakter"
              autoComplete="new-password"
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
          <PasswordStrength password={password} />
        </div>

        {/* Şifre Tekrar */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Şifrenizi tekrar girin"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-11 pr-10 ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-300 focus-visible:ring-red-300"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-xs text-red-500">Şifreler eşleşmiyor.</p>
          )}
        </div>

        {/* Organizatör checkbox */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Checkbox
            id="isOrganizer"
            checked={isOrganizer}
            onCheckedChange={(v) => setIsOrganizer(Boolean(v))}
            className="mt-0.5 data-[state=checked]:bg-[#7B2D35] data-[state=checked]:border-[#7B2D35]"
          />
          <div>
            <Label htmlFor="isOrganizer" className="font-medium cursor-pointer leading-none">
              Organizatör olarak kayıt ol
            </Label>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Kendi deneyimlerinizi oluşturup yönetebilirsiniz.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kayıt Ol"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/login" className="font-medium text-[#7B2D35] hover:underline">
          Giriş Yap
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Kayıt olarak{" "}
        <Link href="/kullanim-kosullari" className="underline">Kullanım Koşulları</Link>
        {" "}ve{" "}
        <Link href="/gizlilik" className="underline">Gizlilik Politikası</Link>
        &apos;nı kabul etmiş olursunuz.
      </p>
    </div>
  )
}
