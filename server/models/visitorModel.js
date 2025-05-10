// models/visitorModel.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'], // Ensures consistency
  },
  count: {
    type: Number,
    default: 1,
  },
});

// Compound index to enforce uniqueness per date and deviceType
visitorSchema.index({ date: 1, deviceType: 1 }, { unique: true });

module.exports = mongoose.model('Visitor', visitorSchema);