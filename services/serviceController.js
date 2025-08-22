const Service = require('../models/Service');
const Category = require('../models/Category');

exports.createService = async (req, res) => {
    try {
        // Only providers can create services
        if (req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Providers only.' });
        }
        
        const { name, description, category, price, location, images } = req.body;
        
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Create service
        const service = new Service({
            name,
            description,
            category,
            provider: req.user.userId,
            price,
            location: location || 'Colombo', // Use provided location or default to 'Colombo'
            images: images || [] // Use provided images or default to empty array
        });
        
        await service.save();
        
        res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const { category, location, search } = req.query;
        let filter = {};
        
        // Apply filters if provided
        if (category) filter.category = category;
        if (location) filter.location = new RegExp(location, 'i');
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }
        
        const services = await Service.find(filter)
            .populate('category', 'name')
            .populate('provider', 'name')
            .sort({ createdAt: -1 });
            
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getServiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const service = await Service.findById(id)
            .populate('category', 'name description')
            .populate('provider', 'name email');
            
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, location, availability, images } = req.body;
        
        // Check if service exists and belongs to provider
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        if (service.provider.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Check if category exists (if provided)
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }
        
        const updates = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (category) updates.category = category;
        if (price) updates.price = price;
        if (location !== undefined) updates.location = location;
        if (availability !== undefined) updates.availability = availability;
        if (images !== undefined) updates.images = images;
        updates.updatedAt = Date.now();
        
        const updatedService = await Service.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
        .populate('category', 'name')
        .populate('provider', 'name');
        
        res.json({
            message: 'Service updated successfully',
            service: updatedService
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if service exists and belongs to provider
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        if (service.provider.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        await Service.findByIdAndDelete(id);
        
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};