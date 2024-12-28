const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    required: true,
  },
});

module.exports = mongoose.model('Visitor', visitorSchema);
