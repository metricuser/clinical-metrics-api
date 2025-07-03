
const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// GET all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new entry
router.post('/', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
