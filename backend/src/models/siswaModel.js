const { pool } = require("../config/db");

const SiswaModel = {
  getAllSiswa: async () => {
    try {
      const result = await pool.query("SELECT * FROM siswa ORDER BY id");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getSiswaById: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM siswa WHERE id = $1", [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  createSiswa: async ({ nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id }) => {
    try {
      const result = await pool.query(
        `INSERT INTO siswa (nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  updateSiswa: async (id, { nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id }) => {
    try {
      const result = await pool.query(
        `UPDATE siswa
         SET nama = $1, nis = $2, rfid_uid = $3, kelas_id = $4, jurusan_id = $5, pararel_id = $6
         WHERE id = $7
         RETURNING *`,
        [nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  deleteSiswa: async (id) => {
    try {
      await pool.query("DELETE FROM siswa WHERE id = $1", [id]);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = SiswaModel;
