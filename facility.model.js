
const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: String,
  segment: String,
});

module.exports = mongoose.models.Facility || mongoose.model('Facility', facilitySchema);
