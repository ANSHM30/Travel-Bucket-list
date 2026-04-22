const Place = require('../models/Place');

exports.getPlaces = async (req, res) => {
  try {
    const query = req.user ? { user: req.user.id } : { public: true };
    const places = await Place.find(query).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Failed to fetch places' });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { title, lat, lng, description } = req.body;

    if (!title || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: 'title, lat and lng are required' });
    }

    const place = await Place.create({
      user: req.user.id,
      title: title.trim(),
      description,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    });

    res.status(201).json(place);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ message: 'Failed to create place' });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const updates = { ...req.body };
    const place = await Place.findOne({ _id: req.params.id, user: req.user.id });

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (typeof updates.lat === 'number' && typeof updates.lng === 'number') {
      updates.location = {
        type: 'Point',
        coordinates: [updates.lng, updates.lat]
      };
      updates.address = `${updates.lat.toFixed(4)}, ${updates.lng.toFixed(4)}`;
    }

    delete updates.lat;
    delete updates.lng;

    const updatedPlace = await Place.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, {
      new: true,
      runValidators: true
    });

    res.json(updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ message: 'Failed to update place' });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ message: 'Failed to delete place' });
  }
};
