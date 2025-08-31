const express = require('express');
const router = express.Router();
const providerController = require('../services/providerController');
const authMiddleware = require('../middleware/authMiddleware');

// Provider profile
router.get('/profile', authMiddleware, providerController.getProviderProfile); // current provider
router.get('/:id/profile', providerController.getProviderProfile); // public profile by id
router.put('/profile', authMiddleware, providerController.updateProviderProfile);

// Works (portfolio)
router.post('/works', authMiddleware, providerController.addWork);
router.get('/:id/works', providerController.getProviderWorks); // public
router.get('/works', authMiddleware, providerController.getProviderWorks); // own works
router.put('/works/:id', authMiddleware, providerController.updateWork);
router.delete('/works/:id', authMiddleware, providerController.deleteWork);

module.exports = router;
