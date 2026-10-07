import { cn } from '@/lib/utils'
export function Table({ className, ...p }) { return <div className="relative w-full overflow-x-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...p} /></div> }
export function TableHeader({ className, ...p }) { return <thead className={cn('[&_tr]:border-b', className)} {...p} /> }
export function TableBody({ className, ...p }) { return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...p} /> }
export function TableRow({ className, ...p }) { return <tr className={cn('border-b transition-colors hover:bg-muted/50', className)} {...p} /> }
export function TableHead({ className, ...p }) { return <th className={cn('h-10 px-3 text-left align-middle font-semibold text-muted-foreground', className)} {...p} /> }
export function TableCell({ className, ...p }) { return <td className={cn('p-3 align-middle', className)} {...p} /> }
