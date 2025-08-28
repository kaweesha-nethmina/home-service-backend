const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- Add this line

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(cors()); // <-- Add this line before other route handlers
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/provider/bookings', require('./routes/providerBookingRoutes'));
// Admin routes
app.use('/api/admin', require('./routes/adminRoutes'));
// Serve uploaded files
app.use('/uploads', express.static('uploads'));
// Upload routes (used by providers)
app.use('/api/providers/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});