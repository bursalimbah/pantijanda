-- ============================================================================
-- PantiJanda — Seed data (mengikuti data demo di src/data/seed.js)
-- Jalankan setelah schema.sql. Password demo: admin123 / rahasia (bcrypt hash).
-- ============================================================================
BEGIN;

INSERT INTO settings (key, value) VALUES
 ('admin_fee_percent', '5'),
 ('donation_min', '10000'),
 ('min_ticket_price', '0'),
 ('min_event_create_level', '"sosialita"'),
 ('subscription_enabled', 'true'),
 ('payment_methods', '["qris","virtual-account","e-wallet","transfer-manual"]'),
 ('kpi_rules', '{"grup-leader":40,"buat-event":50,"bantu-member":25,"promosi-nonjanda":15,"akademi":30,"lapak":10,"kontrak":60}'),
 ('level_thresholds', '[{"id":"wonder-woman","minKpi":0},{"id":"sosialita","minKpi":150},{"id":"the-ceo","minKpi":400},{"id":"high-society","minKpi":800}]'),
 ('tiers', '[{"id":"bronze","price":50000},{"id":"silver","price":150000},{"id":"gold","price":500000}]');

-- USERS (password_hash = bcrypt dari 'admin123' dan 'rahasia' — ganti di produksi)
INSERT INTO users (id, username, email, password_hash, role, is_widow, accepted_tnc, full_name, bio) VALUES
 ('11111111-1111-1111-1111-111111111111','adminpj','admin@pantijanda.id','$2b$12$demoAdminHashReplaceMe','admin',FALSE,TRUE,'Admin PantiJanda','Pengelola platform.'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','sari','sari@mail.com','$2b$12$demoUserHashReplaceMe','user',TRUE,TRUE,'Sari Wulandari',NULL),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','maya','maya@mail.com','$2b$12$demoUserHashReplaceMe','user',TRUE,TRUE,'Maya Anggraini',NULL),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','dewi','dewi@mail.com','$2b$12$demoUserHashReplaceMe','user',TRUE,TRUE,'Dewi Lestari',NULL),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd','budi','budi@mail.com','$2b$12$demoUserHashReplaceMe','user',FALSE,TRUE,'Budi Santoso',NULL),
 ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','rina','rina@mail.com','$2b$12$demoUserHashReplaceMe','user',FALSE,TRUE,'Rina Marlina',NULL);

-- DOKUMEN VALIDASI JANDA
INSERT INTO documents (id, user_id, doc_type, file_name, file_url, verified) VALUES
 ('d0000001-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','validasi-janda','SKPN-Sari.pdf','/files/SKPN-Sari.pdf',TRUE),
 ('d0000002-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','validasi-janda','Akta-Kematian-Maya.pdf','/files/Akta-Kematian-Maya.pdf',TRUE),
 ('d0000003-0000-0000-0000-000000000003','cccccccc-cccc-cccc-cccc-cccccccccccc','validasi-janda','SKPN-Dewi.pdf','/files/SKPN-Dewi.pdf',TRUE);

-- PROFIL LENGKAP MEMBER JANDA
INSERT INTO widow_profiles (user_id, birth_place, birth_date, domicile_address, whatsapp, insurance_info, hobbies, talents, level, kpi_points, validation_doc_id, is_verified) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Bandung','1990-05-14','Jl. Melati No. 12, Bandung','0812-3456-7890','Jiwa — BPJS Ketenagakerjaan','Memasak, blogging','Kue kering & dekorasi pastel','the-ceo',460,'d0000001-0000-0000-0000-000000000001',TRUE),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Yogyakarta','1985-11-02','Jl. Kaliurang KM 8, Sleman','0856-1122-3344','Kesehatan — BPJS Kesehatan','Menjahit, membaca','Tailoring & pattern making','sosialita',210,'d0000002-0000-0000-0000-000000000002',TRUE),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','Surabaya','1993-07-21','Jl. Ahmad Yani 88, Surabaya','0821-9988-7766','Tidak punya','Make-up, konten kreator','MUA & video editing','wonder-woman',40,'d0000003-0000-0000-0000-000000000003',TRUE);

