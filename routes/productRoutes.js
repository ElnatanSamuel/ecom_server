const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/category/:category', productController.getProductsByCategory);

module.exports = router; 