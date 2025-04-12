const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

app.post('/submit', async (req, res) => {
  try {
    const form = new FormData(req.body);
    await form.save();
    res.status(201).json({ message: 'Form saved' });
  } catch (error) {
    res.status(500).json({ error: 'Could not save form data' });
  }
});

app.get('/entries', async (req, res) => {
  const entries = await FormData.find().sort({ timestamp: -1 });
  res.json(entries);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
