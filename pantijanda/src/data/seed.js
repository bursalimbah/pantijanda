// ===== Data awal (seed) untuk demo PantiJanda =====

export const LEVELS = [
  { id: 'wonder-woman', name: 'Wonder Woman', minKpi: 0, color: 'blue', icon: '⭐', desc: 'Level awal semua member janda.' },
  { id: 'sosialita', name: 'Sosialita', minKpi: 150, color: 'violet', icon: '💜', desc: 'Rajin berkontribusi & berjejaring.' },
  { id: 'the-ceo', name: 'The CEO', minKpi: 400, color: 'gold', icon: '👑', desc: 'Pemimpin grup / penyelenggara event.' },
  { id: 'high-society', name: 'High Society', minKpi: 800, color: 'default', icon: '💎', desc: 'Tingkat tertinggi — ikon komunitas.' },
]

export const TIERS = [
  { id: 'bronze', name: 'Bronze Supporter', price: 50000, perks: ['Badge tier aktif seketika', 'Tanpa syarat level', 'Akses lapak marketplace'] },
  { id: 'silver', name: 'Silver Benefactor', price: 150000, perks: ['Semua benefit Bronze', 'Prioritas dukungan modal', 'Logo di halaman donasi'] },
  { id: 'gold', name: 'Gold Patron', price: 500000, perks: ['Semua benefit Silver', 'Undangan High Society Gala', 'Konsultasi AI premium'] },
]

export const DONOR_BADGES = [
  { grade: 'Perak', min: 0, label: 'Donor Perak' },
  { grade: 'Emas', min: 500000, label: 'Donor Emas' },
  { grade: 'Platinum', min: 2000000, label: 'Donor Platinum' },
  { grade: 'Diamond', min: 10000000, label: 'Diamond Hero' },
]

export function donorBadge(total) {
  return [...DONOR_BADGES].reverse().find((b) => total >= b.min) || DONOR_BADGES[0]
}

const today = new Date()
const d = (offset) => new Date(today.getTime() + offset * 86400000).toISOString()

