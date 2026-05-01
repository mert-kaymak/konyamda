import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center bg-[#F5F0E8] px-4 py-20">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#7B2D35]/10 mb-8">
            <MapPin className="h-9 w-9 text-[#7B2D35]" />
          </div>

          <p className="text-[#7B2D35] font-semibold text-sm uppercase tracking-widest mb-3">
            404
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
            Sayfa bulunamadı
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
            Yine de Konya&apos;da keşfedecek çok şey var.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-[#7B2D35] hover:bg-[#6a2630] text-white h-11 px-6"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#7B2D35] text-[#7B2D35] hover:bg-[#7B2D35] hover:text-white h-11 px-6"
            >
              <Link href="/deneyimler">Deneyimleri Keşfet</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
