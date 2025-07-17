
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  facility: String,
  segment: String,
  month: String,
  year: String,
  census: Number,
  apw: Number,
  swl: Number,
  falls: Number,
});

module.exports = mongoose.model('FormData', formSchema);
