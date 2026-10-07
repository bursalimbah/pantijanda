import { Link, useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { initials, formatRupiah } from '@/lib/utils'
import LevelBadge from '@/components/LevelBadge'

export default function Members() {
  const { me, state, dispatch } = useStore()
  const widows = state.users.filter((u) => u.isWidow)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold">Member Status Janda</h1>
          <p className="text-sm text-muted-foreground">Halaman publik — informasi privat (alamat, WA, bank, dokumen validasi) disembunyikan.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {widows.map((u) => {
          const following = me?.following?.includes(u.id)
          return (
            <Card key={u.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex-row items-center gap-3">
                <Avatar className="h-14 w-14"><AvatarImage src={u.avatar} /><AvatarFallback className="text-base">{initials(u.fullName)}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <CardTitle className="truncate">{u.fullName}</CardTitle>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <LevelBadge levelId={u.level} />
                    {u.subActive && <Badge variant="gold">✨ {u.subscriptionTier}</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">🎖 <b className="text-foreground">Bakat:</b> {u.talents || '—'}</p>
                <p className="text-muted-foreground">🧩 <b className="text-foreground">Minat/Hobby:</b> {u.hobbies || '—'}</p>
                {u.business && <p>💼 <b>{u.business.name}</b><br />Butuh support modal: <span className="font-bold text-primary">{formatRupiah(u.business.need)}</span></p>}
                <p className="text-xs text-muted-foreground">👥 {u.followers?.length || 0} pengikut</p>
                <div className="flex gap-2">
                  <Button size="sm" asChild><Link to={`/members/${u.id}`}>Lihat Profil &amp; RAB</Link></Button>
                  {me && u.id !== me.id && (
                    <Button size="sm" variant={following ? 'outline' : 'secondary'} onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', meId: me.id, otherId: u.id })}>
                      {following ? 'Mengikuti ✓' : '+ Follow'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
