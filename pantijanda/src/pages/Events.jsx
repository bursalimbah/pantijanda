import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { Printer, QrCode, Ticket, CalendarDays, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/lib/store'
import { LEVELS } from '@/data/seed'
import { formatDate, formatRupiah } from '@/lib/utils'

export function canCreateEvent(me, settings) {
  if (!me) return false
  if (me.role === 'admin') return true
  if (!me.isWidow) return false
  const minIdx = LEVELS.findIndex((l) => l.id === settings.minEventCreateLevel)
  return LEVELS.findIndex((l) => l.id === me.level) >= minIdx
}

export default function Events() {
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  const events = state.events.filter((e) => e.status === 'published')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Event Komunitas</h1>
          <p className="text-sm text-muted-foreground">Form pendaftaran event diatur oleh penyelenggara. Tiket masuk &amp; absensi memakai QR code.</p>
        </div>
        <NewEventDialog me={me} settings={state.settings} dispatch={dispatch} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {events.map((e) => {
          const owner = state.users.find((u) => u.id === e.ownerId)
          const joined = me && e.attendees.includes(me.id)
          const mine = me && (me.id === e.ownerId || me.role === 'admin')
          return (
            <Card key={e.id}>
              <CardHeader>
                <div className="flex justify-between gap-2">
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <Badge variant={e.allowNonWidow ? 'success' : 'violet'}>{e.allowNonWidow ? 'Umum' : 'Khusus Member Janda'}</Badge>
                </div>
                <CardDescription>
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(e.date)} · {e.venue}</span>
                  Diselenggarakan oleh <b>{owner?.fullName || owner?.username}</b> · Kapasitas {e.capacity} · Tiket {e.ticketPrice ? formatRupiah(e.ticketPrice) : 'Gratis'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">{e.formFields.map((f) => <Badge key={f} variant="outline">📝 {f}</Badge>)}</div>
                <Separator />
                <div className="flex flex-wrap items-center gap-2">
                  {!joined ? (
                    <RegisterBtn e={e} me={me} dispatch={dispatch} navigate={navigate} />
                  ) : (
                    <TicketQr e={e} me={me} />
                  )}
                  {mine && <Button size="sm" variant="secondary" onClick={() => navigate(`/events/${e.id}/manage`)}><QrCode className="h-4 w-4" /> Kelola Tiket &amp; Absensi</Button>}
                  <span className="ml-auto text-xs text-muted-foreground">{e.attendees.length}/{e.capacity} peserta</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function RegisterBtn({ e, me, dispatch, navigate }) {
  const [open, setOpen] = useState(false)
  const [vals, setVals] = useState({})
  const blocked = !e.allowNonWidow && me && !me.isWidow
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Ticket className="h-4 w-4" /> Daftar Event</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Formulir — {e.title}</DialogTitle>
          <DialogDescription>Dilengkapi sesuai pengaturan form dari penyelenggara.</DialogDescription></DialogHeader>
        {blocked ? <p className="text-sm font-semibold text-destructive">Event ini khusus member berstatus janda.</p> : !me ? (
          <p className="text-sm">Silakan <button className="underline font-bold" onClick={() => navigate('/login')}>masuk</button> untuk mendaftar.</p>
        ) : (
          <div className="space-y-3">
            {e.formFields.map((f) => (
              <div key={f} className="space-y-1"><Label>{f}</Label><Input value={vals[f] || ''} onChange={(ev) => setVals({ ...vals, [f]: ev.target.value })} /></div>
            ))}
            <Button disabled={Object.keys(vals).length < e.formFields.length} onClick={() => {
              dispatch({ type: 'REGISTER_ATTENDEE', eventId: e.id, userId: me.id, name: vals[e.formFields[0]] || me.fullName || me.username })
              setOpen(false)
            }}>Kirim &amp; Dapatkan Tiket QR</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function TicketQr({ e, me }) {
  const entry = e.absensi.find((a) => a.name && a.ticketId)
  const ticketId = e.attendees.includes(me.id) ? (e.absensi.find((a) => me.fullName === a.name)?.ticketId || `tk-${me.id}-${e.id}`) : null
  const payload = JSON.stringify({ event: e.id, user: me.id, t: ticketId })
  return <TicketDialog payload={payload} title={e.title} name={me.fullName || me.username} checkedIn={!!e.absensi.find((a) => a.ticketId === ticketId && a.checkedIn)} />
}

export function TicketDialog({ payload, title, name, price, checkedIn }) {
  const [src, setSrc] = useState('')
  useEffect(() => { QRCode.toDataURL(payload, { width: 300, margin: 1 }).then(setSrc).catch(() => {}) }, [payload])
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="outline"><Ticket className="h-4 w-4" /> Tiket Saya</Button></DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader><DialogTitle>Tiket Masuk</DialogTitle><DialogDescription>{title}</DialogDescription></DialogHeader>
        <div className="rounded-xl border-2 border-dashed p-4 text-center print-area">
          <p className="font-extrabold">{title}</p>
          <p className="text-sm text-muted-foreground">{name}{price ? ` · ${formatRupiah(price)}` : ''}</p>
          {src && <img src={src} alt="QR tiket" className="mx-auto my-3 w-48" />}
          <p className="text-xs font-mono break-all">{payload.slice(0, 40)}…</p>
          {checkedIn && <Badge variant="success" className="mt-2">✓ Sudah check-in</Badge>}
        </div>
        <Button variant="gold" onClick={() => window.print()}><Printer className="h-4 w-4" /> Cetak Tiket</Button>
      </DialogContent>
    </Dialog>
  )
}

function NewEventDialog({ me, settings, dispatch }) {
  const [open, setOpen] = useState(false)
  const allowed = canCreateEvent(me, settings)
  const [f, setF] = useState({ title: '', date: '', venue: '', capacity: 30, ticketPrice: 0, fields: 'Nama lengkap, Nomor WhatsApp', allowNonWidow: false })
  const set = (k) => (e) => setF({ ...f, [k]: e.target?.value ?? e })

  if (!me) return <Button disabled variant="outline"><Lock className="h-4 w-4" /> Masuk untuk membuat event</Button>
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!allowed} title={allowed ? '' : 'Hanya Admin atau member janda dengan level minimal Sosialita'}>
          <CalendarDays className="h-4 w-4" /> Buat Event Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Buat Event &amp; Atur Form Pendaftaran</DialogTitle>
          <DialogDescription>Pembuatan event hanya untuk Admin dan member janda dengan kriteria level tertentu (min. {settings.minEventCreateLevel}).</DialogDescription></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1 sm:col-span-2"><Label>Judul Event</Label><Input value={f.title} onChange={set('title')} /></div>
          <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={f.date} onChange={set('date')} /></div>
          <div className="space-y-1"><Label>Venue</Label><Input value={f.venue} onChange={set('venue')} /></div>
          <div className="space-y-1"><Label>Kapasitas</Label><Input type="number" value={f.capacity} onChange={set('capacity')} /></div>
          <div className="space-y-1"><Label>Harga Tiket (Rp, 0 = gratis)</Label><Input type="number" value={f.ticketPrice} onChange={set('ticketPrice')} /></div>
          <div className="space-y-1 sm:col-span-2"><Label>Pengaturan Form Pendaftaran (pisahkan dengan koma)</Label>
            <Textarea value={f.fields} onChange={set('fields')} placeholder="cth: Nama lengkap, Domisili, Ukuran baju" /></div>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
            <Switch checked={f.allowNonWidow} onCheckedChange={set('allowNonWidow')} /> Terbuka untuk non-janda (umum)
          </label>
        </div>
        <Button disabled={!f.title || !f.date} onClick={() => {
          dispatch({ type: 'ADD_EVENT', createdBy: me.id, ownerId: me.id, event: {
            title: f.title, date: new Date(f.date).toISOString(), venue: f.venue, capacity: +f.capacity,
            ticketPrice: +f.ticketPrice, formFields: f.fields.split(',').map((x) => x.trim()).filter(Boolean),
            allowNonWidow: f.allowNonWidow,
          }})
          setOpen(false)
        }}>Publikasikan Event (+50 KPI)</Button>
      </DialogContent>
    </Dialog>
  )
}

// ===== Halaman manajemen tiket & absensi =====
export function EventManage() {
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  const id = window.location.pathname.split('/')[2]
  const e = state.events.find((x) => x.id === id)
  const allowed = useMemo(() => me && e && (me.id === e.ownerId || me.role === 'admin'), [me, e])
  const [scan, setScan] = useState('')

  useEffect(() => { if (!me) navigate('/login') }, [me])
  if (!e) return <p className="p-10 text-center">Event tidak ditemukan.</p>
  if (!allowed) return <p className="p-10 text-center font-semibold">Hanya penyelenggara / admin yang dapat mengakses halaman ini.</p>

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-extrabold">Kelola: {e.title}</h1>
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle className="text-lg">Cetak Semua Tiket Peserta</CardTitle>
            <CardDescription>Tiket berisi QR unik per peserta untuk gerbang masuk.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {e.absensi.map((a, i) => <TicketPrint key={i} payload={JSON.stringify({ event: e.id, t: a.ticketId })} title={e.title} name={a.name} price={e.ticketPrice} checkedIn={a.checkedIn} />)}
            {!e.absensi.length && <p className="text-sm text-muted-foreground">Belum ada peserta terdaftar.</p>}
            <Button variant="gold" onClick={() => window.print()}><Printer className="h-4 w-4" /> Cetak Massal</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Absensi &amp; Check-in QR</CardTitle>
            <CardDescription>Masukkan/scan kode tiket peserta untuk menandai kehadiran.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2"><Input value={scan} onChange={(ev) => setScan(ev.target.value)} placeholder="Tempel kode tiket (tk-xxxx)" /><Button onClick={() => { dispatch({ type: 'CHECKIN', eventId: e.id, ticketId: scan }); setScan('') }}>Check-in</Button></div>
            <Table>
              <TableHeader><TableRow><TableHead>Peserta</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{e.absensi.map((a) => (
                <TableRow key={a.ticketId}><TableCell>{a.name}</TableCell>
                  <TableCell>{a.checkedIn ? <Badge variant="success">Hadir ✓</Badge> : <Badge variant="outline">Belum</Badge>}</TableCell></TableRow>
              ))}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TicketPrint({ payload, title, name, price, checkedIn }) {
  const [src, setSrc] = useState('')
  useEffect(() => { QRCode.toDataURL(payload, { width: 200, margin: 1 }).then(setSrc).catch(() => {}) }, [payload])
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white p-2">
      {src && <img src={src} className="h-16 w-16" alt="" />}
      <div className="text-xs"><p className="font-bold">{title}</p><p>{name}</p><p className="font-mono">{payload.match(/"t":"([^"]+)"/)?.[1]}</p></div>
      {checkedIn && <Badge variant="success" className="ml-auto">Hadir</Badge>}
    </div>
  )
}
