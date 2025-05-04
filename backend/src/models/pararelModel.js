const { pool } = require("../config/db");

const PararelModel = {
  getAllPararel: async () => {
    try {
      const result = await pool.query("SELECT * FROM pararel");
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getPararelById: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM pararel WHERE id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  insertPararel: async (nama) => {
    try {
      const result = await pool.query(
        `INSERT INTO pararel (nama) VALUES ($1) RETURNING *`,
        [nama]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  updatePararel: async (id, { nama }) => {
    try {
      const result = await pool.query(
        `UPDATE pararel SET nama = $1 WHERE id = $2 RETURNING *`,
        [nama, id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
  deletePararel: async (id) => {
    try {
      const result = await pool.query("DELETE FROM pararel WHERE id = $1", [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = PararelModel;
