export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Sol — marka paneli (yalnız masaüstünde) */}
      <div className="hidden lg:flex flex-col justify-between bg-[#7B2D35] p-12 text-white relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />

        <a href="/" className="text-2xl font-bold tracking-tight relative z-10">
          konyamda
        </a>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-medium leading-relaxed text-white/90">
            &ldquo;Her yer Kabe, her gönül Mevlana.&rdquo;
          </blockquote>
          <p className="text-white/60 text-sm">
            Konya&apos;nın eşsiz deneyimlerini yerel organizatörlerle keşfet.
          </p>

          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-[#f0c4c8]">50+</p>
              <p className="text-white/60 text-sm mt-0.5">Deneyim</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#f0c4c8]">500+</p>
              <p className="text-white/60 text-sm mt-0.5">Mutlu Katılımcı</p>
            </div>
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">
          © 2025 konyamda
        </p>
      </div>

      {/* Sağ — form alanı */}
      <div className="flex items-center justify-center p-6 bg-white">
        {children}
      </div>
    </div>
  )
}
