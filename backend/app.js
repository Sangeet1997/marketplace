const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const itemRoutes = require('./routes/items');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/marketplacewDB';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/v1/auth', authRoutes);
app.use('/v1/items', itemRoutes);


// Health check route
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;

    if (dbState === 1) {
      res.status(200).json({
        status: 'UP',
        database: 'Connected'
      });
    } else {
      res.status(500).json({
        status: 'DOWN',
        database: 'Not connected'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
