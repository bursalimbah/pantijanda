import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Store, Plus, Sparkles, GraduationCap, Crown, FileText, Wallet, HandCoins, ScrollText, CalendarCheck } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'
import { LEVELS, TIERS, donorBadge } from '@/data/seed'
import { aiGenerate, aiMentor } from '@/lib/ai'
import LevelBadge from '@/components/LevelBadge'
import { formatRupiah, formatDate } from '@/lib/utils'

export default function Dashboard() {
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  if (!me) { navigate('/login'); return null }

  const tab = params.get('tab') || (me.isWidow ? 'ringkasan' : 'donatur')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard {me.fullName || me.username}</h1>
          <p className="text-sm text-muted-foreground">{me.isWidow ? 'Member Janda — Pahlawan Sejati, Jawara Andalan' : 'Sahabat PantiJanda — Penyandang Dukungan'}</p>
        </div>
        <div className="flex gap-2">
          {me.isWidow && <LevelBadge levelId={me.level} showKpi kpi={me.kpi} />}
          {me.subActive && <Badge variant="gold">✨ Tier {me.subscriptionTier} Aktif</Badge>}
          {!me.isWidow && <Badge variant="gold">🏅 {donorBadge(me.donateTotal || 0).label}</Badge>}
        </div>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList className="flex-wrap h-auto">
          {me.isWidow ? <>
            <TabsTrigger value="ringkasan"><Wallet className="h-4 w-4" /> Keuangan</TabsTrigger>
            <TabsTrigger value="usaha">Usaha &amp; Modal</TabsTrigger>
            <TabsTrigger value="event"><CalendarCheck className="h-4 w-4" /> Event Saya</TabsTrigger>
            <TabsTrigger value="akademi"><GraduationCap className="h-4 w-4" /> Akademi AI</TabsTrigger>
            <TabsTrigger value="ai-tools"><Sparkles className="h-4 w-4" /> AI Tools</TabsTrigger>
            <TabsTrigger value="lapak"><Store className="h-4 w-4" /> Lapak</TabsTrigger>
            <TabsTrigger value="langganan">Berlangganan Tier</TabsTrigger>
          </> : <>
            <TabsTrigger value="donatur"><HandCoins className="h-4 w-4" /> Donasi Saya</TabsTrigger>
            <TabsTrigger value="badge"><Crown className="h-4 w-4" /> Badge &amp; Grade</TabsTrigger>
          </>}
        </TabsList>

        {me.isWidow ? <>
          <TabsContent value="ringkasan"><FinancialReport me={me} state={state} /></TabsContent>
          <TabsContent value="usaha"><BusinessTool me={me} dispatch={dispatch} /></TabsContent>
          <TabsContent value="event"><MyEvents me={me} state={state} navigate={navigate} /></TabsContent>
          <TabsContent value="akademi"><Academy me={me} state={state} dispatch={dispatch} /></TabsContent>
          <TabsContent value="ai-tools"><AiTools me={me} /></TabsContent>
          <TabsContent value="lapak"><Lapak me={me} state={state} dispatch={dispatch} /></TabsContent>
          <TabsContent value="langganan"><Subscription me={me} dispatch={dispatch} /></TabsContent>
        </> : <>
          <TabsContent value="donatur"><MyDonations me={me} state={state} /></TabsContent>
          <TabsContent value="badge"><DonorBadges me={me} /></TabsContent>
        </>}
      </Tabs>
    </div>
  )
}

/* ---------- Laporan keuangan member janda ---------- */
function FinancialReport({ me, state }) {
  const donasi = state.donations.filter((d) => d.toUserId === me.id && d.status !== 'menunggu')
  const totalDonasi = donasi.reduce((s, d) => s + d.amount, 0)
  const kontrak = state.contracts.filter((c) => c.userId === me.id)
  const totalKontrak = kontrak.reduce((s, c) => s + c.value, 0)
  const fee = Math.round((totalDonasi + totalKontrak) * (state.settings.adminFeePercent / 100))
  const chartData = donasi.slice(0, 8).reverse().map((x, i) => ({ name: `T${i + 1}`, dana: x.amount }))
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {[['Hasil Donasi Masuk', totalDonasi], ['Hasil Kontrak Kerjasama', totalKontrak], ['Estimasi Bersih (dikurangi biaya admin ' + state.settings.adminFeePercent + '%)', totalDonasi + totalKontrak - fee]].map(([l, v]) => (
        <Card key={l}><CardContent className="p-5"><p className="text-xs font-bold uppercase text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-extrabold text-primary">{formatRupiah(v)}</p></CardContent></Card>
      ))}
      <Card className="md:col-span-2"><CardHeader><CardTitle className="text-lg">Tren Donasi</CardTitle></CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}><XAxis dataKey="name" fontSize={12} /><Tooltip formatter={(v) => formatRupiah(v)} />
              <Area type="monotone" dataKey="dana" stroke="#db2777" fill="#fbcfe8" strokeWidth={2} /></AreaChart>
          </ResponsiveContainer>
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><ScrollText className="h-4 w-4" /> Riwayat Kontrak</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {kontrak.map((c) => <div key={c.id} className="flex justify-between border-b pb-1"><span>{c.title}</span><b>{formatRupiah(c.value)}</b></div>)}
          {!kontrak.length && <p className="text-muted-foreground">Belum ada kontrak. Buat lewat AI Tools → simpan sebagai kontrak.</p>}
        </CardContent></Card>
    </div>
  )
}

