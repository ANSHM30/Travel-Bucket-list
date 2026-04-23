const express = require('express');
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placesController');
const { attachUserIfPresent, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', attachUserIfPresent, getPlaces);
router.get('/:id', attachUserIfPresent, getPlaceById);
router.post('/', requireAuth, createPlace);
router.patch('/:id', requireAuth, updatePlace);
router.delete('/:id', requireAuth, deletePlace);

module.exports = router;
