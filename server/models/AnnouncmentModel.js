const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false  // Changed to false to allow announcements without images
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;