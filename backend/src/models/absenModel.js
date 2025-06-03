const { pool } = require("../config/db");

const AbsenModel = {
  insertAbsen: async ({ siswa_id, tanggal, jam, status, keterangan }) => {
    try {
      const result = await pool.query(
        "INSERT INTO absensi (siswa_id, tanggal, jam, status, keterangan) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [siswa_id, tanggal, jam, status, keterangan]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  getAllAbsen: async () => {
    try {
      const result = await pool.query("SELECT absensi.id, siswa.id AS siswa_id, siswa.nama, siswa.nis, siswa.kelas_id, siswa.jurusan_id, siswa.pararel_id, absensi.tanggal, absensi.jam, absensi.status, absensi.keterangan FROM absensi JOIN siswa ON absensi.siswa_id = siswa.id ORDER BY absensi.tanggal DESC;");
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  getAbsenById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM absensi WHERE id = $1",
        [id]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  updateAbsen: async ({ id, tanggal, jam, status, keterangan }) => {
    try {
      const result = await pool.query(
        "UPDATE absensi SET tanggal = $2, jam = $3, status = $4, keterangan = $5 WHERE id = $1 RETURNING *;",
        [id, tanggal, jam, status, keterangan]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  deleteAbsen: async (id) => {
    try {
      const result = await pool.query(
        "DELETE FROM absensi WHERE id = $1 RETURNING *;",
        [id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },  
};

module.exports = AbsenModel;