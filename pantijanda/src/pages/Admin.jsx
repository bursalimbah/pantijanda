import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Settings2, BadgeCheck, Users2, HandCoins, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/lib/store'
import { LEVELS, TIERS } from '@/data/seed'
import LevelBadge from '@/components/LevelBadge'
import { formatRupiah, formatDate } from '@/lib/utils'

export default function Admin() {
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  if (!me || me.role !== 'admin') { navigate('/login'); return null }

  const set = (k) => (v) => dispatch({ type: 'UPDATE_SETTINGS', patch: { [k]: v } })
  const pending = state.donations.filter((d) => d.status === 'menunggu')
  const widows = state.users.filter((u) => u.isWidow)
  const totalIn = state.donations.filter((d) => d.status !== 'menunggu').reduce((s, d) => s + d.amount, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white"><ShieldCheck className="h-6 w-6" /></span>
        <div><h1 className="text-3xl font-extrabold">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">Pengaturan biaya, verifikasi, dan kebijakan platform PantiJanda.</p></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[['Total Donasi Masuk', formatRupiah(totalIn)], ['Member Janda', widows.length + ' orang'], ['Donasi Menunggu Verifikasi', pending.length]].map(([l, v]) => (
          <Card key={l}><CardContent className="p-5"><p className="text-xs font-bold uppercase text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-extrabold text-primary">{v}</p></CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="pengaturan">
        <TabsList>
          <TabsTrigger value="pengaturan"><Settings2 className="h-4 w-4" /> Pembayaran &amp; Biaya</TabsTrigger>
          <TabsTrigger value="verifikasi"><BadgeCheck className="h-4 w-4" /> Verifikasi Bukti Bayar</TabsTrigger>
          <TabsTrigger value="level"><Users2 className="h-4 w-4" /> Kriteria Event &amp; Level</TabsTrigger>
        </TabsList>

        <TabsContent value="pengaturan">
          <Card><CardHeader><CardTitle className="text-lg">Pengaturan Pembayaran &amp; Biaya-biaya</CardTitle>
            <CardDescription>Semua biaya yang dikenakan pada transaksi platform diatur di sini.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5"><Label><Percent className="inline h-3.5 w-3.5 mr-1" />Biaya Administrasi Platform (%)</Label>
                <Input type="number" defaultValue={state.settings.adminFeePercent} onChange={(e) => set('adminFeePercent')(+e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Minimal Donasi (Rp)</Label>
                <Input type="number" defaultValue={state.settings.donationMin} onChange={(e) => set('donationMin')(+e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Harga Tiket Minimal (Rp)</Label>
                <Input type="number" defaultValue={state.settings.minTicketPrice} onChange={(e) => set('minTicketPrice')(+e.target.value)} /></div>
              <label className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-semibold">Langganan tier bulanan diaktifkan</span>
                <Switch checked={state.settings.subscriptionEnabled} onCheckedChange={set('subscriptionEnabled')} />
              </label>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Tarif Langganan Tier (tampil di dashboard member)</Label>
                <Table><TableHeader><TableRow><TableHead>Tier</TableHead><TableHead>Tarif/Bulan</TableHead></TableRow></TableHeader>
                  <TableBody>{TIERS.map((t) => <TableRow key={t.id}><TableCell className="font-semibold">{t.name}</TableCell><TableCell>{formatRupiah(t.price)}</TableCell></TableRow>)}</TableBody></Table>
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="verifikasi">
          <Card><CardHeader><CardTitle className="text-lg">Bukti Bayar Perlu Diverifikasi</CardTitle>
            <CardDescription>Donasi via transfer manual / scan barcode dengan bukti kirim.</CardDescription></CardHeader>
            <CardContent>
              <Table><TableHeader><TableRow><TableHead>Donatur</TableHead><TableHead>Penerima</TableHead><TableHead>Nominal</TableHead><TableHead>Bukti</TableHead><TableHead>Tanggal</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
                <TableBody>{pending.map((d) => {
                  const donor = state.users.find((u) => u.id === d.donorId)
                  const recv = state.users.find((u) => u.id === d.toUserId)
                  return <TableRow key={d.id}>
                    <TableCell>{donor?.fullName || 'Anonim'}</TableCell><TableCell>{recv?.fullName}</TableCell>
                    <TableCell className="font-semibold">{formatRupiah(d.amount)}</TableCell>
                    <TableCell>{d.proof ? <Badge variant="blue">📎 {d.proof}</Badge> : <Badge variant="outline">{d.method}</Badge>}</TableCell>
                    <TableCell>{formatDate(d.at)}</TableCell>
                    <TableCell className="space-x-1">
                      <Button size="sm" onClick={() => dispatch({ type: 'VERIFY_DONATION', donationId: d.id, status: 'diverifikasi' })}>Terima</Button>
                      <Button size="sm" variant="destructive" onClick={() => dispatch({ type: 'VERIFY_DONATION', donationId: d.id, status: 'ditolak' })}>Tolak</Button>
                    </TableCell></TableRow>
                })}</TableBody></Table>
              {!pending.length && <p className="text-sm text-muted-foreground">Tidak ada antrean verifikasi. ✨</p>}
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="level">
          <Card><CardHeader><CardTitle className="text-lg">Kriteria Pembuatan Event &amp; Ambang Level</CardTitle>
            <CardDescription>Event hanya dapat dibuat admin atau member janda dengan level minimal berikut.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="max-w-xs space-y-1.5"><Label>Level minimal pembuat event</Label>
                <Select value={state.settings.minEventCreateLevel} onValueChange={set('minEventCreateLevel')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <Table><TableHeader><TableRow><TableHead>Level</TableHead><TableHead>Ambang KPI</TableHead><TableHead>Keterangan</TableHead></TableRow></TableHeader>
                <TableBody>{LEVELS.map((l) => <TableRow key={l.id}><TableCell><LevelBadge levelId={l.id} /></TableCell><TableCell>{l.minKpi}</TableCell><TableCell className="text-muted-foreground">{l.desc}</TableCell></TableRow>)}</TableBody></Table>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <HandCoins className="h-4 w-4" /> Kontribusi bernilai KPI: event +50 · grup/leader +40 · akademi +30 · bantu member +25 · promosi non-janda +15 · lapak +10 · kontrak +60.
              </div>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
