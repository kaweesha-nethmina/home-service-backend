const express = require('express');
const router = express.Router();
const serviceController = require('../services/serviceController');
const categoryController = require('../services/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Category routes
router.post('/categories', authMiddleware, categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById); // compatibility route
router.put('/categories/:id', authMiddleware, categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

// Service routes
router.post('/', authMiddleware, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceDetails);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;