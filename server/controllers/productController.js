const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');

module.exports = {
    createProduct: async (req, res) => {
        console.log('Request Body:', req.body);
        console.log(req.files);
        try {
            const { name, price, category, brand, availability, description, subCategory, discount } = req.body;
            const avatars = req.files.map(file => file.path);

            // Parse colors and sizes from the stringified arrays
            let colors = [];
            let sizes = [];

            try {
                colors = JSON.parse(req.body.colors);
                // Ensure colors is an array of strings, not an array containing a stringified array
                colors = Array.isArray(colors) ? colors.flat() : [colors];
            } catch (e) {
                console.error('Error parsing colors:', e);
                colors = [];
            }

            try {
                sizes = JSON.parse(req.body.sizes);
                // Ensure sizes is an array of strings, not an array containing a stringified array
                sizes = Array.isArray(sizes) ? sizes.flat() : [sizes];
            } catch (e) {
                console.error('Error parsing sizes:', e);
                sizes = [];
            }

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
                colors,
                sizes,
                discount: discount || 0,
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
            const {
                name,
                price,
                category,
                brand,
                availability,
                description,
                colors = [],
                sizes = [],
                imageOrder
            } = req.body;
    
            // Parse the image order
            let orderedImages = [];
            try {
                orderedImages = JSON.parse(imageOrder);
            } catch (e) {
                console.error('Error parsing image order:', e);
                return res.status(400).json({ message: 'Invalid image order format' });
            }
    
            // Parse the colors and sizes if they're strings
            let parsedColors = colors;
            let parsedSizes = sizes;
            try {
                if (typeof colors === 'string') {
                    parsedColors = JSON.parse(colors);
                }
                if (typeof sizes === 'string') {
                    parsedSizes = JSON.parse(sizes);
                }
            } catch (e) {
                console.error('Error parsing colors or sizes:', e);
            }
    
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Get the indices where new files should be inserted
            const fileIndices = req.body.fileIndices ? 
                (Array.isArray(req.body.fileIndices) ? req.body.fileIndices : [req.body.fileIndices]) : 
                [];
            
            // Get new uploaded files
            const newFiles = req.files || [];
    
            // Create the final ordered array of image paths
            const finalImagePaths = orderedImages.map((img, index) => {
                // If this position should contain a new file
                const fileIndex = fileIndices.indexOf(index.toString());
                if (fileIndex !== -1 && newFiles[fileIndex]) {
                    return newFiles[fileIndex].path;
                }
                // Otherwise use the existing path
                return img.isServerImage ? img.path : null;
            }).filter(Boolean); // Remove any null values
    
            // Update product fields
            product.name = name;
            product.price = price;
            product.category = category;
            product.brand = brand;
            product.availability = availability;
            product.description = description;
            product.colors = parsedColors;
            product.sizes = parsedSizes;
            product.avatars = finalImagePaths;
    
            await product.save();
            res.status(200).json({
                message: 'Product updated successfully',
                product
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
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
