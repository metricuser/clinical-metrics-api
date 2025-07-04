
const mongoose = require('mongoose');
const Facility = require('./models/Facility');

// Replace this with your actual MongoDB URI
const MONGODB_URI = 'mongodb+srv://metricuser:Tdl54998325@cluster0.ytwaph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seed = async () => {
  try {
    await Facility.deleteMany({});
    await Facility.insertMany([
      { name: 'Southern Hospitality', segment: 'Southern' },
      { name: 'Northern Pride', segment: 'Northern' },
      { name: 'Midwest Manor', segment: 'Midwest' }
    ]);
    console.log('✅ Seeded facilities!');
  } catch (err) {
    console.error('❌ Error seeding:', err);
  } finally {
    mongoose.disconnect();
  }
};

seed();
