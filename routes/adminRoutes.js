const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Admin routes - protected by authentication middleware
router.get('/users', auth, adminController.getAllUsers);
router.get('/services', auth, adminController.getAllServices);
router.get('/categories', auth, adminController.getAllCategories);
router.get('/bookings', auth, adminController.getAllBookings);
router.put('/bookings/:id/status', auth, adminController.updateBookingStatus);

// Feedback routes
router.get('/feedbacks', auth, adminController.getAllFeedbacks);
router.get('/feedbacks/:id', auth, adminController.getFeedbackById);
router.put('/feedbacks/:id', auth, adminController.updateFeedback);
router.delete('/feedbacks/:id', auth, adminController.deleteFeedback);

module.exports = router;