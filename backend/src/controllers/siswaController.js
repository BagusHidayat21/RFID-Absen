const { insertSiswa, getAllSiswa, getSiswaById , updateSiswa, deleteSiswa } = require('../models/siswaModel');

const addSiswa = async (req, res) => {
  const { nisn, nama, rfid, jurusan, kelas, kelas_paralel } = req.body;
  try {
    const newSiswa = await insertSiswa(nisn, nama, rfid, jurusan, kelas, kelas_paralel);
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

// Update siswa berdasarkan ID
const updateSiswaByID = async (req, res) => {
  const { id } = req.params;
  const { nisn, nama, rfid, jurusan, kelas, kelas_paralel } = req.body;

  try {
    const updated = await updateSiswa(id, nisn, nama, rfid, jurusan, kelas, kelas_paralel);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).send('❌ Siswa tidak ditemukan.');
    }
  } catch (err) {
    res.status(500).send('❌ Gagal mengupdate siswa.');
  }
};

// Hapus siswa berdasarkan ID
const deleteSiswaByID = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteSiswa(id);
    if (deleted) {
      res.json({ message: '✅ Siswa berhasil dihapus.', deleted });
    } else {
      res.status(404).send('❌ Siswa tidak ditemukan.');
    }
  } catch (err) {
    res.status(500).send('❌ Gagal menghapus siswa.');
  }
};


module.exports = { addSiswa, getSiswaList, getSiswaByIdController, updateSiswaByID,deleteSiswaByID };
