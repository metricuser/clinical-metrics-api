// facility.model.js
const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  segment: { type: String, required: true }
});

module.exports = mongoose.model('Facility', FacilitySchema);
