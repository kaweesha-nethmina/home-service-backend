const express = require('express');
const router = express.Router();
const authController = require('../auth/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/reset-password', authMiddleware, authController.resetPassword);

module.exports = router;