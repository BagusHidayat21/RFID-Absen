require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./src/config/db');
const siswaRoutes = require('./src/routes/siswaRoutes');
const absenRoutes = require('./src/routes/absenRoutes');
const metadataRoutes = require('./src/routes/metadataRoutes'); // ✅ Tambahan baru

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use('/api', siswaRoutes);
app.use('/api', absenRoutes);
app.use('/api/metadata', metadataRoutes); // ✅ Tambahkan route metadata

// Default route
app.get('/', (req, res) => {
  res.send('🚀 API berjalan dengan baik!');
});

// Temporary storage for RFID UID
let latestUID = '';

// Endpoint untuk menerima UID dari ESP8266
app.post('/api/rfid', (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ success: false, message: 'UID tidak ditemukan' });
  }

  // Simpan UID terbaru (sambil proses kirim ke frontend)
  latestUID = uid;

  // Kirim respons ke ESP8266
  return res.status(200).json({ success: true, message: 'UID diterima' });
});

// Endpoint untuk mengirim UID terbaru ke frontend
app.get('/api/latest-uid', (req, res) => {
  res.json({ uid: latestUID });
});

// Start server
app.listen(port, async () => {
  await setupDatabase();
  console.log(`✅ Server berjalan di http://0.0.0.0:${port}`);
});