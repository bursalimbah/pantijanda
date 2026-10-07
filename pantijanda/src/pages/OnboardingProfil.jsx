import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { initials } from '@/lib/utils'

const empty = {
  fullName: '', birthPlace: '', birthDate: '', address: '', whatsapp: '', insuranceType: 'Tidak punya',
  hobbies: '', talents: '', bankName: '', accNo: '', accName: '', avatarData: '', validationDoc: '',
}

export default function OnboardingProfil() {
  const { me, dispatch } = useStore()
  const navigate = useNavigate()
  const [f, setF] = useState({ ...empty, fullName: me?.fullName || '' })

  if (!me) { navigate('/login'); return null }
  if (!me.isWidow) { navigate('/dashboard'); return null }

  const set = (k) => (e) => setF({ ...f, [k]: e.target?.value ?? e })

  function onFile(e, key) {
    const file = e.target.files?.[0]
    if (!file) return
    if (key === 'avatarData') {
      const r = new FileReader(); r.onload = () => setF((p) => ({ ...p, avatarData: r.result })); r.readAsDataURL(file)
    } else setF((p) => ({ ...p, [key]: file.name }))
  }

  function save() {
    dispatch({
      type: 'UPDATE_PROFILE', userId: me.id, patch: {
        fullName: f.fullName, birthPlace: f.birthPlace, birthDate: f.birthDate, address: f.address,
        whatsapp: f.whatsapp, insurance: f.insuranceType, hobbies: f.hobbies, talents: f.talents,
        bank: { bankName: f.bankName, accNo: f.accNo, accName: f.accName },
        avatar: f.avatarData, validationDoc: f.validationDoc, profileComplete: true,
      },
    })
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profil Lengkap Member Janda 🌷</CardTitle>
          <CardDescription>Data privat ini hanya untuk validasi internal — tidak ditampilkan ke publik.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diri">
            <TabsList>
              <TabsTrigger value="diri">Data Diri</TabsTrigger>
              <TabsTrigger value="bakat">Minat &amp; Bakat</TabsTrigger>
              <TabsTrigger value="bank">Bank &amp; Foto</TabsTrigger>
            </TabsList>

            <TabsContent value="diri" className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama Lengkap"><Input value={f.fullName} onChange={set('fullName')} /></Field>
              <Field label="Tempat Lahir"><Input value={f.birthPlace} onChange={set('birthPlace')} placeholder="Kota lahir" /></Field>
              <Field label="Tanggal Lahir"><Input type="date" value={f.birthDate} onChange={set('birthDate')} /></Field>
              <Field label="Nomor WhatsApp"><Input value={f.whatsapp} onChange={set('whatsapp')} placeholder="08xx-xxxx-xxxx" /></Field>
              <Field label="Alamat Domisili" full><Textarea value={f.address} onChange={set('address')} /></Field>
              <Field label="Asuransi & Jenisnya">
                <Select value={f.insuranceType} onValueChange={set('insuranceType')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Tidak punya', 'Kesehatan — BPJS Kesehatan', 'Jiwa — BPJS Ketenagakerjaan', 'Swasta — Jiwa', 'Swasta — Kesehatan + Jiwa'].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Dokumen Validasi Status Janda (SKPN/Akta Kematian)">
                <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 text-sm text-muted-foreground hover:bg-muted">
                  <UploadCloud className="h-4 w-4" /> {f.validationDoc || 'Pilih dokumen…'}
                  <input type="file" className="hidden" onChange={(e) => onFile(e, 'validationDoc')} accept=".pdf,.jpg,.png" />
                </label>
              </Field>
            </TabsContent>

            <TabsContent value="bakat" className="grid gap-4">
              <Field label="Minat dan Hobby"><Textarea value={f.hobbies} onChange={set('hobbies')} placeholder="cth: memasak, membaca, konten kreator" /></Field>
              <Field label="Bakat"><Textarea value={f.talents} onChange={set('talents')} placeholder="cth: menjahit, dekorasi pastel, MUA" /></Field>
              <p className="text-xs text-muted-foreground">💡 AI Mentor di menu Akademi akan membaca bakat ini untuk memberi saran pengembangan karier & usaha.</p>
            </TabsContent>

            <TabsContent value="bank" className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama Bank"><Input value={f.bankName} onChange={set('bankName')} placeholder="BCA / Mandiri / BRI…" /></Field>
              <Field label="Nomor Rekening"><Input value={f.accNo} onChange={set('accNo')} /></Field>
              <Field label="Atas Nama"><Input value={f.accName} onChange={set('accName')} /></Field>
              <Field label="Foto Profil" full>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16"><AvatarImage src={f.avatarData} /><AvatarFallback className="text-lg">{initials(f.fullName || me.username)}</AvatarFallback></Avatar>
                  <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 text-sm text-muted-foreground hover:bg-muted">
                    <UploadCloud className="h-4 w-4" /> Upload foto…
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => onFile(e, 'avatarData')} />
                  </label>
                </div>
              </Field>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Nanti Saja</Button>
            <Button onClick={save} disabled={!f.fullName}><Save className="h-4 w-4" /> Simpan Profil</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, children, full }) {
  return <div className={`space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}><Label>{label}</Label>{children}</div>
}
