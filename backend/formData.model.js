const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  facilityName: String,
  segment: String,
  month: String,
  year: String,
  census: Number,
  apwResidents: Number,
  swlResidents: Number,
  fallsResidents: Number,
  
});

module.exports = mongoose.model('FormData', formSchema);

