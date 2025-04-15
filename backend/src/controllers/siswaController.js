const { insertSiswa, getAllSiswa, getSiswaById } = require('../models/siswaModel');

const addSiswa = async (req, res) => {
  const { nisn, nama, rfid, jurusan, kelas, kelasParalel } = req.body;
  try {
    const newSiswa = await insertSiswa(nisn, nama, rfid, jurusan, kelas, kelasParalel);
    res.status(201).json(newSiswa);
  } catch (err) {
    res.status(500).send('Gagal menambahkan siswa');
  }
};

const getSiswaList = async (req, res) => {
  try {
    const siswa = await getAllSiswa();
    res.status(200).json(siswa);
  } catch (err) {
    res.status(500).send('Gagal mengambil data siswa');
  }
};

const getSiswaByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const siswa = await getSiswaById(id);
    if (siswa) {
      res.status(200).json(siswa);
    } else {
      res.status(404).send('Siswa tidak ditemukan');
    }
  } catch (err) {
    res.status(500).send('Gagal mengambil data siswa');
  }
};

module.exports = { addSiswa, getSiswaList, getSiswaByIdController };
