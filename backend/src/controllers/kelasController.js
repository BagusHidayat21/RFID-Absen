const KelasModel = require("../models/kelasModel");

const KelasController = {
  getAllKelas: async (req, res) => {
    try {
      const result = await KelasModel.getAllKelas();
      if (result.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil semua data kelas",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ 
        status: 500,
        message: err.message 
      });
    }
  },

  getKelasById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await KelasModel.getKelasById(id);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data kelas tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data kelas",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ 
        status: 500,
        message: err.message 
      });
    }
  },

  createKelas: async (req, res) => {
    try {
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama kelas harus diisi",
        });
      }
      const result = await KelasModel.insertKelas(nama);
      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan data kelas",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ 
        status: 500,
        message: err.message 
      });
    }
  },

  updateKelas: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama kelas harus diisi",
        });
      }
      const result = await KelasModel.updateKelas(id, { nama });
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data kelas tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil memperbarui data kelas",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ 
        status: 500,
        message: err.message 
      });
    }
  },

  deleteKelas: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await KelasModel.deleteKelas(id);
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data kelas tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil menghapus data kelas",
      });
    } catch (err) {
      res.status(500).json({ 
        status: 500,
        message: err.message 
      });
    }
  },
};

module.exports = KelasController;