/* ---------- Usaha & kebutuhan modal ---------- */
function BusinessTool({ me, dispatch }) {
  const [b, setB] = useState({ name: me.business?.name || '', need: me.business?.need || 0, desc: me.business?.desc || '' })
  const [rows, setRows] = useState(me.rab?.length ? me.rab : [{ item: '', qty: 1, price: 0 }])
  const [proposal, setProposal] = useState(me.proposal || '')
  const total = rows.reduce((s, r) => s + (+r.qty || 0) * (+r.price || 0), 0)

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card><CardHeader><CardTitle className="text-lg">Jenis Usaha yang Sedang Dikerjakan</CardTitle>
        <CardDescription>Dibutuhkan bantuan modal / support? Tampilkan di profil publik Anda.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Field l="Nama Usaha"><Input value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} /></Field>
          <Field l="Kebutuhan Modal / Support (Rp)"><Input type="number" value={b.need} onChange={(e) => setB({ ...b, need: +e.target.value })} /></Field>
          <Field l="Deskripsi Kebutuhan"><Textarea value={b.desc} onChange={(e) => setB({ ...b, desc: e.target.value })} /></Field>
          <Button onClick={() => b.name && dispatch({ type: 'SAVE_BUSINESS', userId: me.id, business: { ...b, status: 'aktif' }, proposal })}>Simpan Usaha</Button>
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Rencana Anggaran Biaya (RAB)</CardTitle>
        <CardDescription>Akan tampil pada frame view RAB di halaman depan.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="Item" value={r.item} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, item: e.target.value } : x))} />
              <Input className="w-16" type="number" value={r.qty} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, qty: +e.target.value } : x))} />
              <Input className="w-32" type="number" placeholder="Harga" value={r.price} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, price: +e.target.value } : x))} />
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{formatRupiah(total)}</span></div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setRows([...rows, { item: '', qty: 1, price: 0 }])}><Plus /> Baris</Button>
            <Button size="sm" onClick={() => dispatch({ type: 'SAVE_BUSINESS', userId: me.id, business: me.business || { name: b.name, need: total, desc: b.desc, status: 'aktif' }, rab: rows.filter((r) => r.item) })}>Simpan RAB</Button>
          </div>
        </CardContent></Card>
      <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-lg">Proposal Kerjasama</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Textarea rows={4} value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Ringkasan proposal… atau generate via AI Tools." />
          <Button size="sm" onClick={() => dispatch({ type: 'SAVE_BUSINESS', userId: me.id, business: me.business || { name: b.name, need: b.need, desc: b.desc, status: 'aktif' }, proposal })}>Simpan Proposal</Button>
        </CardContent></Card>
    </div>
  )
}

