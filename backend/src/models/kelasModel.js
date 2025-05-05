const { pool } = require("../config/db");

const KelasModel = {
  getAllKelas: async () => {
    try {
      const result = await pool.query("SELECT * FROM kelas");
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getKelasById: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM kelas WHERE id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  insertKelas: async (nama) => {
    try {
      const result = await pool.query(
        `INSERT INTO kelas (nama) VALUES ($1) RETURNING *`,
        [nama]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  updateKelas: async (id, { nama }) => {
    try {
      const result = await pool.query(
        `UPDATE kelas SET nama = $1 WHERE id = $2 RETURNING *`,
        [nama, id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  deleteKelas: async (id) => {
    try {
      const result = await pool.query("DELETE FROM kelas WHERE id = $1", [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = KelasModel;