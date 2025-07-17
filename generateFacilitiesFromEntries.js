
// generateFacilitiesFromEntries.js
const mongoose = require('mongoose');
const Entry = require('./formData.model');
const Facility = require('./facility.model');

mongoose.connect('mongodb+srv://metricuser:Tdl54998325@cluster0.ytwaph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

async function generateFacilities() {
  const entries = await Entry.find({}, 'facility segment'); // get facility & segment

  const uniqueMap = new Map();

  entries.forEach((entry) => {
    const key = `${entry.facility}|${entry.segment}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, {
        name: entry.facility,
        segment: entry.segment,
      });
    }
  });

  const uniqueFacilities = Array.from(uniqueMap.values());

  await Facility.deleteMany({});
  await Facility.insertMany(uniqueFacilities);

  console.log(`✅ Seeded ${uniqueFacilities.length} facilities from entries.`);
  mongoose.disconnect();
}

generateFacilities();
