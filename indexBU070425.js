const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FormModel = require('./formData.model'); // ← This line should be here
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

//Routes
app.use('/facilities', require('./routes/facilityRoutes'));
app.use('/entries', require('./routes/entryRoutes'));

// Load Models
const FormData = require('./formData.model');
const Facility = require('./facility.model'); // NEW

// Delete entry
app.delete('/entries/:id', async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Submit form data
app.post('/entries', async (req, res) => {
  try {
    const form = new FormModel(req.body);
    await form.save();
    
    res.status(201).json({ message: 'Form data saved.' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data.' });
  }
});

// Get all entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await FormData.find().sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});


// -------------------
// Facility Management
// -------------------

// Get all facilities
app.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facilities.' });
  }
});

// Add a new facility
app.post('/facilities', async (req, res) => {
  try {
    const { name, segment } = req.body;
    const facility = new Facility({ name, segment });
    await facility.save();
    res.status(201).json({ message: 'Facility added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add facility.' });
  }
});

// Delete a facility
app.delete('/facilities/:id', async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete facility.' });
  }
});


// -------------------
// Start the Server
// -------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
