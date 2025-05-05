const PararelModel = require("../models/pararelModel");

const PararelController = {
  getAllPararel: async (req, res) => {
    try {
      const result = await PararelModel.getAllPararel();
      if (result.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil semua data paralel",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },

  getPararelById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PararelModel.getPararelById(id);
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data paralel",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },

  insertPararel: async (req, res) => {
    try {
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama paralel harus diisi",
        });
      }
      const result = await PararelModel.insertPararel(nama);
      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan data paralel",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },

  updatePararel: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama } = req.body;
      if (!nama) {
        return res.status(400).json({
          status: 400,
          message: "Nama paralel harus diisi",
        });
      }
      const result = await PararelModel.updatePararel(id, { nama });
      if (!result) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil memperbarui data paralel",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },

  deletePararel: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PararelModel.deletePararel(id);
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil menghapus data paralel",
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },
};

module.exports = PararelController;