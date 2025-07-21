const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const queryRoutes = require('./routes/queryRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const articleRoutes = require('./routes/articleRoutes'); // <-- Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/articles', articleRoutes); // <-- Add this line

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// ... other imports
const userRoutes = require('./routes/userRoutes'); // <-- Add or verify this line

// ... other app.use lines
app.use('/api/user', userRoutes); // <-- Add or verify this line
