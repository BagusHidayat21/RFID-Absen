const express = require('express');
const { addSiswa, getSiswaList, getSiswaByIdController } = require('../controllers/siswaController');

const router = express.Router();

// Route untuk tambah siswa
router.post('/siswa', addSiswa);

// Route untuk mengambil semua siswa
router.get('/siswa', getSiswaList);

// Route untuk mengambil siswa berdasarkan ID
router.get('/siswa/:id', getSiswaByIdController);

module.exports = router;
