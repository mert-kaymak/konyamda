import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    title: "1. Toplanan Veriler",
    content: `konyamda olarak platformu kullandığınızda aşağıdaki verileri toplayabiliriz: ad ve soyadınız, e-posta adresiniz, telefon numaranız, rezervasyon ve ödeme bilgileriniz. Bu veriler yalnızca platform hizmetlerini sağlamak amacıyla kullanılır.`,
  },
  {
    title: "2. Verilerin Kullanımı",
    content: `Topladığımız veriler; rezervasyon işlemlerinin yürütülmesi, hesap yönetimi, size özel deneyim önerileri sunulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır. Verileriniz üçüncü taraflarla yalnızca rezervasyon sürecinde zorunlu olan organizatörlerle paylaşılır.`,
  },
  {
    title: "3. Çerezler",
    content: `Sitemiz oturum yönetimi ve kullanıcı deneyimini iyileştirmek için zorunlu çerezler kullanmaktadır. Analitik çerezler için tarayıcı ayarlarınızdan tercihlerinizi değiştirebilirsiniz.`,
  },
  {
    title: "4. Veri Güvenliği",
    content: `Verileriniz Supabase altyapısı üzerinde şifrelenmiş biçimde saklanmaktadır. Şifreler hiçbir zaman düz metin olarak tutulmaz. Platform SSL/TLS ile korunmaktadır.`,
  },
  {
    title: "5. Veri Saklama Süresi",
    content: `Hesabınız aktif olduğu sürece verileriniz saklanır. Hesabınızı sildiğinizde kişisel verileriniz 30 gün içinde sistemden kalıcı olarak silinir. Yasal zorunluluk gerektiren finansal kayıtlar mevzuata uygun süre boyunca tutulabilir.`,
  },
  {
    title: "6. Haklarınız",
    content: `KVKK kapsamında verilerinize erişme, düzeltme, silme ve itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için merhaba@konyamda.com adresine e-posta gönderebilirsiniz.`,
  },
  {
    title: "7. İletişim",
    content: `Gizlilik politikamız hakkında sorularınız için: merhaba@konyamda.com — Adres: Selçuklu, Konya, Türkiye.`,
  },
]

export default function GizlilikPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#7B2D35] text-white py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <p className="text-[#f0c4c8]/70 text-sm font-medium uppercase tracking-widest mb-4">
              Yasal
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Gizlilik Politikası</h1>
            <p className="text-white/70 text-sm">Son güncelleme: Mayıs 2025</p>
          </div>
        </section>

        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              <p className="text-gray-600 leading-relaxed text-sm">
                konyamda olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
                Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve
                haklarınızı açıklamaktadır.
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
