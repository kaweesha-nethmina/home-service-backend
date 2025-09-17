const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Customer submits feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { providerId, serviceId, bookingId, rating, title, comment, isPublic } = req.body;
        
        // Check if provider exists and is actually a provider
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== 'provider') {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        // Check if service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        // Check if booking exists (if provided)
        if (bookingId) {
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
        }
        
        // Check if customer has already submitted feedback for this provider and service
        const existingFeedback = await Feedback.findOne({
            customer: req.user.userId,
            provider: providerId,
            service: serviceId
        });
        
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already submitted feedback for this provider and service' });
        }
        
        // Create feedback
        const feedback = new Feedback({
            customer: req.user.userId,
            provider: providerId,
            service: serviceId,
            ...(bookingId && { booking: bookingId }),
            rating,
            title,
            comment,
            isPublic: isPublic !== undefined ? isPublic : true
        });
        
        await feedback.save();
        
        // Populate feedback with related data
        const populatedFeedback = await Feedback.findById(feedback._id)
            .populate('customer', 'name email')
            .populate('provider', 'name email')
            .populate('service', 'name')
            .populate('booking', 'service date');
        
        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: populatedFeedback
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Customer views their own feedback
exports.getCustomerFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ customer: req.user.userId })
            .populate('provider', 'name email')
            .populate('service', 'name')
            .populate('booking', 'service date')
            .sort({ createdAt: -1 });
            
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Customer updates their feedback
exports.updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment, isPublic } = req.body;
        
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        
        // Check if the feedback belongs to the current user
        if (feedback.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Update feedback
        const updates = {};
        if (rating !== undefined) updates.rating = rating;
        if (title) updates.title = title;
        if (comment) updates.comment = comment;
        if (isPublic !== undefined) updates.isPublic = isPublic;
        updates.updatedAt = Date.now();
        
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
        .populate('customer', 'name email')
        .populate('provider', 'name email')
        .populate('service', 'name')
        .populate('booking', 'service date');
        
        res.json({
            message: 'Feedback updated successfully',
            feedback: updatedFeedback
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Customer deletes their feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        
        // Check if the feedback belongs to the current user
        if (feedback.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        await Feedback.findByIdAndDelete(id);
        
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Service provider views feedbacks
exports.getProviderFeedbacks = async (req, res) => {
    try {
        // Check if the current user is a provider
        const provider = await User.findById(req.user.userId);
        if (!provider || provider.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Only providers can view feedbacks.' });
        }
        
        const feedbacks = await Feedback.find({ provider: req.user.userId })
            .populate('customer', 'name email')
            .populate('service', 'name')
            .populate('booking', 'service date')
            .sort({ createdAt: -1 });
            
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get public feedbacks for a provider (for customers to see)
exports.getPublicFeedbacks = async (req, res) => {
    try {
        const { providerId } = req.params;
        
        // Check if provider exists
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== 'provider') {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        const feedbacks = await Feedback.find({ 
            provider: providerId,
            isPublic: true,
            status: 'approved'
        })
        .populate('customer', 'name')
        .populate('service', 'name')
        .sort({ createdAt: -1 });
            
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get feedbacks for a specific service
exports.getFeedbacksByService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        
        // Check if service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        const feedbacks = await Feedback.find({ 
            service: serviceId,
            isPublic: true
            // Removed status filter to show all public feedback regardless of status
        })
        .populate('customer', 'name')
        .populate('provider', 'name')
        .populate('service', 'name')
        .sort({ createdAt: -1 });
            
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};