import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HeartHandshake, LayoutDashboard, Users, CalendarDays, Store, Gift, ShieldCheck, LogOut, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { initials } from '@/lib/utils'

const nav = [
  { to: '/', label: 'Beranda', icon: HeartHandshake, end: true },
  { to: '/members', label: 'Member Janda', icon: Users },
  { to: '/events', label: 'Event', icon: CalendarDays },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/donate', label: 'Donasi', icon: Gift },
]

export default function Navbar() {
  const { me, dispatch, isAdmin } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const linkCls = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow' : 'text-foreground/70 hover:bg-muted'}`

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-violet-600 text-white"><HeartHandshake className="h-5 w-5" /></span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-primary">PantiJanda</span>
            <span className="hidden sm:block text-[10px] font-semibold text-muted-foreground">Pahlawan Sejati, Jawara Andalan</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkCls} end={n.end}><n.icon className="h-4 w-4" />{n.label}</NavLink>)}
          {me && <NavLink to="/dashboard" className={linkCls}><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkCls}><ShieldCheck className="h-4 w-4" />Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {!me && <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Masuk</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Daftar</Button>
          </>}
          {me && (
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="hidden md:inline-flex"><Sparkles className="mr-1 h-3 w-3" />{me.isWidow ? (me.subscriptionTier ? 'Subscriber' : `Level: ${me.level}`) : 'Sahabat PantiJanda'}</Badge>
              <Avatar className="h-8 w-8"><AvatarImage src={me.avatar} /><AvatarFallback>{initials(me.fullName || me.username)}</AvatarFallback></Avatar>
              <Button variant="outline" size="sm" onClick={() => { dispatch({ type: 'LOGOUT' }); navigate('/') }}><LogOut className="h-4 w-4" />Keluar</Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-card p-3 grid gap-1">
          {[...nav, ...(me ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []), ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : [])].map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls} end={n.end} onClick={() => setOpen(false)}><n.icon className="h-4 w-4" />{n.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
