const express = require("express");
const router = express.Router();
const SiswaController = require("../controllers/siswaController");

router.get("/siswa", SiswaController.getAllSiswa);
router.get("/siswa/:id", SiswaController.getSiswaById);
router.get("/siswa/:jurusan/:kelas", SiswaController.getAllSiswabyKelas);
router.post("/siswa", SiswaController.createSiswa);
router.put("/siswa/:id", SiswaController.updateSiswa);
router.delete("/siswa/:id", SiswaController.deleteSiswa);

module.exports = router;