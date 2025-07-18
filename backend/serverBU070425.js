
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/facilities', require('./routes/facilityRoutes'));
app.use(express.static('public'));


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

// Routes
app.get('/entries', async (req, res) => {
  try {
    const entries = await FormData.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

app.post('/entries', async (req, res) => {
  try {
    const entry = new FormData(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error saving entry.' });
  }
});

app.delete('/entries/:id', async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
