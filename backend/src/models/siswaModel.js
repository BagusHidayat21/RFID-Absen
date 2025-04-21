const { pool } = require("../config/db");

const SiswaModel = {
  getAllSiswa: async () => {
    const result = await pool.query("SELECT * FROM data_siswa ORDER BY id");
    return result.rows;
  },

  getSiswaById: async (id) => {
    const result = await pool.query("SELECT * FROM data_siswa WHERE id = $1", [id]);
    return result.rows[0];
  },

  createSiswa: async ({ nisn, nama, rfid, jurusan, kelas, kelas_paralel }) => {
    const result = await pool.query(
      `INSERT INTO data_siswa (nisn, nama, rfid, jurusan, kelas, kelas_paralel)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nisn, nama, rfid, jurusan, kelas, kelas_paralel]
    );
    return result.rows[0];
  },

  updateSiswa: async (id, { nisn, nama, rfid, jurusan, kelas, kelas_paralel }) => {
    const result = await pool.query(
      `UPDATE data_siswa
       SET nisn = $1, nama = $2, rfid = $3, jurusan = $4, kelas = $5, kelas_paralel = $6
       WHERE id = $7
       RETURNING *`,
      [nisn, nama, rfid, jurusan, kelas, kelas_paralel, id]
    );
    return result.rows[0];
  },

  deleteSiswa: async (id) => {
    await pool.query("DELETE FROM data_siswa WHERE id = $1", [id]);
  },
};

module.exports = SiswaModel;
