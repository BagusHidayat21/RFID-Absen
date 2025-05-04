const express = require('express');
const router = express.Router();

const KelasController = require('../controllers/kelasController');

router.get('/kelas', KelasController.getAllKelas);
router.get('/kelas/:id', KelasController.getKelasById);
router.post('/kelas', KelasController.createKelas);
router.put('/kelas/:id', KelasController.updateKelas);
router.delete('/kelas/:id', KelasController.deleteKelas);

module.exports = router;
