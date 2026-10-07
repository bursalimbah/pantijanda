import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(n) {
  return 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0))
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function initials(name = '?') {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}
