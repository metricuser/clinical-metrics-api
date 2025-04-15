const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  facilityName: String,
  segment: String,
  month: String,
  year: String,
  apwResidents: Number,
  apwNew: Number,
  swlResidents: Number,
  swlNew: Number,
  swlUnavoidable: Number,
  fallsResidents: Number,
  fallsTotal: Number,
  fallsInjury: Number,
  census: Number,
  notes: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormData', formSchema);.

