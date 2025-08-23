const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const { name, description } = req.body;
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        
        // Create category
        const category = new Category({
            name,
            description
        });
        
        await category.save();
        
        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const { id } = req.params;
        const { name, description } = req.body;
        
        const updates = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        updates.updatedAt = Date.now();
        
        const category = await Category.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const { id } = req.params;
        
        const category = await Category.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};