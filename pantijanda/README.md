# PantiJanda 🌷

**Pahlawan Sejati, Jawara Andalan** — web app komunitas sosial (siapapun bisa mendaftar) untuk pemberdayaan member berstatus janda: profil terverifikasi, level & badge, event bertiket QR, akademi dengan AI mentor, marketplace, donasi & dukungan modal.

Dibangun dengan **React + Vite + Tailwind CSS + shadcn/ui** (Radix primitives), state global via Context/Reducer dengan persistensi `localStorage`.

## Menjalankan

```bash
cd pantijanda
npm install
npm run dev        # http://localhost:5173
npm run build      # produksi → dist/
```

## Akun Demo

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@pantijanda.id` | `admin123` |
| Member Janda — The CEO | `sari@mail.com` | `rahasia` |
| Member Janda — Sosialita | `maya@mail.com` | `rahasia` |
| Member Janda — Wonder Woman | `dewi@mail.com` | `rahasia` |
| Non-janda (Donatur Emas) | `budi@mail.com` | `rahasia` |

## Fitur Utama

- **Pendaftaran**: form username/email/password → dialog **Syarat & Ketentuan berlaku** → pertanyaan *"Apakah saat ini status Anda janda?"* → dikategorikan **Member Janda** atau **Sahabat PantiJanda** (non-janda).
- **Profil lengkap member janda** (privat): nama, tempat/tanggal lahir, alamat domisili, No. WhatsApp, dokumen validasi status janda, asuransi & jenisnya, minat/hobi, bakat, pengalaman **teknis & non-teknis** (pelatihan/workshop/seminar/event/kemampuan lain), data bank, upload foto profil.
- **Level member janda**: Wonder Woman → Sosialita → The CEO → High Society. Naik berdasarkan **KPI kontribusi**: buat event (+50), grup chat + leader (+40), akademi/pelatihan (+30/+20), bantu member (+25), promosi ke non-janda (+15), lapak (+10), kontrak (+60). Progress bar di dashboard.
- **Berlangganan tier bulanan** (Bronze/Silver/Gold): badge tier langsung aktif **tanpa syarat level & tahapan kontribusi**, selama berlangganan aktif.
- **Event**: pembuatan hanya oleh **Admin / member janda dengan level minimal** (diatur admin). Penyelenggara mengatur **form pendaftaran event** yang muncul di menu Event halaman depan; **tiket masuk & absensi peserta memakai generator QR code** (cetak tiket per-orang/massal, check-in).
- **Usaha & dukungan modal**: member janda mengisi jenis usaha + kebutuhan modal; tombol membuka **frame view RAB** dan **proposal kerjasama**. User non-janda dapat berinteraksi (follow) dan memberi **dukungan komitmen**.
- **Akademi (AI Mentor)**: AI membaca informasi bakat/profil pengguna dan memberi arahan; katalog pelatihan menambah KPI.
- **AI Tools dokumen**: generate draf **Proposal, RAB, Perencanaan Bisnis, Kontrak Kerjasama, MOU, Perjanjian Kerjasama** + cetak/PDF.
- **Laporan keuangan** di dashboard: hasil donasi, hasil kontrak kerjasama, biaya admin, tren donasi (grafik).
- **Marketplace**: member janda share keahlian/jualan dan membuka lapak.
- **Donasi & pembayaran**: payment gateway, **scan barcode QRIS**, atau transfer manual + **kirim bukti bayar** (diverifikasi admin). Donatur boleh **tidak terdaftar** (anonim). Non-janda memperoleh **badge level & grade** (Perak→Emas→Platinum→Diamond) dari total kontribusi.
- **Dashboard Admin**: pengaturan pembayaran & biaya-biaya (fee %, minimum donasi/tiket, tarif tier), verifikasi bukti bayar, kriteria level pembuat event, ambang KPI level.
- **Halaman depan** menampilkan seluruh member status janda dengan **informasi privat disembunyikan**.

## Struktur

```
src/
  components/ui/    # komponen shadcn-style (button, card, dialog, tabs, dll.)
  lib/store.jsx     # state global (reducer + localStorage)
  lib/ai.js         # generator dokumen & mentor AI
  data/seed.js      # level, tier, akun & data demo
  pages/            # Home, Register, Login, Onboarding, Dashboard, Events, Members, MemberDetail, Community, Marketplace, Donate, Admin
```
