import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FileText, HandCoins, HeartHandshake, ShieldCheck, Table2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@/lib/store'
import { donorBadge } from '@/data/seed'
import LevelBadge from '@/components/LevelBadge'
import { initials, formatRupiah } from '@/lib/utils'

export default function MemberDetail() {
  const { id } = useParams()
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  const u = state.users.find((x) => x.id === id && x.isWidow)
  const [commitOpen, setCommitOpen] = useState(false)
  const [note, setNote] = useState('')

  if (!u) return <p className="p-10 text-center">Member tidak ditemukan. <Link to="/members" className="underline">Kembali</Link></p>

  const rabTotal = (u.rab || []).reduce((s, r) => s + r.qty * r.price, 0)
  const donationsFor = state.donations.filter((d) => d.toUserId === u.id && d.status !== 'menunggu')
  const totalSupport = donationsFor.reduce((s, d) => s + d.amount, 0)
  const following = me?.following?.includes(u.id)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      {/* Header profil publik */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-5 p-6">
          <Avatar className="h-20 w-20"><AvatarImage src={u.avatar} /><AvatarFallback className="text-2xl">{initials(u.fullName)}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-[220px]">
            <h1 className="text-2xl font-extrabold">{u.fullName}</h1>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <LevelBadge levelId={u.level} showKpi kpi={u.kpi} />
              {u.subActive && <Badge variant="gold">✨ Subscriber Tier {u.subscriptionTier}</Badge>}
              <Badge variant="success">✓ Status Janda Terverifikasi</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">🎖 Bakat: {u.talents || '—'} · 🧩 Hobi: {u.hobbies || '—'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Stat n={u.followers?.length || 0} l="Pengikut" />
            <Stat n={formatRupiah(totalSupport)} l="Dukungan Masuk" small />
            <Stat n={`${(totalSupport / Math.max(1, u.business?.need || 1)) * 100 > 100 ? 100 : Math.round((totalSupport / Math.max(1, u.business?.need || 1)) * 100)}%`} l="Progress Target" />
          </div>
        </CardContent>
      </Card>

      {/* Pengalaman teknis & non teknis */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card><CardHeader><CardTitle className="text-lg">Pengalaman Teknis</CardTitle></CardHeader>
          <CardContent className="space-y-2">{(u.techExp || []).map((x, i) => (
            <div key={i} className="flex justify-between rounded-lg border p-3 text-sm"><span>{x.title}</span><Badge variant="blue">{x.type} · {x.year}</Badge></div>
          ))}{!u.techExp?.length && <p className="text-sm text-muted-foreground">Belum ada data.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Pengalaman Non-Teknis</CardTitle></CardHeader>
          <CardContent className="space-y-2">{(u.nonTechExp || []).map((x, i) => (
            <div key={i} className="flex justify-between rounded-lg border p-3 text-sm"><span>{x.title}</span><Badge variant="violet">{x.type} · {x.year}</Badge></div>
          ))}{!u.nonTechExp?.length && <p className="text-sm text-muted-foreground">Belum ada data.</p>}</CardContent></Card>
      </div>

      {/* Usaha & dukungan modal */}
      {u.business && (
        <Card className="border-primary/30 bg-pink-50/50">
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><HandCoins className="h-5 w-5 text-primary" /> {u.business.name}</CardTitle>
            <CardDescription>{u.business.desc}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default" className="text-sm">Butuh bantuan modal: {formatRupiah(u.business.need)}</Badge>
              <Dialog open={commitOpen} onOpenChange={setCommitOpen}>
                <DialogTrigger asChild><Button><HeartHandshake className="h-4 w-4" /> Beri Dukungan Komitmen</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Dukungan Komitmen untuk {u.fullName}</DialogTitle>
                    <DialogDescription>Bukan hanya dana — komitmen bisa berupa mentoring, kanal pemasaran, tenaga, atau janji pembelian rutin. Donasi juga dapat dilakukan lewat tombol di bawah.</DialogDescription></DialogHeader>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth: Saya berkomitmen membantu pemasaran via kantor saya setiap bulan…" />
                  <Button onClick={() => { if (me) { dispatch({ type: 'HELP_MEMBER', helperId: me.id, toUserId: u.id }); setCommitOpen(false); setNote('') } else navigate('/login') }}>Kirim Komitmen</Button>
                </DialogContent>
              </Dialog>
              {/* Frame view RAB / proposal */}
              <Dialog>
                <DialogTrigger asChild><Button variant="outline"><Table2 className="h-4 w-4" /> Rencana Anggaran Biaya (RAB)</Button></DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>RAB — {u.business.name}</DialogTitle><DialogDescription>Transparansi penggunaan dana yang diminta.</DialogDescription></DialogHeader>
                  <Table>
                    <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Harga Satuan</TableHead><TableHead>Jumlah</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {(u.rab || []).map((r, i) => <TableRow key={i}><TableCell>{r.item}</TableCell><TableCell>{r.qty}</TableCell><TableCell>{formatRupiah(r.price)}</TableCell><TableCell className="font-semibold">{formatRupiah(r.qty * r.price)}</TableCell></TableRow>)}
                      <TableRow><TableCell colSpan={3} className="font-extrabold">Total Kebutuhan</TableCell><TableCell className="font-extrabold text-primary">{formatRupiah(rabTotal)}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild><Button variant="outline"><FileText className="h-4 w-4" /> Proposal Kerjasama</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Proposal Kerjasama</DialogTitle><DialogDescription>{u.fullName}</DialogDescription></DialogHeader>
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">{u.proposal || 'Belum ada proposal.'}</pre>
                </DialogContent>
              </Dialog>
              <Button variant="gold" asChild><Link to={`/donate?to=${u.id}`}>Donasi Sekarang</Link></Button>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Data privat (alamat domisili, WhatsApp, rekening bank, dokumen validasi) disembunyikan dari halaman publik.</div>
          </CardContent>
        </Card>
      )}

      {me && u.id !== me.id && (
        <Button variant={following ? 'outline' : 'secondary'} onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', meId: me.id, otherId: u.id })}>
          {following ? '✓ Mengikuti — berhenti?' : '+ Follow member ini'}
        </Button>
      )}
    </div>
  )
}

function Stat({ n, l, small }) {
  return <div><p className={`font-extrabold ${small ? 'text-sm mt-1' : 'text-xl'}`}>{n}</p><p className="text-xs text-muted-foreground font-semibold">{l}</p></div>
}
