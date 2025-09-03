const express = require('express');
const router = express.Router();
const bookingController = require('../bookings/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getAllBookings);
router.get('/:id', authMiddleware, bookingController.getBookingDetails);
router.put('/:id/status', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;