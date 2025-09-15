const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Get all bookings for the authenticated provider
exports.getProviderBookings = async (req, res) => {
    try {
        // Verify that the user is a provider
        const provider = await User.findById(req.user.userId);
        if (!provider || provider.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Providers only.' });
        }
        
        const bookings = await Booking.find({ provider: req.user.userId })
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .sort({ createdAt: -1 });
            
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get specific booking details for provider
exports.getProviderBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verify that the user is a provider
        const provider = await User.findById(req.user.userId);
        if (!provider || provider.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Providers only.' });
        }
        
        const booking = await Booking.findById(id)
            .populate('customer', 'name email')
            .populate('service', 'name description price')
            .populate('provider', 'name email');
            
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if booking belongs to this provider
        if (booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update booking status (by provider)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Verify that the user is a provider
        const provider = await User.findById(req.user.userId);
        if (!provider || provider.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Providers only.' });
        }
        
        // Validate status
        const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if booking belongs to this provider
        if (booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Update booking status
        booking.status = status;
        booking.updatedAt = Date.now();
        await booking.save();
        
        // Populate booking with related data
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .populate('provider', 'name email');
        
        res.json({
            message: 'Booking status updated successfully',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a booking (by provider)
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verify that the user is a provider
        const provider = await User.findById(req.user.userId);
        if (!provider || provider.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Providers only.' });
        }
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if booking belongs to this provider
        if (booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Delete the booking
        await Booking.findByIdAndDelete(id);
        
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};