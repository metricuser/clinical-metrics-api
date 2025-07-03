
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  facility: String,
  segment: String,
  month: String,
  year: String,
  census: Number,
  apwResidents: Number,
  swlResidents: Number,
  swlUnplanned: Number,
  swlUnavoidable: Number,
  apwNew: Number,
  swlNew: Number,
  falls: Number,
  fallsWithInjury: Number,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);
