require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./src/middleware/authMiddleware');

const siswaRoutes = require('./src/routes/siswaRoutes');
const absenRoutes = require('./src/routes/absenRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const kelasRoutes = require('./src/routes/kelasRoutes');
const pararelRoutes = require('./src/routes/pararelRoutes');
const jurusanRoutes = require('./src/routes/jurusanRoutes');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('🚀 API berjalan dengan baik!');
});

// Routing
app.use((req, res, next) => {
  const excludedRoutes = ['/api/login', '/api/logout', '/api/absen', '/api/absen/:id'];
  if (excludedRoutes.includes(req.path)) {
    return next();
  }
  authMiddleware(req, res, next);
});

app.use('/api', siswaRoutes);
app.use('/api', absenRoutes);
app.use('/api', adminRoutes);
app.use('/api', kelasRoutes);
app.use('/api', pararelRoutes);
app.use('/api', jurusanRoutes);

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
  console.log(`Server berjalan di http://0.0.0.0:${port}`);
  console.log('Database Berhasil Terhubung');
});
