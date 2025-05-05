const { pool } = require("../config/db");

const SiswaModel = {
  getAllSiswa: async () => {
    try {
      const result = await pool.query(
        `SELECT * from siswa`
      );
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

  getAllSiswabyKelas: async (jurusan, kelas) => {
    try {
      const result = await pool.query(
        `SELECT s.id, s.nama, s.nis, s.rfid_uid, j.nama as jurusan, k.nama as kelas, p.nama as pararel
         FROM siswa s
         JOIN jurusan j ON s.jurusan_id = j.id
         JOIN kelas k ON s.kelas_id = k.id
         JOIN pararel p ON s.pararel_id = p.id
         WHERE j.nama = $1 AND k.nama = $2
         ORDER BY s.nama ASC`,
        [jurusan, kelas]
      );
      return result.rows;
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