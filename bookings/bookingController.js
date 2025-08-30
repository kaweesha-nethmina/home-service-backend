const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const Payment = require('../models/Payment');

exports.createBooking = async (req, res) => {
    try {
        // Only customers can create bookings
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Access denied. Customers only.' });
        }
        
        const { serviceId, date, address, notes, customerName, customerPhone } = req.body;
        
        // Check if service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        // Check if service is available
        if (!service.availability) {
            return res.status(400).json({ message: 'Service is not available' });
        }
        
        // Create booking with customer name and phone
        const booking = new Booking({
            customer: req.user.userId,
            service: serviceId,
            provider: service.provider,
            date,
            totalPrice: service.price,
            address,
            notes,
            customerName,
            customerPhone
        });
        
        await booking.save();
        
        // Populate booking with related data
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .populate('provider', 'name email');
        
        res.status(201).json({
            message: 'Booking created successfully',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        let filter = {};
        
        // Filter by user role
        if (req.user.role === 'customer') {
            filter.customer = req.user.userId;
        } else if (req.user.role === 'provider') {
            filter.provider = req.user.userId;
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        const bookings = await Booking.find(filter)
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .populate('provider', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findById(id)
            .populate('customer', 'name email')
            .populate('service', 'name description price')
            .populate('provider', 'name email');
            
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if user has access to this booking
        if (req.user.role !== 'admin' && 
            booking.customer.toString() !== req.user.userId && 
            booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if user has permission to update status
        if (req.user.role !== 'admin' && 
            booking.provider.toString() !== req.user.userId) {
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

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if user has permission to cancel booking
        if (req.user.role !== 'admin' && 
            booking.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Update booking status to cancelled
        booking.status = 'cancelled';
        booking.updatedAt = Date.now();
        await booking.save();
        
        // Populate booking with related data
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .populate('provider', 'name email');
        
        res.json({
            message: 'Booking cancelled successfully',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.makePayment = async (req, res) => {
    try {
        const { bookingId, paymentMethod, transactionId } = req.body;
        
        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check if user has permission to make payment
        if (booking.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Check if booking is already completed or cancelled
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot make payment for this booking' });
        }
        
        // Create payment
        const payment = new Payment({
            booking: bookingId,
            customer: req.user.userId,
            amount: booking.totalPrice,
            paymentMethod,
            transactionId
        });
        
        await payment.save();
        
        // Update booking status to accepted
        booking.status = 'accepted';
        booking.updatedAt = Date.now();
        await booking.save();
        
        // Populate payment with related data
        const populatedPayment = await Payment.findById(payment._id)
            .populate('booking')
            .populate('customer', 'name email');
        
        res.status(201).json({
            message: 'Payment successful',
            payment: populatedPayment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const payment = await Payment.findById(id)
            .populate('booking')
            .populate('customer', 'name email');
            
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        // Check if user has access to this payment
        if (req.user.role !== 'admin' && 
            payment.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};