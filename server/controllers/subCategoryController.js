const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel')

module.exports = {
    createSubcategory: async (req, res) => {
        try {
            const { name, categoryId } = req.body;

            // Step 1: Create the subcategory
            const subCategory = await SubCategory.create({ name, category: categoryId });

            // Step 2: Find the category and push the new subcategory to its subCategories array
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            category.subCategory.push(subCategory._id);
            await category.save();

            res.status(201).json(subCategory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSubCategorys: (req, res) => {
        SubCategory.find({})
            .then((allSubCategorys) => {
                res.json(allSubCategorys);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getOneSubCategory: (req, res) => {
        console.log('Fetching SubCategory with ID:', req.params.id); // Log the ID
        SubCategory.findById(req.params.id)
            .then((oneSubCategory) => {
                if (oneSubCategory) {
                    res.json(oneSubCategory);
                } else {
                    res.status(404).json({ error: 'SubCategory not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getOneSubCategoryandUpdate: (req, res) => {
        console.log('Updating SubCategory with ID:', req.params.id); // Log the ID
        SubCategory.findOneAndUpdate(
            { _id: req.params.id }, // query object
            req.body, // update object
            { new: true, runValidators: true } // options
        )
            .then((updatedSubCategory) => {
                if (updatedSubCategory) {
                    res.json(updatedSubCategory);
                } else {
                    res.status(404).json({ error: 'SubCategory not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getOneSubCategoryandDelete: (req, res) => {
        console.log('Deleting SubCategory with ID:', req.params.id); // Log the ID
        SubCategory.deleteOne({ _id: req.params.id })
            .then((deletedSubCategory) => {
                if (deletedSubCategory.deletedCount > 0) {
                    res.json({ message: 'SubCategory deleted successfully' });
                } else {
                    res.status(404).json({ error: 'SubCategory not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getSubCategoryByName: (req, res) => {
        console.log('Fetching SubCategory with name:', req.params.name); // Log the name
        SubCategory.findOne({ name: req.params.name })
            .then((SubCategory) => {
                if (SubCategory) {
                    res.json(SubCategory);
                } else {
                    res.status(404).json({ error: 'SubCategory not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },
    getSubCategoryByName: async (req, res) => {
        try {
            // Use a case-insensitive regex search to find categories by name
            const categories = await SubCategory.find({
                name: new RegExp(req.params.name, 'i'),
            });
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}
