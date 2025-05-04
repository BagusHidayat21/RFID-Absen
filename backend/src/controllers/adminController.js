const bcrypt = require("bcrypt");
const AdminModel = require("../models/adminModel");

const AdminController = {
  getAllAdmin: async (req, res) => {
    try {
      const result = await AdminModel.getAllAdmin();
      if (result.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil semua admin",
        data: result,
      });
    } catch (err) {
      console.error("Gagal mengambil semua admin:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  getAdminById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await AdminModel.getAdminById(id);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil admin",
        data: result,
      });
    } catch (err) {
      console.error("Gagal mengambil admin berdasarkan id:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  insertAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      const result = await AdminModel.insertAdmin(username, password_hash);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan admin",
        data: result,
      });
    } catch (err) {
      console.error("Gagal menambahkan admin:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password } = req.body;
      const result = await AdminModel.updateAdmin(id, { username, password_hash: await bcrypt.hash(password, 10) });
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil memperbarui admin",
        data: result,
      });
    } catch (err) {
      console.error("Gagal memperbarui admin:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await AdminModel.deleteAdmin(id);
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data Admin tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Admin berhasil dihapus",
      });
    } catch (err) {
      console.error("Gagal menghapus admin:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
};

module.exports = AdminController;

