const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, saveOnboardingInfo } = require("../controllers/auth-controller");


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/onboarding", saveOnboardingInfo);

module.exports = router;
