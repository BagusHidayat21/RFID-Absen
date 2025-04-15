const fs = require('fs');
const path = require('path');

const directories = [
  'src/config',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middleware',
  'src/utils',
];

// Membuat direktori yang dibutuhkan
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Folder dibuat: ${dirPath}`);
  }
});

// Membuat file yang dibutuhkan
const files = [
  '.env'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`File dibuat: ${filePath}`);
  }
});

console.log('Struktur folder dan file berhasil dibuat!');
