require('dotenv').config();
const { Pool } = require('pg');

// Koneksi database menggunakan Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Setup database dan tabel
const setupDatabase = async () => {
  try {
    // ENUM jurusan
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'jurusan_enum') THEN
          CREATE TYPE jurusan_enum AS ENUM ('RPL', 'EI', 'OI', 'DBIB', 'TKP', 'TSM', 'TPM', 'TLAS', 'TPTUP');
        END IF;
      END$$;
    `);

    // ENUM kelas
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kelas_enum') THEN
          CREATE TYPE kelas_enum AS ENUM ('X', 'XI', 'XII');
        END IF;
      END$$;
    `);

    // ENUM status absen
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'absen_status') THEN
          CREATE TYPE absen_status AS ENUM ('hadir', 'tidak_hadir');
        END IF;
      END$$;
    `);

    // ENUM kelas paralel
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kelas_paralel_enum') THEN
          CREATE TYPE kelas_paralel_enum AS ENUM ('A', 'B', 'C', 'D');
        END IF;
      END$$;
    `);

    // Tabel siswa (dengan RFID dan kelas paralel)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS data_siswa (
        id SERIAL PRIMARY KEY,
        nisn VARCHAR(15) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        rfid VARCHAR(50) NOT NULL UNIQUE,
        jurusan jurusan_enum NOT NULL DEFAULT 'RPL',
        kelas kelas_enum NOT NULL DEFAULT 'X',
        kelas_paralel kelas_paralel_enum NOT NULL DEFAULT 'A'
      );
    `);

    // Tabel absen (tanpa RFID)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS absen (
        id SERIAL PRIMARY KEY,
        siswa_id INTEGER REFERENCES data_siswa(id) ON DELETE CASCADE,
        waktu TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status absen_status NOT NULL
      );
    `);

    console.log('✔️  Semua tabel & enum berhasil disiapkan');
  } catch (error) {
    console.error('❌ Gagal setup database:', error);
  }
};

module.exports = { pool, setupDatabase };
