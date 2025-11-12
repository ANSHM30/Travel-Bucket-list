require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Place = require('../models/Place');
const User = require('../models/User');

(async () => {
  await connectDB();
  // remove existing
  await Place.deleteMany({});
  await User.deleteMany({});
  // create demo user (hash password manually or skip for seed)
  const user = await User.create({ name: 'Demo', email: 'demo@example.com', passwordHash: '...' });
  await Place.create({
    user: user._id,
    title: 'Eiffel Tower',
    description: 'Iconic view of Paris',
    location: { type: 'Point', coordinates: [2.2945, 48.8584] },
    address: 'Champ de Mars, Paris, France',
    tags: ['Europe','landmark'], public: true
  });
  console.log('Seed complete');
  process.exit(0);
})();
