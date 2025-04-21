const express = require("express");
const router = express.Router();

const AbsenController = require("../controllers/absenController");

router.get("/absen", AbsenController.getAllAbsen);
router.get("/absen/:id", AbsenController.getAbsenById);
router.post("/absen", AbsenController.addAbsen);

module.exports = router;