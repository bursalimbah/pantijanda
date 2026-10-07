import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Gem, HeartHandshake, ShieldCheck, Sparkles, Star, Store, Users, CalendarDays, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { initials, formatRupiah } from '@/lib/utils'
import LevelBadge from '@/components/LevelBadge'

export default function Home() {
  const { state } = useStore()
  const widows = state.users.filter((u) => u.isWidow)
  const publishedEvents = state.events.filter((e) => e.status === 'published')

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-fuchsia-600 to-violet-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="gold" className="mb-4">Kategori Sosial — Siapapun Bisa Mendaftar</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">PantiJanda</h1>
            <p className="mt-3 text-xl md:text-2xl font-semibold text-pink-100">Pahlawan Sejati, Jawara Andalan</p>
            <p className="mt-5 max-w-lg text-pink-100/90">Platform pemberdayaan member berstatus janda: profil terverifikasi, level &amp; badge, event dengan tiket QR, akademi berbasis AI, lapak marketplace, hingga dukungan modal dari masyarakat.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="gold" asChild><Link to="/register">Daftar Sekarang <ArrowRight /></Link></Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20" asChild><Link to="/donate"><Gift /> Donasi &amp; Dukungan</Link></Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { icon: Crown, t: 'High Society', d: 'Level tertinggi berdasarkan KPI & kontribusi' },
              { icon: Star, t: 'Wonder Woman', d: 'Titik awal setiap member janda' },
              { icon: Store, t: 'Marketplace', d: 'Buka lapak, share keahlian & jualan' },
              { icon: CalendarDays, t: 'Event & Tiket QR', d: 'Buat event, cetak tiket & absensi qrcode' },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/20">
                <f.icon className="h-7 w-7 text-amber-300" />
                <p className="mt-2 font-bold">{f.t}</p>
                <p className="text-sm text-pink-100/80">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: widows.length, l: 'Member Janda Terdaftar', i: Users },
            { n: publishedEvents.length, l: 'Event Aktif', i: CalendarDays },
            { n: state.marketplace.length, l: 'Lapak Marketplace', i: Store },
            { n: state.donations.filter((d) => d.status !== 'menunggu').length, l: 'Donasi Tersalurkan', i: HeartHandshake },
          ].map((s) => (
            <Card key={s.l} className="shadow-lg"><CardContent className="flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><s.i className="h-5 w-5" /></span>
              <div><p className="text-2xl font-extrabold">{s.n}</p><p className="text-xs text-muted-foreground font-semibold">{s.l}</p></div>
            </CardContent></Card>
          ))}
        </div>
      </section>

      {/* Member janda publik — info privat disembunyikan */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold">Para Jawara Andalan</h2>
            <p className="text-sm text-muted-foreground">Semua member berstatus janda tampil di halaman depan. Data privat (alamat, WA, bank, dokumen) disembunyikan.</p>
          </div>
          <Button variant="outline" asChild><Link to="/members">Lihat Semua <ArrowRight /></Link></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {widows.slice(0, 3).map((u) => (
            <Card key={u.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex-row items-center gap-3">
                <Avatar className="h-14 w-14"><AvatarFallback className="text-base">{initials(u.fullName)}</AvatarFallback></Avatar>
                <div>
                  <CardTitle className="text-lg">{u.fullName}</CardTitle>
                  <div className="mt-1 flex gap-1.5 flex-wrap">
                    <LevelBadge levelId={u.level} />
                    {u.subscriptionTier && <Badge variant="gold">✨ Tier Aktif</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">🎖 Bakat: <span className="text-foreground font-medium">{u.talents || '—'}</span></p>
                {u.business && <p>💼 Usaha: <b>{u.business.name}</b> · butuh support {formatRupiah(u.business.need)}</p>}
                <Button size="sm" variant="secondary" asChild><Link to={`/members/${u.id}`}>Lihat Profil & Rencana</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Level ladder */}
      <section className="bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-extrabold mb-2">Perjalanan Level Member Janda</h2>
          <p className="text-sm text-muted-foreground mb-8">Naik level berdasarkan KPI dan kontribusi: buat grup & jadilah leader, adakan event, bantu member lain, promosikan ke non-janda, serta ikut pelatihan Akademi.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { i: Star, n: 'Wonder Woman', k: 'Mulai', d: 'Level awal semua member baru.' },
              { i: Sparkles, n: 'Sosialita', k: 'KPI 150', d: 'Rajin berjejaring & berkontribusi.' },
              { i: Crown, n: 'The CEO', k: 'KPI 400', d: 'Leader grup & penyelenggara event.' },
              { i: Gem, n: 'High Society', k: 'KPI 800', d: 'Ikon komunitas, akses gala dinner.' },
            ].map((l, idx) => (
              <Card key={l.n} className={`relative ${idx === 3 ? 'border-pink-300 bg-pink-50' : ''}`}>
                <CardContent className="p-5">
                  <l.i className="h-8 w-8 text-primary" />
                  <p className="mt-2 font-extrabold text-lg">{l.n}</p>
                  <Badge variant="outline" className="mt-1">{l.k}</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">{l.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Alternatif cepat: berlangganan tier bulanan — badge tier langsung aktif tanpa menunggu syarat level.</div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PantiJanda — Pahlawan Sejati, Jawara Andalan. Dibangun untuk pemberdayaan.
      </footer>
    </div>
  )
}
