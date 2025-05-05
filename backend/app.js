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

// List of all endpoints

// Default route
app.get('/', ...);

// Siswa Routes
app.get('/api/siswa', ...);
app.get('/api/siswa/:id', ...);
app.get('/api/siswa/:jurusan/:kelas', ...);
app.post('/api/siswa', ...);
app.put('/api/siswa/:id', ...);
app.delete('/api/siswa/:id', ...);

// Absen Routes
app.get('/api/absen', ...);
app.get('/api/absen/:id', ...);
app.post('/api/absen', ...);
app.put('/api/absen/:id', ...);
app.delete('/api/absen/:id', ...);

// Admin Routes
app.post('/api/login', ...);
app.post('/api/logout', ...);
app.get('/api/admin', ...);
app.get('/api/admin/:id', ...);
app.post('/api/admin', ...);
app.put('/api/admin/:id', ...);
app.delete('/api/admin/:id', ...);

// Kelas Routes
app.get('/api/kelas', ...);
app.get('/api/kelas/:id', ...);
app.post('/api/kelas', ...);
app.put('/api/kelas/:id', ...);
app.delete('/api/kelas/:id', ...);

// Pararel Routes
app.get('/api/pararel', ...);
app.get('/api/pararel/:id', ...);
app.post('/api/pararel', ...);
app.put('/api/pararel/:id', ...);
app.delete('/api/pararel/:id', ...);

// Jurusan Routes
app.get('/api/jurusan', ...);
app.get('/api/jurusan/:id', ...);
app.post('/api/jurusan', ...);
app.put('/api/jurusan/:id', ...);
app.delete('/api/jurusan/:id', ...);

// RFID UID Routes
app.post('/api/rfid', ...);
app.get('/api/latest-uid', ...);

