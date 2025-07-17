
const mongoose = require('mongoose');
const Entry = require('./models/Entry');
const Facility = require('./models/Facility');

const MONGODB_URI = 'mongodb+srv://metricuser:Tdl54998325@cluster0.ytwaph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const normalize = str => str?.trim().toLowerCase();

const backfillSegments = async () => {
  try {
    const facilities = await Facility.find({});
    const entries = await Entry.find({});
    let updatedCount = 0;
    let unmatched = [];

    for (const entry of entries) {
      const entryFacility = normalize(entry.facility);
      const match = facilities.find(f => normalize(f.name) === entryFacility);

      if (match) {
        entry.segment = match.segment;
        await entry.save();
        updatedCount++;
      } else {
        unmatched.push(entry.facility);
      }
    }

    console.log(`✅ Backfilled segment data for ${updatedCount} entries.`);
    
    if (unmatched.length > 0) {
      console.log(`❗ Unmatched facilities (${unmatched.length}):`);
      [...new Set(unmatched)].forEach(name => console.log(' -', name));
    }

  } catch (error) {
    console.error('❌ Error during backfill:', error);
  } finally {
    mongoose.disconnect();
  }
};

backfillSegments();
