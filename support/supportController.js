const Complaint = require('../models/Complaint');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Service = require('../models/Service');

exports.raiseComplaint = async (req, res) => {
    try {
        const { subject, description, priority } = req.body;
        
        // Create complaint
        const complaint = new Complaint({
            user: req.user.userId,
            subject,
            description,
            priority: priority || 'medium'
        });
        
        await complaint.save();
        
        // Populate complaint with user data
        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate('user', 'name email');
        
        res.status(201).json({
            message: 'Complaint raised successfully',
            complaint: populatedComplaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        let filter = {};
        
        // Filter by user role
        if (req.user.role === 'customer') {
            // Customers see only their own complaints
            filter.user = req.user.userId;
        } else if (req.user.role === 'provider') {
            // Providers see all complaints (no filter)
            // Could optionally filter by assignedTo for complaints assigned to this provider
            // filter.$or = [{ assignedTo: req.user.userId }, { assignedTo: { $exists: false } }];
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        const complaints = await Complaint.find(filter)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo } = req.body;
        
        // Validate status
        const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        // Check if user has permission to update complaint
        const isComplaintOwner = complaint.user.toString() === req.user.userId;
        const isAssignedProvider = complaint.assignedTo && complaint.assignedTo.toString() === req.user.userId;
        const isProvider = req.user.role === 'provider';
        
        if (req.user.role !== 'admin' && 
            !isComplaintOwner && 
            !isAssignedProvider &&
            !isProvider) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        const updates = {};
        if (status) updates.status = status;
        if (assignedTo) updates.assignedTo = assignedTo;
        updates.updatedAt = Date.now();
        
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
        .populate('user', 'name email')
        .populate('assignedTo', 'name email');
        
        res.json({
            message: 'Complaint updated successfully',
            complaint: updatedComplaint
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { providerId, serviceId, rating, feedback } = req.body;
        
        // Check if provider exists
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== 'provider') {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        // Check if service exists (if provided)
        if (serviceId) {
            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
        }
        
        // Check if user has already rated this provider for this service
        const existingRating = await Rating.findOne({
            user: req.user.userId,
            provider: providerId,
            ...(serviceId && { service: serviceId })
        });
        
        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this provider for this service' });
        }
        
        // Create rating
        const newRating = new Rating({
            user: req.user.userId,
            provider: providerId,
            ...(serviceId && { service: serviceId }),
            rating,
            feedback
        });
        
        await newRating.save();
        
        // Populate rating with related data
        const populatedRating = await Rating.findById(newRating._id)
            .populate('user', 'name')
            .populate('provider', 'name')
            .populate('service', 'name');
        
        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: populatedRating
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProviderRatings = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if provider exists
        const provider = await User.findById(id);
        if (!provider || provider.role !== 'provider') {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        const ratings = await Rating.find({ provider: id })
            .populate('user', 'name')
            .populate('service', 'name')
            .sort({ createdAt: -1 });
            
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
            
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createUserNotification = async (req, res) => {
    try {
        const { userId, title, message, type, relatedBooking, relatedComplaint } = req.body;
        
        // Only admins can create notifications for other users
        if (userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can create notifications for other users.' });
        }
        
        // Create notification
        const notification = new Notification({
            user: userId || req.user.userId,
            title,
            message,
            type: type || 'info',
            ...(relatedBooking && { relatedBooking }),
            ...(relatedComplaint && { relatedComplaint })
        });
        
        await notification.save();
        
        // Populate notification with related data
        const populatedNotification = await Notification.findById(notification._id)
            .populate('user', 'name email')
            .populate('relatedBooking')
            .populate('relatedComplaint');
        
        res.status(201).json({
            message: 'Notification created successfully',
            notification: populatedNotification
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        // Check if user has permission to mark this notification
        if (notification.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        notification.isRead = true;
        notification.updatedAt = Date.now();
        await notification.save();
        
        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};