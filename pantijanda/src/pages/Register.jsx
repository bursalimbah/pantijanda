import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartHandshake, ShieldCheck, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useStore } from '@/lib/store'

const TERMS = `SYARAT & KETENTUAN PANTIJANDA
1. PantiJanda adalah platform sosial-komunitas; siapapun dapat mendaftar.
2. Data pribadi (dokumen validasi status janda, rekening bank, alamat) hanya digunakan untuk verifikasi internal dan tidak ditampilkan ke publik.
3. Member wajib memberikan data yang benar; manipulasi dokumen berakibat penonaktifan akun.
4. Donasi & dukungan modal bersifat sukarela; biaya administrasi payment gateway menjadi tanggung jawab penyandang dana.
5. Konten marketplace adalah tanggung jawab penjual; platform memfasilitasi transaksi secara wajar.
6. Level & badge diberikan berdasarkan KPI dan kontribusi atau aktifnya langganan tier.
7. Dengan mendaftar, pengguna menyetujui pemrosesan data sesuai ketentuan ini.`

export default function Register() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 form, 2 tanya status, 3 profil awal janda
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [agreeOpen, setAgreeOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isWidow, setIsWidow] = useState(null)
  const [fullName, setFullName] = useState('')
  const [err, setErr] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function submitAccount() {
    if (!form.username || !form.email || form.password.length < 6) return setErr('Isi username & email, password minimal 6 karakter.')
    if (state.users.some((u) => u.email === form.email)) return setErr('Email sudah terdaftar.')
    setErr('')
    setAgreeOpen(true)
  }

  function afterTerms() {
    setAgreeOpen(false)
    setStep(2)
  }

  function answerStatus(widow) {
    setIsWidow(widow)
    if (widow) { setStep(3); return }
    finish({ isWidow: false, fullName: fullName || form.username })
  }

  function finish(patch) {
    dispatch({ type: 'REGISTER', user: { ...form, role: 'user', ...patch } })
    navigate(patch.isWidow ? '/onboarding-profil' : '/dashboard')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-600 to-violet-600 text-white"><HeartHandshake className="h-6 w-6" /></span>
          <CardTitle className="text-2xl mt-2">Daftar PantiJanda</CardTitle>
          <CardDescription>Pahlawan Sejati, Jawara Andalan — kategori sosial, siapapun bisa mendaftar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && <>
            <div className="space-y-1.5"><Label>Username</Label><Input value={form.username} onChange={set('username')} placeholder="cth: sari_mandiri" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={form.password} onChange={set('password')} placeholder="minimal 6 karakter" /></div>
            {err && <p className="text-sm text-destructive font-semibold">{err}</p>}
            <Button className="w-full" onClick={submitAccount}>Lanjut</Button>
          </>}

          {step === 2 && (
            <div className="text-center space-y-4 py-2">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
              <p className="font-bold text-lg">Halo {form.username}! 👋</p>
              <p className="text-sm text-muted-foreground">Saat ini status Anda adalah <b>janda</b>? Jawaban menentukan kategori keanggotaan Anda.</p>
              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" onClick={() => answerStatus(true)}>Ya, saya Janda</Button>
                <Button size="lg" variant="outline" onClick={() => answerStatus(false)}>Tidak / Bukan</Button>
              </div>
              <p className="text-xs text-muted-foreground">Bila “Ya” → Anda masuk kategori <b>Member Janda</b> dengan level awal <b>Wonder Woman</b>. Bila “Tidak” → Anda menjadi <b>Sahabat PantiJanda</b> yang dapat berdonasi, follow, dan mendukung.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm">Selamat datang di kategori <b>Member Janda</b> 🌷 Lengkapi nama Anda, lalu isi profil lengkap pada langkah berikutnya.</p>
              <div className="space-y-1.5"><Label>Nama Lengkap</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama sesuai identitas" /></div>
              <Button className="w-full" onClick={() => fullName.trim() && finish({ isWidow: true, fullName: fullName.trim() })}>Lanjut Isi Profil Lengkap</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={agreeOpen} onOpenChange={setAgreeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Syarat &amp; Ketentuan Berlaku</DialogTitle>
            <DialogDescription>Baca dan setujui untuk melanjutkan pendaftaran.</DialogDescription></DialogHeader>
          <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-muted p-4 text-xs">{TERMS}</pre>
          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} /> Saya telah membaca dan menyetujui syarat &amp; ketentuan
          </label>
          <Button disabled={!agreed} onClick={afterTerms}>Setuju &amp; Lanjutkan</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