-- DATA BANK
INSERT INTO bank_accounts (user_id, bank_name, account_no, account_name) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','BCA','1234567890','Sari Wulandari'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Mandiri','9088776655','Maya Anggraini'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','BNI','1122334455','Dewi Lestari');

-- PENGALAMAN TEKNIS & NON-TEKNIS
INSERT INTO experiences (user_id, category, type, title, year) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','teknis','pelatihan','Digital Marketing Bootcamp',2024),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','non-teknis','workshop','Public Speaking Workshop',2023),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','teknis','seminar','Seminar UMKM Go Digital',2025),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','non-teknis','pelatihan','Menjahit Profesional (kursus 3 bln)',2022),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','teknis','pelatihan','Event Photography Class',2025);

-- USAHA + RAB
INSERT INTO businesses (id, user_id, name, description, capital_needed, proposal_text) VALUES
 ('b1000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Dapur Sari — Katering Harian','Modal pembelian oven & kemasan untuk skala rumahan menjadi katering harian kantor.',25000000,'Proposal Pengembangan Dapur Sari: meningkatkan kapasitas produksi dari 30 menjadi 150 porsi/hari dengan target pasar karyawan kantor di kawasan Dago.'),
 ('b1000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Atelier Maya — Konveksi Rumahan','Mes jahit industri & bahan untuk pesanan seragam.',12000000,'Proposal kerjasama produksi seragam komunitas dengan sistem bagi hasil.');

INSERT INTO rab_items (business_id, item_name, quantity, unit_price) VALUES
 ('b1000000-0000-0000-0000-000000000001','Oven kapasitas besar',1,8500000),
 ('b1000000-0000-0000-0000-000000000001','Kemasan food-grade 500 pcs',1,3500000),
 ('b1000000-0000-0000-0000-000000000001','Bahan baku awal',1,8000000),
 ('b1000000-0000-0000-0000-000000000001','Peralatan dapur lain',1,5000000),
 ('b1000000-0000-0000-0000-000000000002','Mesin jahit industri',2,4500000),
 ('b1000000-0000-0000-0000-000000000002','Overdeck',1,3000000),
 ('b1000000-0000-0000-0000-000000000002','Stok kain',1,3000000);

-- FOLLOW
INSERT INTO follows (follower_id, followee_id) VALUES
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
 ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- EVENTS (form_fields JSONB sesuai pengaturan penyelenggara)
