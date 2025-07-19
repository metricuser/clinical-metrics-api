
// models/Facility.js
const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  segment: { type: String, required: true }
});

module.exports = mongoose.model('Facility', facilitySchema);
