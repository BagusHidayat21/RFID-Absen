const { pool } = require('../config/db');

const insertSiswa = async (nisn, nama, rfid, jurusan, kelas, kelasParalel) => {
  const query = `
    INSERT INTO data_siswa (nisn, nama, rfid, jurusan, kelas, kelas_paralel)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nisn, nama, rfid, jurusan, kelas, kelasParalel];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Error inserting siswa:', err);
    throw err;
  }
};

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

module.exports = { insertSiswa, getAllSiswa, getSiswaById };
