const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');

module.exports = {
    addSubCategoryToCategory: async (req, res) => {
        try {
            const { categoryId, subCategoryName } = req.body;
            const category = await Category.findById(categoryId);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            const newSubCategory = await SubCategory.create({ name: subCategoryName, category: categoryId });
            category.subCategory.push(newSubCategory._id);
            await category.save();

            res.json({ message: 'Subcategory added successfully', category });
        } catch (err) {
            res.status(500).json({ message: 'Error adding subcategory', err });
        }
    },

    // Remove Subcategory from Category
    removeSubCategoryFromCategory: async (req, res) => {
        try {
            const { categoryId, subCategoryId } = req.body;
            const category = await Category.findById(categoryId);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            category.subCategory = category.subCategory.filter(subCatId => subCatId.toString() !== subCategoryId);
            await category.save();

            res.json({ message: 'Subcategory removed successfully', category });
        } catch (err) {
            res.status(500).json({ message: 'Error removing subcategory', err });
        }
    },

    createCategory: (req, res) => {
        console.log('create Category triggered');
        Category.create(req.body)
            .then((newCategory) => {
                console.log('request body:', req.body);
                res.json(newCategory);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getCategorys: async(req, res) => {
        try {
            const categories = await Category.find().populate('subCategory');
            res.json(categories);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching categories with subcategories', err });
        }
    },
    getOneCategory: (req, res) => {
        console.log('Fetching category with ID:', req.params.id); // Log the ID
        Category.findById(req.params.id)
            .then((oneCategory) => {
                if (oneCategory) {
                    res.json(oneCategory);
                } else {
                    res.status(404).json({ error: 'Category not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getOneCategoryandUpdate: (req, res) => {
        console.log('Updating category with ID:', req.params.id); // Log the ID
        Category.findOneAndUpdate(
            { _id: req.params.id }, // query object
            req.body, // update object
            { new: true, runValidators: true } // options
        )
            .then((updatedCategory) => {
                if (updatedCategory) {
                    res.json(updatedCategory);
                } else {
                    res.status(404).json({ error: 'Category not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getOneCategoryandDelete: (req, res) => {
        console.log('Deleting category with ID:', req.params.id); // Log the ID
        Category.deleteOne({ _id: req.params.id })
            .then((deletedCategory) => {
                if (deletedCategory.deletedCount > 0) {
                    res.json({ message: 'Category deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Category not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getCategoryByName: (req, res) => {
        console.log('Fetching category with name:', req.params.name); // Log the name
        Category.findOne({ name: req.params.name })
            .then((category) => {
                if (category) {
                    res.json(category);
                } else {
                    res.status(404).json({ error: 'Category not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getCategoryByName: async (req, res) => {
        try {
            // Use a case-insensitive regex search to find categories by name
            const categories = await Category.find({
                name: new RegExp(req.params.name, 'i'),
            });
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}
