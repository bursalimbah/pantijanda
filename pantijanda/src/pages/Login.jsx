import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'

export default function Login() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  function submit(e) {
    e.preventDefault()
    const u = state.users.find((x) => x.email === email && x.password === password)
    if (!u) return setErr('Email/password salah. Coba demo: admin@pantijanda.id / admin123')
    dispatch({ type: 'LOGIN', userId: u.id })
    navigate(u.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk PantiJanda</CardTitle>
          <CardDescription>Pahlawan Sejati, Jawara Andalan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            {err && <p className="text-sm text-destructive font-semibold">{err}</p>}
            <Button className="w-full"><LogIn className="h-4 w-4" /> Masuk</Button>
            <p className="text-sm text-center text-muted-foreground">Belum punya akun? <Link to="/register" className="font-bold text-primary underline">Daftar di sini</Link></p>
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              Akun demo — Admin: <b>admin@pantijanda.id/admin123</b> · Member Janda: <b>sari@mail.com/rahasia</b> (The CEO), <b>maya@mail.com/rahasia</b> (Sosialita), <b>dewi@mail.com/rahasia</b> (Wonder Woman) · Non-janda: <b>budi@mail.com/rahasia</b>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
