const mongoose = require('mongoose');

const TravelGuideSchema = new mongoose.Schema(
  {
    overview: { type: String, default: '' },
    mustVisitSpots: { type: [String], default: [] },
    hotelNotes: { type: [String], default: [] },
    transportTips: { type: [String], default: [] },
    safetyNotes: { type: [String], default: [] },
    packingList: { type: [String], default: [] },
    foodToTry: { type: [String], default: [] },
    localEtiquette: { type: [String], default: [] },
    bestTimeToVisit: { type: String, default: '' }
  },
  { _id: false }
);

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
  travelGuide: { type: TravelGuideSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', PlaceSchema);
