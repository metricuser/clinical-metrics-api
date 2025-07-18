
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  facility: String,
  segment: String,
  month: String,
  year: String,
  census: Number,
  apwResidents: Number,
  swlResidents: Number,
  unplannedSwl: Number,
  apwNew: Number,
  swlNew: Number,
  swlUnavoidable: Number,
  fallsResidents: Number,
  fallsWithInjury: Number,
  notes: String,
});

module.exports = mongoose.model('Entry', entrySchema);