export const seedUsers = [
  {
    id: 'u-admin', username: 'adminpj', email: 'admin@pantijanda.id', password: 'admin123',
    role: 'admin', isWidow: false, fullName: 'Admin PantiJanda', avatar: '', bio: 'Pengelola platform.',
  },
  {
    id: 'u-1', username: 'sari', email: 'sari@mail.com', password: 'rahasia',
    role: 'user', isWidow: true, fullName: 'Sari Wulandari', birthPlace: 'Bandung', birthDate: '1990-05-14',
    address: 'Jl. Melati No. 12, Bandung', whatsapp: '0812-3456-7890', avatar: '',
    validationDoc: 'SKPN-Sari.pdf', insurance: 'Jiwa — BPJS Ketenagakerjaan',
    hobbies: 'Memasak, blogging', talents: 'Kue kering & dekorasi pastel',
    techExp: [{ title: 'Digital Marketing Bootcamp', type: 'pelatihan', year: 2024 }],
    nonTechExp: [{ title: 'Public Speaking Workshop', type: 'workshop', year: 2023 }],
    bank: { bankName: 'BCA', accNo: '1234567890', accName: 'Sari Wulandari' },
    level: 'the-ceo', kpi: 460, followers: ['u-2', 'u-3', 'u-non1'], following: ['u-2'],
    subscriptionTier: null, subActive: false,
    business: { name: 'Dapur Sari — Katering Harian', need: 25000000, desc: 'Modal pembelian oven & kemasan untuk skala rumahan menjadi katering harian kantor.', status: 'aktif' },
    rab: [
      { item: 'Oven kapasitas besar', qty: 1, price: 8500000 },
      { item: 'Kemasan food-grade 500 pcs', qty: 1, price: 3500000 },
      { item: 'Bahan baku awal', qty: 1, price: 8000000 },
      { item: 'Peralatan dapur lain', qty: 1, price: 5000000 },
    ],
    proposal: 'Proposal Pengembangan Dapur Sari: meningkatkan kapasitas produksi dari 30 menjadi 150 porsi/hari dengan target pasar karyawan kantor di kawasan Dago.',
  },
  {
    id: 'u-2', username: 'maya', email: 'maya@mail.com', password: 'rahasia',
    role: 'user', isWidow: true, fullName: 'Maya Anggraini', birthPlace: 'Yogyakarta', birthDate: '1985-11-02',
    address: 'Jl. Kaliurang KM 8, Sleman', whatsapp: '0856-1122-3344', avatar: '',
    validationDoc: 'Akta-Kematian-Maya.pdf', insurance: 'Kesehatan — BPJS Kesehatan',
    hobbies: 'Menjahit, membaca', talents: 'Tailoring & pattern making',
    techExp: [{ title: 'Seminar UMKM Go Digital', type: 'seminar', year: 2025 }],
    nonTechExp: [{ title: 'Menjahit Profesional (kursus 3 bln)', type: 'pelatihan', year: 2022 }],
    bank: { bankName: 'Mandiri', accNo: '9088776655', accName: 'Maya Anggraini' },
    level: 'sosialita', kpi: 210, followers: ['u-1'], following: ['u-1', 'u-3'],
    subscriptionTier: null, subActive: false,
    business: { name: 'Atelier Maya — Konveksi Rumahan', need: 12000000, desc: 'Mes jahit industri & bahan untuk pesanan seragam.', status: 'aktif' },
    rab: [
      { item: 'Mesin jahit industri', qty: 2, price: 4500000 },
      { item: 'Overdeck', qty: 1, price: 3000000 },
      { item: 'Stok kain', qty: 1, price: 3000000 },
    ],
    proposal: 'Proposal kerjasama produksi seragam komunitas dengan sistem bagi hasil.',
  },
  {
    id: 'u-3', username: 'dewi', email: 'dewi@mail.com', password: 'rahasia',
    role: 'user', isWidow: true, fullName: 'Dewi Lestari', birthPlace: 'Surabaya', birthDate: '1993-07-21',
    address: 'Jl. Ahmad Yani 88, Surabaya', whatsapp: '0821-9988-7766', avatar: '',
    validationDoc: 'SKPN-Dewi.pdf', insurance: 'Tidak punya',
    hobbies: 'Make-up, konten kreator', talents: 'MUA & video editing',
    techExp: [{ title: 'Event Photography Class', type: 'pelatihan', year: 2025 }],
    nonTechExp: [],
    bank: { bankName: 'BNI', accNo: '1122334455', accName: 'Dewi Lestari' },
    level: 'wonder-woman', kpi: 40, followers: [], following: ['u-1', 'u-2'],
    subscriptionTier: null, subActive: false,
    business: null, rab: [], proposal: '',
  },
  {
    id: 'u-non1', username: 'budi', email: 'budi@mail.com', password: 'rahasia',
    role: 'user', isWidow: false, fullName: 'Budi Santoso', avatar: '',
    donateTotal: 2500000, following: ['u-1'], followers: [],
  },
  {
    id: 'u-non2', username: 'rina', email: 'rina@mail.com', password: 'rahasia',
    role: 'user', isWidow: false, fullName: 'Rina Marlina', avatar: '',
    donateTotal: 750000, following: ['u-2'], followers: [],
  },
]

