
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/facilities', require('./routes/facilityRoutes'));
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose schema
const formSchema = new mongoose.Schema({
  facility: String,
  segment: String,
  month: String,
  year: String,
  apwResidents: Number,
  apwNew: Number,
  swlResidents: Number,
  swlUnplanned: Number,
  swlNew: Number,
  swlUnavoidable: Number,
  fallsResidents: Number,
  totalFalls: Number,
  fallsInjury: Number,
  census: Number,
  notes: String,
  apwPercent: String,
  swlPercent: String,
  fallsPercent: String,
}, { timestamps: true });

const FormData = mongoose.model('FormData', formSchema);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Get all entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await FormData.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

// Get single entry by ID (for Edit functionality)
app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await FormData.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entry.' });
  }
});

// Create a new entry
app.post('/entries', async (req, res) => {
  try {
    const entry = new FormData(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error saving entry.' });
  }
});

// Update an entry
app.put('/entries/:id', async (req, res) => {
  try {
    const updatedEntry = await FormData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry.' });
  }
});

// Delete an entry
app.delete('/entries/:id', async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});