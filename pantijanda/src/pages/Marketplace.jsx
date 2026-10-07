import { Link } from 'react-router-dom'
import { Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import LevelBadge from '@/components/LevelBadge'
import { initials, formatRupiah } from '@/lib/utils'

export default function Marketplace() {
  const { state } = useStore()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white"><Store className="h-6 w-6" /></span>
        <div>
          <h1 className="text-3xl font-extrabold">Marketplace Komunitas</h1>
          <p className="text-sm text-muted-foreground">Lapak keahlian &amp; jualan para member status janda — share keahlian, jual produk dan jasa.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.marketplace.map((p) => {
          const seller = state.users.find((u) => u.id === p.userId)
          return (
            <Card key={p.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-pink-200 via-fuchsia-200 to-violet-200 grid place-items-center text-4xl">
                {p.category === 'Kuliner' ? '🍰' : p.category === 'Fashion' ? '👗' : p.category === 'Kecantikan' ? '💄' : p.category === 'Digital' ? '💻' : '🛠️'}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <Badge variant="blue">{p.category}</Badge>
                </div>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xl font-extrabold text-primary">{formatRupiah(p.price)}</p>
                {seller && (
                  <Link to={`/members/${seller.id}`} className="flex items-center gap-2 hover:underline">
                    <Avatar className="h-8 w-8"><AvatarImage src={seller.avatar} /><AvatarFallback>{initials(seller.fullName)}</AvatarFallback></Avatar>
                    <div><p className="text-sm font-bold leading-tight">{seller.fullName}</p><LevelBadge levelId={seller.level} /></div>
                  </Link>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{p.orders} pesanan terjual</span>
                  <Button size="sm" variant="secondary" onClick={() => alert('Pesanan diteruskan ke WhatsApp penjual (demo).')}>Pesan</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
