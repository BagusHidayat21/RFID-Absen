const SiswaModel = require("../models/siswaModel");

const SiswaController = {
  getAllSiswa: async (req, res) => {
    try {
      const result = await SiswaModel.getAllSiswa();
      if (!result || result.length === 0) {
        return res.status(404).json({
          "status": 404,
          "message": "Data siswa tidak ditemukan",
        });
      }
      res.status(200).json({
        "status": 200,
        "message": "Berhasil menampilkan semua data siswa",
        "data": result,
      });
    } catch (error) {
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },

  getSiswaById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await SiswaModel.getSiswaById(id);
      if (!result) {
        return res.status(404).json({
          "status": 404,
          "message": "Data siswa tidak ditemukan",
        });
      }
      res.status(200).json({
        "status": 200,
        "message": "Berhasil menampilkan data siswa",
        "data": result,
      });
    } catch (error) {
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },

  getAllSiswabyKelas: async (req, res) => {
    try {
      const { jurusan, kelas } = req.params;
      const result = await SiswaModel.getAllSiswabyKelas(jurusan, kelas);
      if (!result || result.length === 0) {
        return res.status(404).json({
          "status": 404,
          "message": "Data siswa tidak ditemukan",
        });
      }
      res.status(200).json({
        "status": 200,
        "message": "Berhasil menampilkan semua data siswa",
        "data": result,
      });
    } catch (error) {
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },

  createSiswa: async (req, res) => {
    try {
      const { nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id } = req.body;
      const result = await SiswaModel.createSiswa({
        nama,
        nis,
        rfid_uid,
        kelas_id,
        jurusan_id,
        pararel_id,
      });
      res.status(201).json({
        "status": 201,
        "message": "Berhasil menambahkan data siswa",
        "data": result,
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          "status": 409,
          "message": "NISN atau RFID sudah terdaftar",
        });
      }
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },

  updateSiswa: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id } = req.body;
      const result = await SiswaModel.updateSiswa(id, {
        nama,
        nis,
        rfid_uid,
        kelas_id,
        jurusan_id,
        pararel_id,
      });
      if (!result) {
        return res.status(404).json({
          "status": 404,
          "message": "Data siswa tidak ditemukan",
        });
      }
      res.status(200).json({
        "status": 200,
        "message": "Berhasil mengubah data siswa",
        "data": result,
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          "status": 409,
          "message": "NISN atau RFID sudah terdaftar",
        });
      }
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },

  deleteSiswa: async (req, res) => {
    try {
      const { id } = req.params;
      const check = await SiswaModel.getSiswaById(id);
      if (!check) {
        return res.status(404).json({
          "status": 404,
          "message": "Data siswa tidak ditemukan",
        });
      }
      await SiswaModel.deleteSiswa(id);
      res.status(200).json({
        "status": 200,
        "message": "Berhasil menghapus data siswa",
      });
    } catch (error) {
      res.status(500).json({
        "status": 500,
        "error": error.message,
      });
    }
  },
};

module.exports = SiswaController;