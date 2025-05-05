const { pool } = require("../config/db");

const AdminTokenModel = {
  get: async (admin_id) => {
    try {
      const result = await pool.query("SELECT * FROM admin_tokens WHERE admin_id = $1", [admin_id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  push: async (admin_id, refresh_token) => {
    try {
      const result = await pool.query(
        "INSERT INTO admin_tokens (admin_id, refresh_token) VALUES ($1, $2) RETURNING *",
        [admin_id, refresh_token]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === "23505") {
        await pool.query("UPDATE admin_tokens SET refresh_token = $1 WHERE admin_id = $2", [
          refresh_token,
          admin_id,
        ]);
      } else {
        throw err;
      }
    }
  }
};

module.exports = AdminTokenModel;