export const seedEvents = [
  {
    id: 'e-1', title: 'Gala Dinner High Society 2026', createdBy: 'u-admin', ownerId: 'u-admin',
    date: d(21), venue: 'Ballroom Hotel Mulia, Jakarta', capacity: 200, ticketPrice: 250000,
    formFields: ['Nama lengkap', 'Instansi/Usaha', 'Ukuran pakaian gala', 'Nomor WhatsApp'],
    allowNonWidow: true, status: 'published', attendees: ['u-1', 'u-non1'],
    absensi: [{ name: 'Sari Wulandari', checkedIn: true, at: d(-1) }],
  },
  {
    id: 'e-2', title: 'Workshop Kue Kering Lebaran', createdBy: 'u-1', ownerId: 'u-1',
    date: d(9), venue: 'Dapur Sari, Bandung', capacity: 30, ticketPrice: 75000,
    formFields: ['Nama lengkap', 'Domisili', 'Pengalaman memasak?'],
    allowNonWidow: false, status: 'published', attendees: ['u-2', 'u-3'], absensi: [],
  },
]

export const seedGroups = [
  { id: 'g-1', name: 'Circle The CEO — Bisnis Kuliner', level: 'the-ceo', leaderId: 'u-1', members: ['u-1', 'u-2'], messages: [
    { from: 'u-1', text: 'Selamat datang di circle kita! Sharing ya soal supplier kemasan murah.', at: d(-2) },
    { from: 'u-2', text: 'Siap Kak, aku butuh referensi vendor overdeck nih.', at: d(-1) },
  ]},
  { id: 'g-2', name: 'Wonder Woman — Kelas Awal', level: 'wonder-woman', leaderId: 'u-3', members: ['u-3'], messages: [
    { from: 'u-3', text: 'Halo para Wonder Woman baru! Jangan malu bertanya 💪', at: d(-3) },
  ]},
]

export const seedCourses = [
  { id: 'c-1', title: 'Akademi Digital Marketing untuk UMKM', hours: 16, enrolledBy: ['u-1'], progress: { 'u-1': 60 } },
  { id: 'c-2', title: 'Manajemen Keuangan Sederhana', hours: 8, enrolledBy: ['u-2', 'u-3'], progress: {} },
  { id: 'c-3', title: 'Personal Branding & Konten Kreator', hours: 12, enrolledBy: [], progress: {} },
]

export const seedMarketplace = [
  { id: 'm-1', userId: 'u-1', title: 'Nastel Premium 500gr', price: 85000, category: 'Kuliner', desc: 'Nastel keju lembut, tanpa pengawet.', orders: 12 },
  { id: 'm-2', userId: 'u-1', title: 'Jasa Dekorasi Pastel', price: 350000, category: 'Jasa', desc: 'Dekor meja ulang tahun tema pastel.', orders: 3 },
  { id: 'm-3', userId: 'u-2', title: 'Seragam Kantor Custom', price: 150000, category: 'Fashion', desc: 'Satuan minimum 12 pcs, bordir logo gratis.', orders: 7 },
]

export const seedDonations = [
  { id: 'd-1', donorId: 'u-non1', toUserId: 'u-1', amount: 1500000, method: 'payment-gateway', status: 'sukses', at: d(-6) },
  { id: 'd-2', donorId: 'u-non1', toUserId: 'u-2', amount: 1000000, method: 'transfer-manual', proof: 'bukti-transfer.jpg', status: 'diverifikasi', at: d(-4) },
  { id: 'd-3', donorId: 'u-non2', toUserId: 'u-1', amount: 750000, method: 'qris', status: 'menunggu', at: d(-1) },
]

export const seedContracts = [
  { id: 'k-1', title: 'Kontrak Pasokan Snack — PT Sentra Office', userId: 'u-1', value: 18000000, status: 'berjalan', signedAt: d(-20) },
  { id: 'k-2', title: 'MOU Pelatihan Jahit Kelurahan', userId: 'u-2', value: 6000000, status: 'selesai', signedAt: d(-45) },
]

export const settings = {
  adminFeePercent: 5,
  minEventCreateLevel: 'sosialita',
  minTicketPrice: 0,
  subscriptionEnabled: true,
  paymentMethods: ['qris', 'virtual-account', 'e-wallet', 'transfer-manual'],
  donationMin: 10000,
}
