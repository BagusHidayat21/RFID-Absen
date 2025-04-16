const { pool } = require('../config/db');

// Insert data siswa baru
const insertSiswa = async (nisn, nama, rfid, jurusan, kelas, kelas_paralel) => {
  const query = `
    INSERT INTO data_siswa (nisn, nama, rfid, jurusan, kelas, kelas_paralel)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nisn, nama, rfid, jurusan, kelas, kelas_paralel];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Error inserting siswa:', err.message);

    // Reset sequence id jika gagal
    try {
      await pool.query(`
        SELECT setval('data_siswa_id_seq', COALESCE((SELECT MAX(id) FROM data_siswa), 1), true);
      `);
      console.log('🔁 Sequence id siswa telah direset');
    } catch (resetErr) {
      console.error('❌ Gagal reset sequence:', resetErr.message);
    }

    throw err;
  }
};

// Ambil semua siswa
const getAllSiswa = async () => {
  const query = 'SELECT * FROM data_siswa';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('❌ Error getting all siswa:', err);
    throw err;
  }
};

// Ambil siswa berdasarkan ID
const getSiswaById = async (id) => {
  const query = 'SELECT * FROM data_siswa WHERE id = $1';
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Error getting siswa by ID:', err);
    throw err;
  }
};


// Update siswa berdasarkan ID
const updateSiswa = async (id, nisn, nama, rfid, jurusan, kelas, kelas_paralel) => {
  const query = `
    UPDATE data_siswa
    SET nisn = $2,
        nama = $3,
        rfid = $4,
        jurusan = $5,
        kelas = $6,
        kelas_paralel = $7
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, nisn, nama, rfid, jurusan, kelas, kelas_paralel];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Error updating siswa:', err);
    throw err;
  }
};

// Hapus siswa berdasarkan ID
const deleteSiswa = async (id) => {
  const query = 'DELETE FROM data_siswa WHERE id = $1 RETURNING *;';
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Jika null, berarti tidak ditemukan
  } catch (err) {
    console.error('❌ Error deleting siswa:', err);
    throw err;
  }
};

module.exports = {
  insertSiswa,
  getAllSiswa,
  getSiswaById,
  updateSiswa,
  deleteSiswa
};



