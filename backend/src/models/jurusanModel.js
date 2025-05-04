const { pool } = require("../config/db");

const JurusanModel = {
  getAllJurusan: async () => {
    try {
      const result = await pool.query("SELECT * FROM jurusan");
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  getJurusanById: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM jurusan WHERE id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  createJurusan: async ({ nama }) => {
    try {
      const result = await pool.query(`INSERT INTO jurusan (nama) VALUES ($1) RETURNING *`, [nama]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  updateJurusan: async (id, { nama, singkatan }) => {
    try {
      const result = await pool.query(`UPDATE jurusan SET nama = $1  WHERE id = $2 RETURNING *`, [nama, id]);
      if (!result.rows[0]) {
        throw new Error("Jurusan tidak ditemukan");
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  deleteJurusan: async (id) => {
    try {
      const result = await pool.query("DELETE FROM jurusan WHERE id = $1", [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = JurusanModel;
