const express = require("express");
const router = express.Router();

const JurusanController = require("../controllers/jurusanController");

router.get("/jurusan", JurusanController.getAllJurusan);
router.get("/jurusan/:id", JurusanController.getJurusanById);
router.post("/jurusan", JurusanController.createJurusan);
router.put("/jurusan/:id", JurusanController.updateJurusan);
router.delete("/jurusan/:id", JurusanController.deleteJurusan);

module.exports = router;
