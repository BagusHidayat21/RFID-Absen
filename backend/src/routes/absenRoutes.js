const express = require('express');
const { addAbsen, getAbsenBySiswaIdController } = require('../controllers/absenController');

const router = express.Router();

// Route untuk tambah absen
router.post('/absen', addAbsen);

// Route untuk mengambil absen berdasarkan siswa ID
router.get('/absen/:id', getAbsenBySiswaIdController);

module.exports = router;
