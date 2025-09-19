const express = require('express');
const router = express.Router();
const providerBookingController = require('../services/providerBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Provider booking routes
router.get('/', authMiddleware, providerBookingController.getProviderBookings);
router.get('/:id', authMiddleware, providerBookingController.getProviderBookingDetails);
router.put('/:id/status', authMiddleware, providerBookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, providerBookingController.deleteBooking);

module.exports = router;