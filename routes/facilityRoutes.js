
// routes/facilityRoutes.js
const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');

// GET /facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching facilities.' });
  }
});

// POST /facilities
router.post('/', async (req, res) => {
  try {
    const { name, segment } = req.body;
    const newFacility = new Facility({ name, segment });
    await newFacility.save();
    res.status(201).json(newFacility);
  } catch (error) {
    res.status(400).json({ message: 'Error saving facility.' });
  }
});

module.exports = router;
