const mongoose = require('mongoose');
const Announcement = require('./models/AnnouncmentModel'); // Adjust the path as needed
const Product = require('./models/productModel'); // Adjust the path as needed


(async () => {
    try {
        await mongoose.connect("mongodb+srv://bmajd7743:dElkLv5xZHDdfiks@infoplus.zddqyuc.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

        const announcements = await Announcement.find();
        for (const announcement of announcements) {
            const productExists = await Product.findById(announcement.product);
            if (!productExists) {
                console.log(`Invalid product reference found in announcement ${announcement._id}`);
                // Optionally handle the invalid reference here
                // For example, you can remove the announcement or update it with a valid product ID
            }
        }

        console.log('Product reference check completed');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error checking product references:', err);
    }
})();
