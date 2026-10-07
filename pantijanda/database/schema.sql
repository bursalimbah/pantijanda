-- ============================================================================
-- PantiJanda — "Pahlawan Sejati, Jawara Andalan"
-- Skema Database Relasional (PostgreSQL 14+)
-- Kategori sosial: siapapun boleh mendaftar (Syarat & Ketentuan berlaku).
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------
CREATE TYPE user_role           AS ENUM ('admin', 'user');
CREATE TYPE widow_level         AS ENUM ('wonder-woman', 'sosialita', 'the-ceo', 'high-society');
CREATE TYPE experience_type     AS ENUM ('pelatihan', 'workshop', 'seminar', 'even', 'kemampuan-lain');
CREATE TYPE experience_category AS ENUM ('teknis', 'non-teknis');
CREATE TYPE business_status     AS ENUM ('aktif', 'nonaktif', 'selesai');
CREATE TYPE event_status        AS ENUM ('draft', 'published', 'berlangsung', 'selesai', 'dibatalkan');
CREATE TYPE payment_method      AS ENUM ('payment-gateway', 'qris', 'virtual-account', 'e-wallet', 'transfer-manual');
CREATE TYPE payment_status      AS ENUM ('menunggu', 'diverifikasi', 'sukses', 'ditolak');
CREATE TYPE subscription_tier   AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE sub_status          AS ENUM ('aktif', 'jatuh-tempo', 'berhenti');
CREATE TYPE contract_type       AS ENUM ('kontrak-kerjasama', 'mou', 'perjanjian-kerjasama', 'proposal', 'rab', 'rencana-bisnis');
CREATE TYPE contract_status     AS ENUM ('draft', 'diajukan', 'berjalan', 'selesai', 'batal');
CREATE TYPE doc_type            AS ENUM ('validasi-janda', 'foto-profil', 'proposal', 'rab', 'kontrak', 'mou', 'bukti-bayar', 'lainnya');
CREATE TYPE kpi_source          AS ENUM ('grup-leader', 'buat-event', 'bantu-member', 'promosi-nonjanda', 'akademi', 'lapak', 'kontrak', 'donasi-masuk', 'langganan');
CREATE TYPE donor_grade         AS ENUM ('perak', 'emas', 'platinum', 'diamond');
CREATE TYPE ticket_status       AS ENUM ('belum-dibayar', 'terbayar', 'sudah-checkin', 'batal');
CREATE TYPE group_member_role   AS ENUM ('leader', 'anggota');

-- ---------------------------------------------------------------------------
-- 1. USERS  (akun dasar: username, email, password + status janda)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   TEXT         NOT NULL,                 -- bcrypt/argon2, JANGAN plain text
    role            user_role    NOT NULL DEFAULT 'user',
    is_widow        BOOLEAN      NOT NULL DEFAULT FALSE,   -- jawaban "Apakah status Anda janda?"
    accepted_tnc    BOOLEAN      NOT NULL DEFAULT FALSE,   -- menyetujui Syarat & Ketentuan
    tnc_version     VARCHAR(20),
    full_name       VARCHAR(120),
    avatar_url      TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. WIDOW_PROFILES  (profil lengkap PRIVAT member janda)
-- ---------------------------------------------------------------------------
CREATE TABLE widow_profiles (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    birth_place       VARCHAR(100),
    birth_date        DATE,
    domicile_address  TEXT,
    whatsapp          VARCHAR(20),
    insurance_info    VARCHAR(150),                        -- asuransi & jenisnya
    hobbies           TEXT,                                -- minat & hobi
    talents           TEXT,                                -- bakat (dibaca AI mentor Akademi)
    level             widow_level NOT NULL DEFAULT 'wonder-woman',
    kpi_points        INT         NOT NULL DEFAULT 0,
    validation_doc_id UUID,                                -- FK ditambahkan setelah table documents
    is_verified       BOOLEAN     NOT NULL DEFAULT FALSE,  -- verifikasi dokumen janda oleh admin
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. BANK_ACCOUNTS  (data bank member janda untuk pencairan donasi)
-- ---------------------------------------------------------------------------
CREATE TABLE bank_accounts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_name    VARCHAR(80) NOT NULL,
    account_no   VARCHAR(30) NOT NULL,
    account_name VARCHAR(120) NOT NULL,
    UNIQUE (user_id, bank_name, account_no)
);

-- ---------------------------------------------------------------------------
-- 4. EXPERIENCES  (pengalaman teknis & non-teknis)
-- ---------------------------------------------------------------------------
CREATE TABLE experiences (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category    experience_category NOT NULL,              -- teknis / non-teknis
    type        experience_type     NOT NULL,              -- pelatihan/workshop/seminar/even/kemampuan-lain
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    year        SMALLINT CHECK (year BETWEEN 1950 AND 2100)
);
CREATE INDEX idx_experiences_user ON experiences(user_id, category);

