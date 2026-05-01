"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"

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

export default function NewPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      return
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError("Şifre güncellenemedi. Bağlantı süresi dolmuş olabilir.")
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  if (done) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Şifre güncellendi!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Yeni şifrenizle giriş yapılıyor...
          </p>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Yeni şifre belirle</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hesabınız için güçlü bir şifre seçin.
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
          <Label htmlFor="password">Yeni Şifre</Label>
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

        <Button
          type="submit"
          className="w-full h-11 bg-[#7B2D35] hover:bg-[#6a2630] text-white font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Şifremi Güncelle"}
        </Button>
      </form>
    </div>
  )
}
