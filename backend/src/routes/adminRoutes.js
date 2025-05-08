const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);
router.post("/token-refresh", AdminController.refreshAccessToken);
router.get("/admin",  AdminController.getAllAdmin);
router.get("/admin/:id",  AdminController.getAdminById);
router.post("/admin",  AdminController.insertAdmin);
router.put("/admin/:id",  AdminController.updateAdmin);
router.delete("/admin/:id",  AdminController.deleteAdmin);

module.exports = router;