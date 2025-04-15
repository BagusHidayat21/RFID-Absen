require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./src/config/db');
const siswaRoutes = require('./src/routes/siswaRoutes');
const absenRoutes = require('./src/routes/absenRoutes');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use('/api', siswaRoutes);
app.use('/api', absenRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 API berjalan dengan baik!');
});

// Start server
app.listen(port, async () => {
  await setupDatabase();
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
