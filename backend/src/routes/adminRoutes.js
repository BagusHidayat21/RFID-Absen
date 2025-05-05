const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);
router.get("/admin", authMiddleware, AdminController.getAllAdmin);
router.get("/admin/:id", authMiddleware, AdminController.getAdminById);
router.post("/admin", authMiddleware, AdminController.insertAdmin);
router.put("/admin/:id", authMiddleware, AdminController.updateAdmin);
router.delete("/admin/:id", authMiddleware, AdminController.deleteAdmin);

module.exports = router;