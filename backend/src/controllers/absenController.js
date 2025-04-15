const { insertAbsen, getAbsenBySiswaId } = require('../models/absenModel');

const addAbsen = async (req, res) => {
  const { siswa_id, status } = req.body;
  try {
    const newAbsen = await insertAbsen(siswa_id, status);
    res.status(201).json(newAbsen);
  } catch (err) {
    res.status(500).send('Gagal menambahkan absen');
  }
};

const getAbsenBySiswaIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const absen = await getAbsenBySiswaId(id);
    if (absen.length > 0) {
      res.status(200).json(absen);
    } else {
      res.status(404).send('Data absen tidak ditemukan');
    }
  } catch (err) {
    res.status(500).send('Gagal mengambil data absen');
  }
};

module.exports = { addAbsen, getAbsenBySiswaIdController };
