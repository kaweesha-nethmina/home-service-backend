const express = require('express');
const router = express.Router();
const supportController = require('../support/supportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/complaints', authMiddleware, supportController.raiseComplaint);
router.get('/complaints', authMiddleware, supportController.getComplaints);
router.put('/complaints/:id', authMiddleware, supportController.updateComplaintStatus);
router.post('/ratings', authMiddleware, supportController.submitRating);
router.get('/ratings/provider/:id', authMiddleware, supportController.getProviderRatings);
router.post('/notifications', authMiddleware, supportController.createUserNotification);
router.get('/notifications', authMiddleware, supportController.getUserNotifications);
router.put('/notifications/:id/read', authMiddleware, supportController.markNotificationAsRead);

module.exports = router;