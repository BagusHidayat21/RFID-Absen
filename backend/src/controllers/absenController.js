const AbsenModel = require("../models/absenModel");

const addAbsen = async (req, res) => {
  try {
    const { siswa_id, status } = req.body;
    const data = await AbsenModel.insertAbsen(siswa_id, status);

    res.status(201).json({
      status: 201,
      message: "Berhasil menambahkan data absen",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Gagal menambahkan data absen",
      error: error.message,
    });
  }
};

const getAllAbsen = async (req, res) => {
  try {
    const data = await AbsenModel.getAllAbsen();

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data absen tidak ditemukan untuk siswa ini",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Berhasil menampilkan data absen siswa",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Gagal mengambil data absen",
      error: error.message,
    });
  }
};

const getAbsenById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AbsenModel.getAbsenById(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data absen tidak ditemukan untuk siswa ini",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Berhasil menampilkan data absen siswa",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Gagal mengambil data absen",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAbsen,
  addAbsen,
  getAbsenById,
};