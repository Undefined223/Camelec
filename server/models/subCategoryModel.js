const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SubcategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
});


const SubCategory = mongoose.model('SubCategory', SubcategorySchema);
module.exports = SubCategory