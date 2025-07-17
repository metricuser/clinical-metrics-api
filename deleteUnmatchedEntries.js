
// deleteUnmatchedEntries.js
const mongoose = require('mongoose');
const Entry = require('./entry.model');

const MONGODB_URI = 'mongodb+srv://metricuser:Tdl54998325@cluster0.ytwaph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const deleted = await Entry.deleteMany({
      facility: { $in: ["Southern Hospitality", "Test"] }
    });

    console.log(`✅ Deleted ${deleted.deletedCount} entries`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
