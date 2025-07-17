
// entry.model.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  facility: String,
  segment: String,
  month: String,
  year: String,
  census: Number,
  apw: Number,
  swl: Number,
  falls: Number,
  apwPercentage: Number,
  swlPercentage: Number,
  fallsPercentage: Number,
});

module.exports = mongoose.model('Entry', entrySchema);
