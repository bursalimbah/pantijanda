import { LEVELS } from '@/data/seed'
import { Badge } from '@/components/ui/badge'
import { Crown, Gem, Sparkles, Star } from 'lucide-react'

const icons = { 'wonder-woman': Star, sosialita: Sparkles, 'the-ceo': Crown, 'high-society': Gem }
const styles = {
  'wonder-woman': 'bg-sky-100 text-sky-800 border-sky-200',
  sosialita: 'bg-violet-100 text-violet-800 border-violet-200',
  'the-ceo': 'bg-amber-100 text-amber-800 border-amber-200',
  'high-society': 'bg-pink-100 text-pink-800 border-pink-200',
}

export default function LevelBadge({ levelId, showKpi, kpi }) {
  const lvl = LEVELS.find((l) => l.id === levelId) || LEVELS[0]
  const Icon = icons[lvl.id] || Star
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[lvl.id]}`}>
      <Icon className="h-3 w-3" /> {lvl.name}
      {showKpi && <span className="opacity-70">· KPI {kpi}</span>}
    </span>
  )
}
export { LevelBadge, Badge }