-- ---------------------------------------------------------------------------
-- 5. DOCUMENTS  (upload file: validasi janda, foto profil, bukti bayar, dll.)
-- ---------------------------------------------------------------------------
CREATE TABLE documents (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type     doc_type NOT NULL,
    file_name    VARCHAR(255) NOT NULL,
    file_url     TEXT NOT NULL,                             -- path S3/local storage
    mime_type    VARCHAR(80),
    verified     BOOLEAN,                                   -- utk dokumen validasi janda
    uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE widow_profiles
  ADD CONSTRAINT fk_validation_doc FOREIGN KEY (validation_doc_id)
  REFERENCES documents(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- 6. BUSINESSES  (usaha member janda yang butuh modal/support)
-- ---------------------------------------------------------------------------
CREATE TABLE businesses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    capital_needed  BIGINT NOT NULL DEFAULT 0 CHECK (capital_needed >= 0),
    status          business_status NOT NULL DEFAULT 'aktif',
    proposal_text   TEXT,                                  -- isi proposal kerjasama
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. RAB_ITEMS  (Rencana Anggaran Biaya — tampil di frame view)
-- ---------------------------------------------------------------------------
CREATE TABLE rab_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    item_name   VARCHAR(200) NOT NULL,
    quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price  BIGINT NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    notes       TEXT
);
CREATE VIEW v_business_rab_total AS
SELECT b.id AS business_id, b.name, COALESCE(SUM(r.quantity * r.unit_price), 0) AS rab_total
FROM businesses b LEFT JOIN rab_items r ON r.business_id = b.id
GROUP BY b.id, b.name;

-- ---------------------------------------------------------------------------
-- 8. FOLLOWS  (social graph: setiap user bisa saling follow)
-- ---------------------------------------------------------------------------
CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
);

-- ---------------------------------------------------------------------------
-- 9. COMMITMENTS  (dukungan komitmen user non-janda ke usaha member janda)
-- ---------------------------------------------------------------------------
CREATE TABLE commitments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    message      TEXT,
    kind         VARCHAR(50) NOT NULL DEFAULT 'dukungan',  -- dukungan/modal/pembinaan
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 10. EVENTS  (dibuat hanya oleh admin atau member janda berlevel minimum)
-- ---------------------------------------------------------------------------
CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    venue           TEXT,
    event_date      TIMESTAMPTZ NOT NULL,
    capacity        INT NOT NULL DEFAULT 100 CHECK (capacity > 0),
    ticket_price    BIGINT NOT NULL DEFAULT 0,
    allow_non_widow BOOLEAN NOT NULL DEFAULT TRUE,
    form_fields     JSONB NOT NULL DEFAULT '[]',           -- pengaturan form pendaftaran event
    status          event_status NOT NULL DEFAULT 'draft',
    created_by      UUID NOT NULL REFERENCES users(id),
    owner_id        UUID NOT NULL REFERENCES users(id),    -- penyelenggara
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 11. EVENT_REGISTRATIONS + TICKETS  (tiket ber-QR code + absensi check-in)
-- ---------------------------------------------------------------------------
CREATE TABLE event_registrations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = pendaftar anonim
    form_data     JSONB NOT NULL DEFAULT '{}',                    -- jawaban field custom
    ticket_code   VARCHAR(40) UNIQUE NOT NULL,                    -- payload QR tiket masuk
    ticket_status ticket_status NOT NULL DEFAULT 'belum-dibayar',
    checked_in_at TIMESTAMPTZ,                                    -- waktu absen via scan QR
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reg_event ON event_registrations(event_id);

