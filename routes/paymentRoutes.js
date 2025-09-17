const express = require('express');
const router = express.Router();
const bookingController = require('../bookings/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingController.makePayment);
router.get('/:id', authMiddleware, bookingController.getPaymentDetails);

module.exports = router;