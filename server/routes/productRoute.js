const { createProduct, getProducts, getOneProduct, getOneProductandDelete, getProductsSpecificCategory, updateProduct, searchProducts, getProductsBySubcategory } = require('../controllers/productController');
const express = require('express');
const router = express.Router();
const { upload } = require('../utils/storage');
const { admin, protect } = require('../middleware/AdminMiddleware');

// Define the routes and attach corresponding controller methods
// router.post('/create', createProduct);
router.post('/create', upload.array('avatars', 10), protect, admin, createProduct);
router.put('/:id', upload.array('avatars', 10), protect, admin, updateProduct);

router.get('/', getProducts);
router.get('/search', searchProducts);

router.get('/:id', getOneProduct);
router.delete('/:id', protect, admin, getOneProductandDelete);
router.get('/category/:id', getProductsSpecificCategory); 
router.get('/subcategory/:id', getProductsBySubcategory);
module.exports = router;
