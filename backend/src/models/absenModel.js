const { pool } = require('../config/db');

const insertAbsen = async (siswa_id, status) => {
  const query = `
    INSERT INTO absen (siswa_id, status)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [siswa_id, status];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('❌ Error inserting absen:', err);
    throw err;
  }
};

const getAbsenBySiswaId = async (siswa_id) => {
  const query = 'SELECT * FROM absen WHERE siswa_id = $1';
  try {
    const result = await pool.query(query, [siswa_id]);
    return result.rows;
  } catch (err) {
    console.error('❌ Error getting absen by siswa_id:', err);
    throw err;
  }
};

module.exports = { insertAbsen, getAbsenBySiswaId };
