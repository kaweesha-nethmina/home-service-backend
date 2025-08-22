const express = require('express');
const router = express.Router();
const feedbackController = require('../support/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Customer routes
router.post('/', authMiddleware, feedbackController.submitFeedback);
router.get('/customer', authMiddleware, feedbackController.getCustomerFeedback);
router.put('/:id', authMiddleware, feedbackController.updateFeedback);
router.delete('/:id', authMiddleware, feedbackController.deleteFeedback);

// Provider routes
router.get('/provider', authMiddleware, feedbackController.getProviderFeedbacks);

// Public routes
router.get('/provider/:providerId', feedbackController.getPublicFeedbacks);
router.get('/service/:serviceId', feedbackController.getFeedbacksByService);

module.exports = router;