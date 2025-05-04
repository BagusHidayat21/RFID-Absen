const { pool } = require("../config/db");

const AdminModel = {
  getAllAdmin: async () => {
    try {
      const result = await pool.query("SELECT * FROM admin");
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  getAdminById: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM admin where id = $1", [id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  insertAdmin: async (username, password_hash) => {
    try {
      const result = await pool.query(
        `INSERT INTO admin (username, password_hash) VALUES ($1, $2) RETURNING *`,
        [username, password_hash]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  updateAdmin: async (id, { username, password_hash }) => {
    try {
      const result = await pool.query(
        `UPDATE admin SET username = $1, password_hash = $2 WHERE id = $3 RETURNING *`,
        [username, password_hash, id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  deleteAdmin: async (id) => {
    try {
      const result = await pool.query("DELETE FROM admin WHERE id = $1 RETURNING *", [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = AdminModel;