/* ---------- Event saya ---------- */
function MyEvents({ me, state, navigate }) {
  const mine = state.events.filter((e) => e.ownerId === me.id)
  return (
    <Card><CardHeader><CardTitle className="text-lg">Event yang Saya Selenggarakan</CardTitle>
      <CardDescription>Pengaturan tiket &amp; absensi QR tersedia di halaman kelola.</CardDescription></CardHeader>
      <CardContent className="space-y-2">
        {mine.map((e) => <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
          <div><p className="font-bold">{e.title}</p><p className="text-xs text-muted-foreground">{formatDate(e.date)} · {e.attendees.length} peserta</p></div>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/events/${e.id}/manage`)}>Kelola Tiket &amp; Absensi</Button>
        </div>)}
        {!mine.length && <p className="text-sm text-muted-foreground">Belum ada event. Buat pada menu Event (min. level Sosialita).</p>}
      </CardContent></Card>
  )
}

/* ---------- Akademi dengan AI mentor ---------- */
function Academy({ me, state, dispatch }) {
  const tips = aiMentor(me)
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="border-violet-300 bg-violet-50/60">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-600" /> AI Mentor — Berdasarkan Bakat Anda</CardTitle>
          <CardDescription>AI membaca profil bakat/minat Anda dan memberi arahan pengembangan.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {tips.map((t, i) => <p key={i} className="rounded-lg bg-card border p-3 text-sm">💡 {t}</p>)}
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Pelatihan &amp; Kelas</CardTitle>
        <CardDescription>Mengikuti pelatihan menambah KPI kenaikan level.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {state.courses.map((c) => {
            const enrolled = c.enrolledBy.includes(me.id)
            const prog = c.progress?.[me.id] || 0
            return (
              <div key={c.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex justify-between gap-2"><p className="font-bold text-sm">{c.title}</p><Badge variant="blue">{c.hours} jam</Badge></div>
                {enrolled ? <>
                  <Progress value={prog} />
                  {prog < 100 && <Button size="sm" onClick={() => dispatch({ type: 'COMPLETE_COURSE', courseId: c.id, userId: me.id })}>Selesaikan Modul (+20 KPI)</Button>}
                  {prog >= 100 && <Badge variant="success">Lulus ✓</Badge>}
                </> : <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'ENROLL_COURSE', courseId: c.id, userId: me.id })}>Daftar (+30 KPI)</Button>}
              </div>
            )
          })}
        </CardContent></Card>
    </div>
  )
}

/* ---------- AI Tools dokumen ---------- */
const DOC_KINDS = [['proposal', 'Proposal'], ['rab', 'RAB'], ['business-plan', 'Perencanaan Bisnis'], ['kontrak', 'Kontrak Kerjasama'], ['mou', 'MOU'], ['pkb', 'Perjanjian Kerjasama']]
function AiTools({ me }) {
  const [kind, setKind] = useState('proposal')
  const [out, setOut] = useState('')
  const [loading, setLoading] = useState(false)
  const { dispatch } = useStore()

  function generate() {
    setLoading(true); setOut('')
    setTimeout(() => { setOut(aiGenerate(kind, me)); setLoading(false) }, 700)
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Asisten AI Dokumen</CardTitle>
        <CardDescription>Buat draf proposal, RAB, perencanaan bisnis, kontrak kerjasama, MOU, dan perjanjian kerjasama otomatis dari data profil &amp; usaha Anda.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">{DOC_KINDS.map(([v, l]) => <Badge key={v} variant={kind === v ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setKind(v)}>{l}</Badge>)}</div>
        <div className="flex gap-2">
          <Button onClick={generate} disabled={loading}>{loading ? 'AI sedang menyusun…' : '✨ Generate Draf'}</Button>
          {out && <Button variant="outline" onClick={() => window.print()}><FileText /> Cetak / PDF</Button>}
          {out && kind === 'kontrak' && <Button variant="secondary" onClick={() => dispatch({ type: 'ADD_CONTRACT', contract: { title: 'Kontrak — ' + (me.business?.name || me.fullName), userId: me.id, value: me.business?.need || 0 } })}>Simpan sbg Kontrak</Button>}
        </div>
        {out && <pre className="whitespace-pre-wrap rounded-xl border bg-muted p-4 text-sm print-area">{out}</pre>}
      </CardContent>
    </Card>
  )
}

/* ---------- Lapak marketplace ---------- */
function Lapak({ me, state, dispatch }) {
  const [p, setP] = useState({ title: '', price: 0, category: 'Kuliner', desc: '' })
  const mine = state.marketplace.filter((x) => x.userId === me.id)
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card><CardHeader><CardTitle className="text-lg">Share Keahlian / Buka Lapak</CardTitle>
        <CardDescription>Jual produk atau jasa keahlian Anda di marketplace komunitas.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Field l="Nama Produk/Jasa"><Input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field l="Harga"><Input type="number" value={p.price} onChange={(e) => setP({ ...p, price: +e.target.value })} /></Field>
            <Field l="Kategori"><Select value={p.category} onValueChange={(v) => setP({ ...p, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                {['Kuliner', 'Fashion', 'Jasa', 'Kecantikan', 'Digital'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent></Select></Field>
          </div>
          <Field l="Deskripsi"><Textarea value={p.desc} onChange={(e) => setP({ ...p, desc: e.target.value })} /></Field>
          <Button disabled={!p.title} onClick={() => { dispatch({ type: 'ADD_PRODUCT', product: { ...p, price: +p.price } }); setP({ ...p, title: '', desc: '' }) }}><Store className="h-4 w-4" /> Buka Lapak</Button>
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Lapak Saya</CardTitle></CardHeader>
        <CardContent className="space-y-2">{mine.map((x) => (
          <div key={x.id} className="flex justify-between rounded-lg border p-3 text-sm"><span><b>{x.title}</b><br /><span className="text-xs text-muted-foreground">{x.category} · {x.orders} pesanan</span></span><b className="text-primary">{formatRupiah(x.price)}</b></div>
        ))}{!mine.length && <p className="text-sm text-muted-foreground">Belum ada lapak aktif.</p>}</CardContent></Card>
    </div>
  )
}

/* ---------- Berlangganan tier ---------- */
function Subscription({ me, dispatch }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Berlangganan bulanan sesuai tier pilihan — <b>tanpa memenuhi syarat level dan tahapan kontribusi</b>. Badge tier langsung aktif selama berlangganan tetap berjalan.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {TIERS.map((t) => (
          <Card key={t.id} className={me.subscriptionTier === t.id && me.subActive ? 'border-amber-400 bg-amber-50' : ''}>
            <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" />{t.name}</CardTitle>
              <CardDescription className="text-base font-extrabold text-primary">{formatRupiah(t.price)}/bulan</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-1">{t.perks.map((x) => <li key={x}>✓ {x}</li>)}</ul>
              {me.subActive && me.subscriptionTier === t.id
                ? <Button variant="outline" className="w-full" onClick={() => dispatch({ type: 'UNSUBSCRIBE', userId: me.id })}>Berhenti Berlangganan</Button>
                : <Button variant="gold" className="w-full" onClick={() => dispatch({ type: 'SUBSCRIBE', userId: me.id, tierId: t.id })}>Aktifkan Badge Tier</Button>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------- Non-janda ---------- */
function MyDonations({ me, state }) {
  const mine = state.donations.filter((d) => d.donorId === me.id)
  return (
    <Card><CardHeader><CardTitle className="text-lg">Riwayat Donasi &amp; Pembayaran</CardTitle></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Penerima</TableHead><TableHead>Nominal</TableHead><TableHead>Metode</TableHead><TableHead>Status</TableHead><TableHead>Tanggal</TableHead></TableRow></TableHeader>
          <TableBody>{mine.map((d) => {
            const r = state.users.find((u) => u.id === d.toUserId)
            return <TableRow key={d.id}><TableCell>{r?.fullName}</TableCell><TableCell>{formatRupiah(d.amount)}</TableCell><TableCell>{d.method}</TableCell>
              <TableCell><Badge variant={d.status === 'sukses' || d.status === 'diverifikasi' ? 'success' : 'gold'}>{d.status}</Badge></TableCell><TableCell>{formatDate(d.at)}</TableCell></TableRow>
          })}</TableBody></Table>
        {!mine.length && <p className="text-sm text-muted-foreground mt-2">Belum ada donasi. <a href="/donate" className="underline font-bold">Mulai membantu →</a></p>}
      </CardContent></Card>
  )
}

function DonorBadges({ me }) {
  const total = me.donateTotal || 0
  const cur = donorBadge(total)
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card className="bg-gradient-to-br from-amber-50 to-pink-50"><CardContent className="p-6 text-center space-y-2">
        <Crown className="mx-auto h-10 w-10 text-amber-500" />
        <p className="text-sm font-bold uppercase text-muted-foreground">Badge &amp; Grade Saat Ini</p>
        <p className="text-3xl font-extrabold">{cur.label}</p>
        <p className="text-sm text-muted-foreground">Total kontribusi: <b>{formatRupiah(total)}</b></p>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Tangga Grade Donor</CardTitle></CardHeader>
        <CardContent className="space-y-2">{[['Perak', 0], ['Emas', 500000], ['Platinum', 2000000], ['Diamond', 10000000]].map(([g, m]) => (
          <div key={g} className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span className="font-bold">{g} {cur.grade === g && '← Anda di sini'}</span>
            <Progress value={Math.min(100, (total / Math.max(1, m)) * 100)} className="w-32" />
            <span className="text-muted-foreground">{formatRupiah(m)}</span>
          </div>
        ))}</CardContent></Card>
    </div>
  )
}

function Field({ l, children }) { return <div className="space-y-1.5"><Label>{l}</Label>{children}</div> }
