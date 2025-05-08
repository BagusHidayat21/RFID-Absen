const bcrypt = require("bcrypt");
const AdminModel = require("../models/adminModel");
const { generateAccessToken, generateRefreshToken,verifyRefreshToken } = require("../utils/jwt");
const AdminTokenModel = require("../models/adminTokenModel");

const AdminController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          status: 400,
          message: "Username dan password harus diisi",
        });
      }

      const result = await AdminModel.getAdminByUsername(username);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Username tidak ditemukan",
        });
      }
  
      const isMatch = await bcrypt.compare(password, result.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          status: 401,
          message: "Password salah",
        });
      }
  
      const accessToken = generateAccessToken(result);
      const refreshToken = generateRefreshToken(result);

      await AdminTokenModel.push(result.id, refreshToken);
  
      res.status(200).json({
        status: 200,
        message: "Berhasil login",
        data: {
          id: result.id,
          username: result.username,
          accessToken,
          refreshToken
        },
      });
  
    } catch (err) {
      console.error("Gagal login:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const { admin_id } = req.body;
      await AdminTokenModel.push(admin_id, null);
      res.status(200).json({
        status: 200,
        message: "Berhasil logout"
      });
    } catch (err) {
      console.error("Gagal logout:", err);
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
  
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

refreshAccessToken: async (req,res) => {
  try {
    const { admin_id } = req.body;

    
    const result = await AdminTokenModel.get(admin_id);
    if (!result || !result.refresh_token) {
      return res.status(404).json({
        status: 404,  
        message: 'Refresh token tidak ditemukan'
         });
    }

    const decoded = await verifyRefreshToken(result.refresh_token);
    if (!decoded || !decoded.id) {
      return res.status(403).json({
        status: 403,
        message: 'Refresh token tidak valid'
         });
    }

    const newAccessToken = await generateAccessToken(decoded.id);

    return res.status(200).json({
      status: 200,
      message: 'Berhasil memperbarui access token',
      access_token: newAccessToken
      
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      status: 500,
       message: 'Gagal me-refresh access token'
       });
  }
  }
};

module.exports = AdminController;