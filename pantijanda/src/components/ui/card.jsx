import { cn } from '@/lib/utils'
export function Card({ className, ...p }) { return <div className={cn('rounded-xl border bg-card text-card-foreground shadow', className)} {...p} /> }
export function CardHeader({ className, ...p }) { return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...p} /> }
export function CardTitle({ className, ...p }) { return <div className={cn('font-bold leading-none tracking-tight', className)} {...p} /> }
export function CardDescription({ className, ...p }) { return <div className={cn('text-sm text-muted-foreground', className)} {...p} /> }
export function CardContent({ className, ...p }) { return <div className={cn('p-6 pt-0', className)} {...p} /> }
export function CardFooter({ className, ...p }) { return <div className={cn('flex items-center p-6 pt-0', className)} {...p} /> }