INSERT INTO events (id, title, venue, event_date, capacity, ticket_price, form_fields, allow_non_widow, status, created_by, owner_id) VALUES
 ('e1000000-0000-0000-0000-000000000001','Gala Dinner High Society 2026','Ballroom Hotel Mulia, Jakarta', now()+interval '21 days',200,250000,'["Nama lengkap","Instansi/Usaha","Ukuran pakaian gala","Nomor WhatsApp"]',TRUE,'published','11111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111'),
 ('e1000000-0000-0000-0000-000000000002','Workshop Kue Kering Lebaran','Dapur Sari, Bandung', now()+interval '9 days',30,75000,'["Nama lengkap","Domisili","Pengalaman memasak?"]',FALSE,'published','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- TIKET + ABSEN (tiket e-1 milik Sari sudah check-in)
INSERT INTO event_registrations (event_id, user_id, form_data, ticket_code, ticket_status, checked_in_at) VALUES
 ('e1000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','{"Nama lengkap":"Sari Wulandari"}','PJ-E1-0001','sudah-checkin', now()-interval '1 day'),
 ('e1000000-0000-0000-0000-000000000001','dddddddd-dddd-dddd-dddd-dddddddddddd','{"Nama lengkap":"Budi Santoso"}','PJ-E1-0002','terbayar',NULL),
 ('e1000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','{"Nama lengkap":"Maya Anggraini"}','PJ-E2-0001','terbayar',NULL),
 ('e1000000-0000-0000-0000-000000000002','cccccccc-cccc-cccc-cccc-cccccccccccc','{"Nama lengkap":"Dewi Lestari"}','PJ-E2-0002','terbayar',NULL);

-- GRUP CHAT LEVEL + PESAN
INSERT INTO chat_groups (id, name, level, leader_id) VALUES
 ('g1000000-0000-0000-0000-000000000001','Circle The CEO — Bisnis Kuliner','the-ceo','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
 ('g1000000-0000-0000-0000-000000000002','Wonder Woman — Kelas Awal','wonder-woman','cccccccc-cccc-cccc-cccc-cccccccccccc');
INSERT INTO chat_group_members (group_id, user_id, member_role) VALUES
 ('g1000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','leader'),
 ('g1000000-0000-0000-0000-000000000001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','anggota'),
 ('g1000000-0000-0000-0000-000000000002','cccccccc-cccc-cccc-cccc-cccccccccccc','leader');
INSERT INTO chat_messages (group_id, sender_id, body) VALUES
 ('g1000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Selamat datang di circle kita! Sharing ya soal supplier kemasan murah.'),
 ('g1000000-0000-0000-0000-000000000001','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Siap Kak, aku butuh referensi vendor overdeck nih.'),
 ('g1000000-0000-0000-0000-000000000002','cccccccc-cccc-cccc-cccc-cccccccccccc','Halo para Wonder Woman baru! Jangan malu bertanya 💪');

-- AKADEMI
INSERT INTO courses (id, title, hours, kpi_reward) VALUES
 ('c1000000-0000-0000-0000-000000000001','Akademi Digital Marketing untuk UMKM',16,30),
 ('c1000000-0000-0000-0000-000000000002','Manajemen Keuangan Sederhana',8,30),
 ('c1000000-0000-0000-0000-000000000003','Personal Branding & Konten Kreator',12,30);
INSERT INTO course_enrollments (course_id, user_id, progress_pct) VALUES
 ('c1000000-0000-0000-0000-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',60),
 ('c1000000-0000-0000-0000-000000000002','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',0),
 ('c1000000-0000-0000-0000-000000000002','cccccccc-cccc-cccc-cccc-cccccccccccc',0);

-- DONASI (gateway otomatis sukses; manual menunggu bukti bayar)
INSERT INTO donations (id, donor_user_id, to_user_id, amount, method, status, proof_doc_id) VALUES
 ('f1000000-0000-0000-0000-000000000001','dddddddd-dddd-dddd-dddd-dddddddddddd','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',1500000,'payment-gateway','sukses',NULL),
 ('f1000000-0000-0000-0000-000000000002','dddddddd-dddd-dddd-dddd-dddddddddddd','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',1000000,'transfer-manual','diverifikasi',NULL),
 ('f1000000-0000-0000-0000-000000000003','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',750000,'qris','menunggu',NULL);

-- KONTRAK KERJASAMA
INSERT INTO contracts (user_id, title, ctype, counterparty, value, status, signed_at) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Kontrak Pasokan Snack — PT Sentra Office','kontrak-kerjasama','PT Sentra Office',18000000,'berjalan',now()-interval '20 days'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','MOU Pelatihan Jahit Kelurahan','mou','Kelurahan Condongcatur',6000000,'selesai',now()-interval '45 days');

-- MARKETPLACE
INSERT INTO marketplace_products (user_id, title, category, price, description, orders_count) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Nastel Premium 500gr','Kuliner',85000,'Nastel keju lembut, tanpa pengawet.',12),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Jasa Dekorasi Pastel','Jasa',350000,'Dekor meja ulang tahun tema pastel.',3),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Seragam Kantor Custom','Fashion',150000,'Satuan minimum 12 pcs, bordir logo gratis.',7);

-- KPI LOGS (riwayat kontribusi sari → 460 poin)
INSERT INTO kpi_logs (user_id, source, points, note) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','grup-leader',40,'Ketua Circle The CEO'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','buat-event',50,'Workshop Kue Kering Lebaran'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','kontrak',60,'Kontrak PT Sentra Office'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','lapak',10,'Lapak Nastel Premium'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','akademi',30,'Digital Marketing UMKM'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bantu-member',25,'Mentoring member baru'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','promosi-nonjanda',15,'Kampanye Sahabat PantiJanda'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','buat-event',50,'Bazar Fashion'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','lapak',10,'Lapak Seragam Custom'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','akademi',30,'Keuangan Sederhana'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','bantu-member',25,'Bantu jahit props'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','promosi-nonjanda',15,'Promosi ke rekan kerja'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','akademi',30,'Baru ikut kelas'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','promosi-nonjanda',10,'Share IG');

COMMIT;