-- ---------------------------------------------------------------------------
-- 12. CHAT GROUPS  (grup per level status sama + ketua/leader → poin KPI)
-- ---------------------------------------------------------------------------
CREATE TABLE chat_groups (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name      VARCHAR(150) NOT NULL,
    level     widow_level NOT NULL,
    leader_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE chat_group_members (
    group_id    UUID NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_role group_member_role NOT NULL DEFAULT 'anggota',
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, user_id)
);
CREATE TABLE chat_messages (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id  UUID NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body      TEXT NOT NULL,
    sent_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_msg_group ON chat_messages(group_id, sent_at);

-- ---------------------------------------------------------------------------
-- 13. AKADEMI: COURSES + ENROLLMENTS + AI MENTOR
-- ---------------------------------------------------------------------------
CREATE TABLE courses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(200) NOT NULL,
    description TEXT,
    hours      INT NOT NULL DEFAULT 0,
    kpi_reward INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE course_enrollments (
    course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    progress_pct INT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    completed    BOOLEAN NOT NULL DEFAULT FALSE,
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (course_id, user_id)
);
CREATE TABLE ai_mentor_sessions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic      VARCHAR(100) NOT NULL DEFAULT 'akademi',  -- akademi/proposal/rab/bisnis/kontrak/mou
    messages   JSONB NOT NULL DEFAULT '[]',              -- riwayat percakapan AI
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 14. DONATIONS  (donatur terdaftar/anonim; gateway/QRIS/manual+bukti bayar)
-- ---------------------------------------------------------------------------
CREATE TABLE donations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,   -- NULL = donatur tak terdaftar
    donor_name    VARCHAR(120),                                   -- nama utk donatur anonim
    to_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,   -- NULL = kas komunitas
    amount        BIGINT NOT NULL CHECK (amount > 0),
    method        payment_method NOT NULL,
    status        payment_status NOT NULL DEFAULT 'menunggu',
    proof_doc_id  UUID REFERENCES documents(id) ON DELETE SET NULL, -- upload bukti bayar
    gateway_ref   VARCHAR(120),                                     -- ref dari payment gateway
    qr_string     TEXT,                                             -- payload QRIS/barcode
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at   TIMESTAMPTZ,
    verified_by   UUID REFERENCES users(id)
);
CREATE INDEX idx_donations_to ON donations(to_user_id, status);

-- Rekap donor → menentukan badge level & grade non-janda
CREATE VIEW v_donor_totals AS
SELECT u.id AS user_id, u.username,
       COALESCE(SUM(d.amount) FILTER (WHERE d.status IN ('sukses','diverifikasi')), 0) AS donate_total
FROM users u LEFT JOIN donations d ON d.donor_user_id = u.id
GROUP BY u.id, u.username;

-- ---------------------------------------------------------------------------
-- 15. SUBSCRIPTIONS  (langganan tier bulanan; badge aktif tanpa syarat level)
-- ---------------------------------------------------------------------------
CREATE TABLE subscriptions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier          subscription_tier NOT NULL,
    monthly_price BIGINT NOT NULL,
    status        sub_status NOT NULL DEFAULT 'aktif',
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at    TIMESTAMPTZ NOT NULL,
    payment_id    UUID REFERENCES donations(id) ON DELETE SET NULL
);
CREATE INDEX idx_sub_user ON subscriptions(user_id, status);

-- ---------------------------------------------------------------------------
-- 16. CONTRACTS  (hasil kontrak kerjasama / MOU → laporan keuangan)
-- ---------------------------------------------------------------------------
CREATE TABLE contracts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(200) NOT NULL,
    ctype        contract_type NOT NULL,
    counterparty VARCHAR(150),
    value        BIGINT NOT NULL DEFAULT 0,
    status       contract_status NOT NULL DEFAULT 'draft',
    signed_at    TIMESTAMPTZ,
    document_id  UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 17. MARKETPLACE  (lapak janda: share keahlian / jualan)
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_products (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(200) NOT NULL,
    category     VARCHAR(60),                     -- Kuliner/Fashion/Jasa/dll.
    price        BIGINT NOT NULL DEFAULT 0,
    description  TEXT,
    image_url    TEXT,
    orders_count INT NOT NULL DEFAULT 0,
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 18. KPI_LOGS  (riwayat kontribusi → perhitungan kenaikan level)
-- ---------------------------------------------------------------------------
CREATE TABLE kpi_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source     kpi_source NOT NULL,
    points     INT NOT NULL,
    reference  VARCHAR(120),                      -- mis. event_id / group_id
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kpi_user ON kpi_logs(user_id, created_at);

-- ---------------------------------------------------------------------------
-- 19. SETTINGS  (key-value konfigurasi dashboard admin)
-- ---------------------------------------------------------------------------
CREATE TABLE settings (
    key        VARCHAR(80) PRIMARY KEY,
    value      JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES users(id)
);
-- Kunci yang dipakai: admin_fee_percent, donation_min, min_ticket_price,
-- min_event_create_level, subscription_enabled, payment_methods,
-- kpi_rules, level_thresholds, tiers

-- ---------------------------------------------------------------------------
-- 20. V_FINANCE_SUMMARY  (laporan keuangan gabungan donasi+kontrak+event)
-- ---------------------------------------------------------------------------
CREATE VIEW v_finance_summary AS
SELECT
  (SELECT COALESCE(SUM(amount),0) FROM donations WHERE status IN ('sukses','diverifikasi')) AS total_donation,
  (SELECT COALESCE(SUM(value),0)  FROM contracts  WHERE status IN ('berjalan','selesai'))   AS total_contract_value,
  (SELECT COUNT(*) FROM events)                                                             AS total_events,
  (SELECT COUNT(*) FROM users WHERE is_widow)                                               AS total_widows,
  (SELECT COUNT(*) FROM subscriptions WHERE status='aktif')                                 AS active_subscriptions;

COMMIT;
