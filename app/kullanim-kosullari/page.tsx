import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    title: "1. Hizmetin Kapsamı",
    content: `konyamda, Konya'daki yerel deneyimleri keşfetmenizi ve rezervasyon yapmanızı sağlayan bir platformdur. Platform üzerinden gerçekleştirilen deneyimler bağımsız organizatörler tarafından sunulmaktadır.`,
  },
  {
    title: "2. Hesap Oluşturma",
    content: `Platforma kayıt olarak doğru ve güncel bilgi sağlamayı kabul edersiniz. Hesabınızın güvenliğinden siz sorumlusunuz; şifrenizi kimseyle paylaşmayınız.`,
  },
  {
    title: "3. Rezervasyon ve Ödeme",
    content: `Rezervasyon talebi oluşturulduktan sonra organizatörün onayı beklenir. Ödeme, onay sonrasında tahsil edilir. Fiyatlar kişi başı Türk Lirası olarak belirtilmiştir ve KDV dahildir.`,
  },
  {
    title: "4. İptal ve İade Politikası",
    content: `Deneyim tarihinden 24 saat öncesine kadar yapılan iptallerde ücretin tamamı iade edilir. 24 saat içinde yapılan iptallerde iade yapılmaz. Organizatörün iptal etmesi durumunda ücretin tamamı iade edilir.`,
  },
  {
    title: "5. Kullanıcı Sorumlulukları",
    content: `Platformu yalnızca yasal amaçlar için kullanmayı, başka kullanıcılara veya organizatörlere zarar verici davranışlardan kaçınmayı ve yorum/içeriklerin gerçek deneyimlere dayanmasını sağlamayı kabul edersiniz.`,
  },
  {
    title: "6. Fikri Mülkiyet",
    content: `Platform üzerindeki tüm içerik, tasarım ve marka unsurları konyamda'ya aittir. İzinsiz kopyalanması veya dağıtılması yasaktır.`,
  },
  {
    title: "7. Sorumluluk Sınırlaması",
    content: `konyamda bir aracı platform olarak hareket eder. Organizatörlerin sunduğu deneyimlerin kalitesinden birincil sorumlu organizatörlerdir. Teknik arızalar veya mücbir sebepler nedeniyle oluşan kayıplardan sorumluluk kabul edilmez.`,
  },
  {
    title: "8. Değişiklikler",
    content: `Bu koşulları zaman zaman güncelleyebiliriz. Önemli değişiklikler e-posta ile bildirilir. Platformu kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz anlamına gelir.`,
  },
]

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#7B2D35] text-white py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <p className="text-[#f0c4c8]/70 text-sm font-medium uppercase tracking-widest mb-4">
              Yasal
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kullanım Koşulları</h1>
            <p className="text-white/70 text-sm">Son güncelleme: Mayıs 2025</p>
          </div>
        </section>

        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              <p className="text-gray-600 leading-relaxed text-sm">
                konyamda platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz.
                Lütfen dikkatlice okuyunuz.
              </p>
              <Separator />
              {sections.map((s, i) => (
                <div key={s.title}>
                  <h2 className="font-semibold text-[#1a1a1a] mb-3">{s.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
                  {i < sections.length - 1 && <Separator className="mt-8" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
