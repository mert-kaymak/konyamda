import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Heart, Target, Users } from "lucide-react"

const team = [
  {
    initials: "ZA",
    name: "Zeynep Arslan",
    title: "Kurucu & CEO",
    bio: "Konya'da doğup büyüdü. Turizm ve deneyim ekonomisi alanında 8 yıllık geçmişiyle konyamda'nın temelini attı.",
    color: "bg-[#7B2D35]",
  },
  {
    initials: "MC",
    name: "Mehmet Çelik",
    title: "Operasyon Direktörü",
    bio: "Otelcilik ve etkinlik yönetimi mezunu. Organizatörlerle ilişkileri koordine eder, platform kalitesini denetler.",
    color: "bg-[#92400e]",
  },
  {
    initials: "AK",
    name: "Ayşe Karakaş",
    title: "Topluluk Yöneticisi",
    bio: "Konya'nın kültürel mirasını dijital dünyaya taşıma tutkusuyla platforma katılan yerel tarih rehberi.",
    color: "bg-[#1a472a]",
  },
]

const values = [
  {
    icon: Heart,
    title: "Konya'ya Bağlılık",
    desc: "Her deneyim, Konya'nın dokusundan beslenir. Yerel organizatörleri destekler, kentin kimliğini yaşatırız.",
  },
  {
    icon: Target,
    title: "Özgünlük",
    desc: "Klişe turizm paketleri yerine; gerçek insanlarla, gerçek mekânlarda, gerçek anlar.",
  },
  {
    icon: Users,
    title: "Topluluk",
    desc: "Katılımcı, organizatör ve şehir birbirine bağlı. Büyüdüğümüzde Konya büyür.",
  },
]

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#7B2D35] text-white py-20 md:py-28">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <p className="text-[#f0c4c8]/70 text-sm font-medium uppercase tracking-widest mb-4">
              Biz kimiz
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Konya&apos;yı yaşatan platform
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              konyamda, 2024 yılında Konya&apos;nın eşsiz kültürünü, mutfağını ve insanını
              dünyayla buluşturmak için kuruldu.
            </p>
          </div>
        </section>

        {/* Hikaye */}
        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6">Hikayemiz</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <p>
                Konya&apos;ya gelen ziyaretçiler Mevlana Müzesi&apos;ni geziyor, bir etli ekmek yiyor
                ve şehri tanımadan ayrılıyordu. Oysa Konya&apos;nın sunabileceği çok daha fazlası
                vardı: Sille&apos;nin taş sokakları, Karatay&apos;ın çini atölyeleri, Meram&apos;ın
                tarihi bağları, ustalara özel sufi müzik dersleri...
              </p>
              <p>
                Bu deneyimleri yaşatan yerel ustalar ve rehberler vardı, ama onlara ulaşmak
                zordu. konyamda bu köprüyü kurmak için doğdu: yerel bilgiyi, dijital erişimle
                buluşturmak.
              </p>
              <p>
                Bugün 50&apos;den fazla özgün deneyim, 20&apos;den fazla yerel organizatör ve
                yüzlerce mutlu katılımcıyla Konya&apos;nın en canlı deneyim platformuyuz.
              </p>
            </div>
          </div>
        </section>

        {/* Misyon & Değerler */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">
                Misyonumuz & Değerlerimiz
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Her deneyimin arkasında bir hikaye, her hikayenin arkasında Konya var.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div key={v.title} className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-[#7B2D35]/10 mb-4">
                    <v.icon className="h-6 w-6 text-[#7B2D35]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Ekip */}
        <section className="py-16 bg-[#F5F0E8]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">Ekibimiz</h2>
              <p className="text-gray-500">Konya&apos;yı seven, Konya için çalışan insanlar.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm"
                >
                  <div
                    className={`${member.color} h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a]">{member.name}</h3>
                  <p className="text-sm text-[#7B2D35] font-medium mt-0.5 mb-3">{member.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* İletişim */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">Bize Ulaşın</h2>
            <p className="text-gray-500 mb-10">Sorularınız veya iş birliği teklifleriniz için.</p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-2 p-5 bg-[#F5F0E8] rounded-lg">
                <Mail className="h-5 w-5 text-[#7B2D35]" />
                <p className="text-sm font-medium text-[#1a1a1a]">E-posta</p>
                <p className="text-sm text-gray-500">merhaba@konyamda.com</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-5 bg-[#F5F0E8] rounded-lg">
                <Phone className="h-5 w-5 text-[#7B2D35]" />
                <p className="text-sm font-medium text-[#1a1a1a]">Telefon</p>
                <p className="text-sm text-gray-500">+90 332 000 00 00</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-5 bg-[#F5F0E8] rounded-lg">
                <MapPin className="h-5 w-5 text-[#7B2D35]" />
                <p className="text-sm font-medium text-[#1a1a1a]">Adres</p>
                <p className="text-sm text-gray-500">Selçuklu, Konya</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
