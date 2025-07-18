
const mongoose = require('mongoose');
const Facility = require('./models/Facility');

// Replace this with your actual MongoDB URI
const MONGO_URI = 'mongodb+srv://metricuser:Tdl54998325@cluster0.ytwaph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seed = async () => {
  try {
    await Facility.deleteMany({});
    await Facility.insertMany([
      { name: 'Allis', segment: 'Midwest' },
      { name: 'Best Care', segment: 'Southern Hospitality' },
      { name: 'Bradford', segment: 'Northern Pride' },
      { name: 'Buchanan', segment: 'Southern Hospitality' },
      { name: 'Century Villa', segment: 'Northern Pride' },
      { name: 'Charlestown Place', segment: 'Southern Hospitality' },
      { name: 'Dover', segment: 'Southern Hospitality' },
      { name: 'Morning Breeze', segment: 'Northern Pride' },
      { name: 'Park View', segment: 'Northern Pride' },
      { name: 'Siena Woods', segment: 'Northern Pride' },
      { name: 'Smyrna', segment: 'Southern Hospitality' },
     ]);
    console.log('✅ Facilities seeded successfully.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
};

seed();
