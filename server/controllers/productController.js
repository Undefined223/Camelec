const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');

module.exports = {
    createProduct: async (req, res) => {
        console.log('Request Body:', req.body);
        console.log(req.files);
        try {
            const { name, price, category, sizes, brand, availability, description, subCategory } = req.body;
            const avatars = req.files.map(file => file.path);
            const colors = req.body.colors; // This will be an array if there are multiple colors

            if (avatars.length === 0) {
                return res.status(400).json({ error: 'No valid avatars uploaded' });
            }

            const newProduct = await Product.create({
                name,
                price,
                category,
                brand,
                avatars,
                availability,
                subCategory,
                description,
                colors: Array.isArray(colors) ? colors : [colors], // Ensure colors is always an array
                sizes: Array.isArray(sizes) ? sizes : [sizes],
            });

            res.json(newProduct);
        } catch (err) {
            console.error('Failed to create product:', err);
            res.status(500).json({ error: 'Failed to create product' });
        }
    },

    getProducts: (req, res) => {
        Product.find({})
            .then((allProducts) => {
                res.json(allProducts);
            })
            .catch((err) => console.log(err));
    },

    getOneProduct: (req, res) => {
        Product.findById(req.params.id)
            .populate('subCategory') // Populate the subCategory field
            .then((oneProduct) => {
                res.json(oneProduct);
            })
            .catch((err) => console.log(err));
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const { name, price, category, brand, availability, description, colors = [], sizes = [], existingAvatars = '[]' } = req.body;
            const newAvatars = req.files ? req.files.map(file => file.path) : [];
    
            // Log the received data for debugging
            console.log('Received data for update:', {
                name, price, category, brand, availability, description, colors, sizes, existingAvatars, newAvatars
            });
    
            // Safely parse existingAvatars
            let parsedExistingAvatars = [];
            try {
                parsedExistingAvatars = JSON.parse(existingAvatars);
                if (!Array.isArray(parsedExistingAvatars)) {
                    throw new Error("existingAvatars is not an array");
                }
            } catch (parseError) {
                console.warn("Invalid JSON for existingAvatars, defaulting to an empty array:", parseError);
                parsedExistingAvatars = [];
            }
    
            // Log the parsed existing avatars
            console.log('Parsed existing avatars:', parsedExistingAvatars);
    
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            product.name = name;
            product.price = price;
            product.category = category;
            product.brand = brand;
            product.availability = availability;
            product.description = description;
            product.colors = Array.isArray(colors) ? colors : [colors];
            product.sizes = Array.isArray(sizes) ? sizes : [sizes];
    
            // Combine existing and new avatars
            product.avatars = [...parsedExistingAvatars, ...newAvatars];
    
            // Log the combined avatars
            console.log('Combined avatars:', product.avatars);
    
            await product.save();
            res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    

    getOneProductandDelete: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    },

    getProductsBySubcategory: async (req, res, next) => {
        try {
            // Find the subcategory by its ID
            const subcategory = await SubCategory.findById(req.params.id);

            if (!subcategory) {
                return res.status(400).json({ message: "Failed to find the subcategory." });
            }

            // Find products that match the subcategory's ObjectId
            const products = await Product.find({ subCategory: subcategory._id });

            // If no products are found, return a 404 status
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for this subcategory." });
            }

            // Return the filtered products
            return res.status(200).json(products);
        } catch (err) {
            // Handle errors and pass to next middleware
            next(err);
        }
    },

    getProductsSpecificCategory: async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(400).json({ message: "Failed to get Category" });

            const allProducts = await Product.find({});
            if (!allProducts) return res.status(400).json({ message: "Failed to get products" });

            const products = allProducts.filter(
                (product) => product.category === category.name
            );
            return res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    },

    searchProducts: async (req, res) => {
        console.log(req.query);
        try {
            const { name } = req.query;

            // Ensure that name exists and is not an empty string
            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Search query cannot be empty" });
            }

            // Use word boundaries or ensure that the search term is at the start of a word
            const searchQuery = {
                name: { $regex: `\\b${name}`, $options: 'i' } // Word boundary or start of word, case-insensitive search
            };

            const products = await Product.find(searchQuery);

            if (!products || products.length === 0) {
                return res.status(404).json({ message: 'No products found matching the criteria' });
            }

            res.status(200).json(products);
        } catch (err) {
            console.error('Error searching products:', err);
            res.status(500).json({ message: 'Server error', err });
        }
    }
};
