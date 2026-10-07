// "AI" lokal: generator draf dokumen & mentor akademi berbasis template + data profil user.

export function aiGenerate(kind, user = {}, extra = {}) {
  const name = user.fullName || 'Ibu'
  const biz = user.business?.name || 'usaha yang sedang dijalankan'
  const need = user.business?.need ? new Intl.NumberFormat('id-ID').format(user.business.need) : '…'
  const talents = user.talents || 'keahlian yang dimiliki'
  const city = (user.address || '').split(',').pop()?.trim() || 'Indonesia'

  switch (kind) {
    case 'proposal':
      return `PROPOSAL KERJASAMA\n${biz.toUpperCase()}\n\n1. LATAR BELAKANG\nSaya ${name}, member PantiJanda dengan keahlian ${talents}, berupaya mengembangkan ${biz} di ${city}. Proposal ini diajukan untuk memperoleh dukungan modal sebesar Rp${need}.\n\n2. TUJUAN\n- Meningkatkan kapasitas produksi dan jangkauan pasar.\n- Membuka lapangan kerja bagi sesama member.\n\n3. RUANG LINGKUP KERJASAMA\nDukungan modal/investasi berdasarkan RAB terlampir, dengan skema bagi hasil transparan dan laporan berkala tiap bulan.\n\n4. PENUTUP\nBesar harapan kami agar kerjasama ini tercipta untuk kebaikan bersama. Hormat kami, ${name}.`
    case 'rab':
      return `RENCANA ANGGARAN BIAYA — ${biz.toUpperCase()}\n\nNo | Uraian | Volume | Harga Satuan | Jumlah\n---+--------+--------+--------------+------\n1  | Bahan baku awal | 1 paket | Rp - | ...\n2  | Peralatan produksi | 1 unit | Rp - | ...\n3  | Kemasan & branding | 500 pcs | Rp - | ...\n4  | Biaya operasional bln ke-1 | 1 bln | Rp - | ...\n\nTotal Kebutuhan: Rp${need}\nDisusun oleh: ${name}, ${city}`
    case 'business-plan':
      return `PERENCANAAN BISNIS\n\nA. Ringkasan Eksekutif — ${biz} milik ${name} berfokus pada ${talents}.\nB. Analisis Pasar: target pelanggan di ${city} dan kanal online (marketplace PantiJanda, media sosial).\nC. Model Pendapatan: penjualan langsung, paket langganan, jasa custom.\nD. Operasional: produksi rumahan → skala kecil → kemitraan reseller antar member.\nE. Keuangan: kebutuhan modal Rp${need}; BEP diproyeksikan 8–12 bulan.\nF. Risiko & Mitigasi: diversifikasi supplier, kualitas konsisten, asuransi usaha.`
    case 'kontrak':
      return `KONTRAK KERJASAMA\nNomor: .../PJ/${new Date().getFullYear()}\n\nPara pihak: (1) ${name} — Pihak Pertama; (2) ____________ — Pihak Kedua.\n\nPasal 1 Ruang Lingkup: kerjasama pengadaan/pasokan terkait ${biz}.\nPasal 2 Nilai: Rp${need}, dibayarkan bertahap sesuai termin.\nPasal 3 Jangka Waktu: 12 bulan sejak ditandatangani.\nPasal 4 Hak & Kewajiban, Pasal 5 Keadaan Memaksa, Pasal 6 Penyelesaian Perselisihan.\n\nPihak Pertama,            Pihak Kedua,\n( ${name} )                ( ____________ )`
    case 'mou':
      return `MEMORANDUM OF UNDERSTANDING (MOU)\n\nAntara PantiJanda perwakilan ${name} dengan ____________.\n\nKesepakatan awal mengenai:\n1. Kerjasama pembinaan & pemasaran ${biz}.\n2. Pertukaran data pendukung secara wajar.\n3. MOU ini bukan ikatan finansial; detail diatur dalam Perjanjian Kerjasama terpisah.\n\nTempat/tanggal: ${city}, ${new Date().toLocaleDateString('id-ID')}\nSudah dibaca? Paraf kedua pihak.`
    case 'pkb':
      return `PERJANJIAN KERJASAMA\n\nYang bertanda tangan di bawah ini ${name} (Pihak I) dan ____ (Pihak II), sepakat:\n1. Pihak II mendukung ${biz} senilai Rp${need}.\n2. Pembagian hasil: 60% Pihak I / 40% Pihak II dari laba bersih bulanan.\n3. Laporan keuangan dibuka bersama setiap tanggal 5.\n4. Wanprestasi diselesaikan musyawarah, lalu mediasi.\n\nDitandatangani rangkap 2 bermeterai.`
    default:
      return 'Jenis dokumen tidak dikenal.'
  }
}

export function aiMentor(user) {
  const tips = []
  const t = (user.talents || '').toLowerCase()
  const h = (user.hobbies || '').toLowerCase()
  if (t.includes('jahit') || h.includes('menjahit')) tips.push('Bakat menjahit Anda sangat cocok untuk lapak "Custom Order". Coba buka pre-order seragam komunitas — margin lebih besar dari jahit satuan.')
  if (t.includes('kue') || t.includes('masak') || h.includes('memasak')) tips.push('Keahlian kuliner Anda bisa masuk Akademi modul "Food Content": foto produk yang baik menaikkan konversi hingga 2x.')
  if (t.includes('make') || t.includes('mua') || t.includes('video') || h.includes('konten')) tips.push('Bakat MUA/konten: tawarkan paket "glow-up before-after" untuk event PantiJanda — promosi non-janda paling efektif lewat video pendek.')
  if (!tips.length) tips.push('Lengkapi kolom Bakat & Minat di profil agar AI dapat memberi saran karier yang lebih tajam.')
  tips.push(`Target kenaikan level: kumpulkan poin KPI dari membuat grup (${40}), event (${50}), membantu member (${25}), akademi (${30}).`)
  return tips
}
