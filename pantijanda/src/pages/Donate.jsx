import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { CreditCard, QrCode, UploadCloud, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStore } from '@/lib/store'
import { donorBadge } from '@/data/seed'
import { formatRupiah, formatDate } from '@/lib/utils'

export default function Donate() {
  const { me, state, dispatch } = useStore()
  const [params] = useSearchParams()
  const widows = state.users.filter((u) => u.isWidow)
  const [to, setTo] = useState(params.get('to') || widows[0]?.id)
  const [amount, setAmount] = useState(50000)
  const [method, setMethod] = useState('payment-gateway')
  const [proofName, setProofName] = useState('')
  const [done, setDone] = useState(false)
  const [qrisSrc, setQrisSrc] = useState('')

  useEffect(() => {
    if (method === 'qris') QRCode.toDataURL('QRIS-PANTIJANDA-' + Math.random().toString(36).slice(2, 8), { width: 240 }).then(setQrisSrc)
  }, [method])

  function submit() {
    if (!amount || amount < state.settings.donationMin) return
    // Donatur bisa tidak terdaftar → dicatat sebagai donatur anonim jika belum login
    dispatch({
      type: 'ADD_DONATION', method,
      donation: { donorId: me?.id || 'anonim', toUserId: to, amount: +amount, proof: proofName || undefined, status: undefined },
    })
    setDone(true)
  }

  const recent = state.donations.slice(0, 6)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-2xl">Donasi &amp; Dukungan Modal</CardTitle>
          <CardDescription>Siapapun boleh membantu — akun terdaftar maupun tidak. Bayar via payment gateway, scan barcode QRIS, atau transfer manual lalu kirim bukti bayar.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="rounded-xl border bg-emerald-50 p-6 text-center space-y-2">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="font-bold text-lg">Terima kasih atas dukungan Anda! 🌷</p>
              <p className="text-sm text-muted-foreground">{method === 'transfer-manual' ? 'Bukti bayar terkirim, menunggu verifikasi admin.' : 'Pembayaran diproses melalui payment gateway.'}</p>
              {me && !me.isWidow && <Badge variant="gold">Badge Anda: {donorBadge(me.donateTotal || 0).label}</Badge>}
              <Button variant="outline" onClick={() => setDone(false)}>Donasi Lagi</Button>
            </div>
          ) : <>
            <div className="space-y-1.5"><Label>Penerima Bantuan</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{widows.map((w) => <SelectItem key={w.id} value={w.id}>{w.fullName} — {w.business?.name || 'member janda'}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><Label>Nominal (min. {formatRupiah(state.settings.donationMin)})</Label>
              <div className="flex flex-wrap gap-2">{[50000, 100000, 250000, 500000].map((v) => (
                <Button key={v} size="sm" variant={+amount === v ? 'default' : 'outline'} onClick={() => setAmount(v)}>{formatRupiah(v)}</Button>
              ))}</div>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Metode Pembayaran</Label>
              <div className="grid grid-cols-3 gap-2">
                {[['payment-gateway', 'Payment Gateway', CreditCard], ['qris', 'Scan QRIS', QrCode], ['transfer-manual', 'Transfer + Bukti', UploadCloud]].map(([v, l, I]) => (
                  <button key={v} onClick={() => setMethod(v)} className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold ${method === v ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
                    <I className="h-5 w-5" />{l}
                  </button>
                ))}
              </div></div>
            {method === 'qris' && qrisSrc && (
              <div className="rounded-xl border p-4 text-center"><img src={qrisSrc} alt="QRIS" className="mx-auto h-40" /><p className="text-xs text-muted-foreground mt-1">Scan barcode ini dengan aplikasi pembayaran apa pun.</p></div>
            )}
            {method === 'transfer-manual' && (
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 text-sm text-muted-foreground hover:bg-muted">
                <UploadCloud className="h-4 w-4" /> {proofName || 'Upload bukti transfer…'}
                <input type="file" className="hidden" onChange={(e) => setProofName(e.target.files?.[0]?.name || '')} />
              </label>
            )}
            {!me && <p className="text-xs text-muted-foreground">Anda belum masuk — donasi akan tercatat sebagai <b>donatur anonim</b>. Masuk untuk mengejar badge level donor (Perak→Diamond).</p>}
            <Button className="w-full" size="lg" onClick={submit}><CreditCard className="h-4 w-4" /> Bayar {formatRupiah(+amount || 0)}</Button>
          </>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-xl">Donasi Terbaru</CardTitle><CardDescription>Transparansi dukungan yang masuk ke member.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Donatur</TableHead><TableHead>Penerima</TableHead><TableHead>Nominal</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{recent.map((d) => {
              const donor = state.users.find((u) => u.id === d.donorId)
              const recv = state.users.find((u) => u.id === d.toUserId)
              return <TableRow key={d.id}>
                <TableCell>{donor?.fullName || 'Donatur Anonim'}</TableCell>
                <TableCell>{recv?.fullName}</TableCell>
                <TableCell className="font-semibold">{formatRupiah(d.amount)}</TableCell>
                <TableCell><Badge variant={d.status === 'sukses' || d.status === 'diverifikasi' ? 'success' : 'gold'}>{d.status}</Badge></TableCell>
              </TableRow>
            })}</TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted-foreground">Biaya administrasi {state.settings.adminFeePercent}% diatur pada dashboard admin. Tanggal terakhir: {recent[0] ? formatDate(recent[0].at) : '—'}</p>
        </CardContent>
      </Card>
    </div>
  )
}
