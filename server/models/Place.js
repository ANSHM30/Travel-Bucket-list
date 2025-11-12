const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  address: String,
  photos: [String],
  tags: [String],
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  visited: { type: Boolean, default: false },
  public: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', PlaceSchema);
