const JurusanModel = require("../models/jurusanModel");

const JurusanController = {
  getAllJurusan: async (req, res) => {
    try {
      const result = await JurusanModel.getAllJurusan();
      if (result.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil semua jurusan",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  getJurusanById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await JurusanModel.getJurusanById(id);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil jurusan",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  createJurusan: async (req, res) => {
    try {
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama jurusan harus diisi",
        });
      }
      const result = await JurusanModel.createJurusan({ nama });
      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan jurusan",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  updateJurusan: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama jurusan harus diisi",
        });
      }
      const result = await JurusanModel.updateJurusan(id, { nama });
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengubah jurusan",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  deleteJurusan: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await JurusanModel.deleteJurusan(id);
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil menghapus jurusan",
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
};

module.exports = JurusanController;

