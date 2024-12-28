const { getSubCategorys, getOneSubCategory, getOneSubCategoryandDelete, getSubCategoryByName, getOneSubCategoryandUpdate, createSubcategory } = require('../controllers/subCategoryController')
const express = require('express');
const { protect, admin } = require('../middleware/AdminMiddleware');
const router = express.Router();

router.get('/', getSubCategorys);
router.get('/name/:name', getSubCategoryByName);
router.get('/:id', getOneSubCategory);
router.post('/', protect, admin, createSubcategory);
router.put('/:id', getOneSubCategoryandUpdate);
router.delete('/:id', protect, admin, getOneSubCategoryandDelete);

module.exports = router;