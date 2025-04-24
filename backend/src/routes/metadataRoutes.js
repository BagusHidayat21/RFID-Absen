const express = require('express');
const router = express.Router();
const db = require('../config/db'); // path ke koneksi database

// Ambil data kelas unik dari database
router.get('/kelas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT kelas FROM siswa');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ambil data jurusan (hardcoded)
router.get('/jurusan', (req, res) => {
  const jurusan = [
    "BKP", "DPIB", "TPM", "TLAS", "TSM", "TEI", "TOI", "RPL", "TPTU"
  ];
  res.json(jurusan);
});

// Ambil data paralel unik dari database
router.get('/paralel', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT paralel FROM siswa');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;