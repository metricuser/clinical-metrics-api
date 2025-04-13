const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const FormData = require('./formData.model');

app.delete('/entries/:id', async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.post('/submit', async (req, res) => {
  try {
    const form = new FormData(req.body);
    await form.save();
    res.status(201).json({ message: 'Form data saved.' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data.' });
  }
});

app.get('/entries', async (req, res) => {
  try {
    const entries = await FormData.find().sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
