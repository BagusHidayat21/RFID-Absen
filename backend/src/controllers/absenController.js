const AbsenModel = require("../models/absenModel");

const AbsenController = {
  getAllAbsen: async (req, res) => {
    try {
      const absens = await AbsenModel.getAllAbsen();
      if (absens.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data absen tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil semua data absen",
        data: absens,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  getAbsenById: async (req, res) => {
    try {
      const { id } = req.params;
      const absen = await AbsenModel.getAbsenById(id);
      if (absen.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data absen tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data absen",
        data: absen,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  addAbsen: async (req, res) => {
    try {
      const { siswa_id, tanggal, jam, status, keterangan } = req.body;
      const newAbsen = await AbsenModel.insertAbsen({
        siswa_id,
        tanggal,
        jam,
        status,
        keterangan,
      });
      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan data absen",
        data: newAbsen,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  updateAbsen: async (req, res) => {
    try {
      const { id } = req.params;
      const { tanggal, jam, status, keterangan } = req.body;
      const updatedAbsen = await AbsenModel.updateAbsen({
        id,
        tanggal,
        jam,
        status,
        keterangan,
      });
      if (!updatedAbsen) {
        return res.status(404).json({
          status: 404,
          message: "Absen tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengubah data absen",
        data: updatedAbsen,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  deleteAbsen: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await AbsenModel.deleteAbsen(id);
      
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data absen tidak ditemukan",
        });
      }
  
      res.status(200).json({
        status: 200,
        message: "Berhasil menghapus data absen",
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  }
};

module.exports = AbsenController;