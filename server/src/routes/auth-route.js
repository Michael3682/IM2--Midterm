const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getProfile, changePassword } = require("../controllers/auth-controller");
// Change password route
router.post("/change-password", changePassword);

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile routes
router.get("/profile", getProfile);

module.exports = router;
