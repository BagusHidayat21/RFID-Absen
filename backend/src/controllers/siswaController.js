const SiswaModel = require("../models/siswaModel");

const getAllSiswa = async (req, res) => {
    try {
        const data = await SiswaModel.getAllSiswa();
        if (data.length === 0) {
            return res.status(404).json({ status: 404, message: "Data siswa kosong" });
        }
        res.status(200).json({ status: 200, message: "Data siswa ditemukan", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSiswaById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await SiswaModel.getSiswaById(id);
        if (!data) {
            return res.status(404).json({ status: 404, message: "Data siswa tidak ditemukan" });
        }
        res.status(200).json({ status: 200, message: "Data siswa ditemukan", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSiswa = async (req, res) => {
    try {
        const { nisn, nama, rfid, jurusan, kelas, kelas_paralel } = req.body;
        const data = await SiswaModel.createSiswa({ nisn, nama, rfid, jurusan, kelas, kelas_paralel });
        res.status(201).json({ status: 201, message: "Siswa berhasil ditambahkan", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nisn, nama, rfid, jurusan, kelas, kelas_paralel } = req.body;
        const data = await SiswaModel.updateSiswa(id, { nisn, nama, rfid, jurusan, kelas, kelas_paralel });
        if (!data) {
            return res.status(404).json({ status: 404, message: "Data siswa tidak ditemukan" });
        }
        res.status(200).json({ status: 200, message: "Siswa berhasil diubah", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const check = await SiswaModel.getSiswaById(id);
        if (!check) {
            return res.status(404).json({ status: 404, message: "Data siswa tidak ditemukan" });
        }
        await SiswaModel.deleteSiswa(id);
        res.status(200).json({ status: 200, message: "Siswa berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSiswa,
    getSiswaById,
    createSiswa,
    updateSiswa,
    deleteSiswa
};
