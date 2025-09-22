const express = require('express');
const router = express.Router();
const { saveOnboardingInfo } = require('../controllers/auth-controller');

router.post('/', saveOnboardingInfo);

module.exports = router;
