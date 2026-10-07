import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, CalendarPlus, HeartHandshake, Megaphone, GraduationCap, Crown, Plus, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStore } from '@/lib/store'
import { LEVELS } from '@/data/seed'
import LevelBadge from '@/components/LevelBadge'
import { initials } from '@/lib/utils'

export default function Community() {
  const { me, state, dispatch } = useStore()
  const navigate = useNavigate()
  if (!me) { navigate('/login'); return null }

  const widows = state.users.filter((u) => u.isWidow && u.id !== me.id)
  const myGroups = state.groups.filter((g) => g.members.includes(me.id))
  const otherGroups = state.groups.filter((g) => !g.members.includes(me.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-xl">Grup Chat per Level</CardTitle>
            <CardDescription>Member janda dapat membuat grup dengan member berstatus sama. Menjadi leader = +40 KPI.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {me.isWidow && <CreateGroup me={me} dispatch={dispatch} />}
            {[...myGroups, ...otherGroups].map((g) => <GroupCard key={g.id} g={g} me={me} state={state} dispatch={dispatch} />)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <KpiCard me={me} />
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Megaphone className="h-5 w-5 text-primary" /> Kontribusi Cepat</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild><Link to="/events"><CalendarPlus /> Buat Event (+50 KPI)</Link></Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => dispatch({ type: 'PROMOTE_NONWIDOW', memberId: me.id })}><HeartHandshake /> Promosikan ke Non-Janda (+15)</Button>
            <Button variant="outline" className="w-full justify-start" asChild><Link to="/dashboard?tab=akademi"><GraduationCap /> Ikut Akademi (+30)</Link></Button>
            <p className="text-xs text-muted-foreground pt-1">Membantu member lain dilakukan lewat follow & dukungan komitmen pada halaman member.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5 text-primary" /> Saran Untuk Diikuti</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {widows.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center gap-2">
                <Avatar className="h-9 w-9"><AvatarImage src={u.avatar} /><AvatarFallback>{initials(u.fullName)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{u.fullName}</p><LevelBadge levelId={u.level} /></div>
                <FollowBtn me={me} u={u} dispatch={dispatch} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function FollowBtn({ me, u, dispatch, small }) {
  const following = me?.following?.includes(u.id)
  return (
    <Button size="sm" variant={following ? 'outline' : 'secondary'} disabled={!me}
      title={following ? "Berhenti mengikuti" : "Follow dan beri dukungan"}
      onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', meId: me.id, otherId: u.id })}>
      {following ? 'Mengikuti ✓' : '+ Follow'}
    </Button>
  )
}

function CreateGroup({ me, dispatch }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const lvl = me.level
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="w-full"><Plus className="h-4 w-4" /> Buat Grup Chat {LEVELS.find((l) => l.id === lvl)?.name}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Grup Baru — Khusus Member {LEVELS.find((l) => l.id === lvl)?.name}</DialogTitle>
          <DialogDescription>Anda otomatis menjadi Leader/Ketua grup. Grup hanya dapat berisi member dengan status level yang sama.</DialogDescription></DialogHeader>
        <div className="space-y-1.5"><Label>Nama Grup</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Circle Bisnis Kuliner" /></div>
        <Button disabled={!name.trim()} onClick={() => { dispatch({ type: 'CREATE_GROUP', name: name.trim(), level: lvl, leaderId: me.id }); setOpen(false) }}>Buat Grup (+40 KPI)</Button>
      </DialogContent>
    </Dialog>
  )
}

function GroupCard({ g, me, state, dispatch }) {
  const [msg, setMsg] = useState('')
  const joined = g.members.includes(me?.id)
  const leader = state.users.find((u) => u.id === g.leaderId)
  return (
    <Card className="border-l-4 border-l-violet-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" />{g.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="violet">{LEVELS.find((l) => l.id === g.level)?.name}</Badge>
            {!joined && <Button size="sm" variant="outline" disabled={!me?.isWidow || me?.level !== g.level}
              title={me?.level !== g.level ? 'Hanya member dengan level yang sama' : ''}
              onClick={() => dispatch({ type: 'JOIN_GROUP', groupId: g.id, userId: me.id })}>Gabung</Button>}
          </div>
        </div>
        <CardDescription>Leader: {leader?.fullName} · {g.members.length} anggota</CardDescription>
      </CardHeader>
      {joined && (
        <CardContent className="space-y-3">
          <div className="max-h-40 overflow-y-auto rounded-lg bg-muted p-3 space-y-2">
            {g.messages.map((m, i) => {
              const sender = state.users.find((u) => u.id === m.from)
              return <div key={i} className="text-sm"><b className="text-primary">{sender?.fullName?.split(' ')[0]}:</b> {m.text}</div>
            })}
            {!g.messages.length && <p className="text-xs text-muted-foreground">Belum ada pesan. Sapa anggota grup! 👋</p>}
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { dispatch({ type: 'SEND_MSG', groupId: g.id, userId: me.id, text: msg.trim() }); setMsg('') } }}>
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tulis pesan…" />
            <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}

function KpiCard({ me }) {
  if (!me.isWidow) return (
    <Card><CardHeader><CardTitle className="text-lg">Sahabat PantiJanda</CardTitle>
      <CardDescription>Terima kasih telah mendukung! Follow member janda dan beri dukungan komitmen.</CardDescription></CardHeader></Card>
  )
  const idx = LEVELS.findIndex((l) => l.id === me.level)
  const next = LEVELS[idx + 1]
  const prevMin = LEVELS[idx]?.minKpi || 0
  const pct = next ? Math.min(100, Math.round(((me.kpi - prevMin) / (next.minKpi - prevMin)) * 100)) : 100
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> KPI &amp; Level Saya</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between"><LevelBadge levelId={me.level} showKpi kpi={me.kpi} />
          {next && <span className="text-xs font-semibold text-muted-foreground">→ {next.name} ({next.minKpi})</span>}</div>
        <Progress value={pct} />
        <p className="text-xs text-muted-foreground">{next ? `Kumpulkan ${Math.max(0, next.minKpi - me.kpi)} poin lagi untuk naik level.` : 'Level tertinggi tercapai! 💎'}</p>
      </CardContent>
    </Card>
  )
}
