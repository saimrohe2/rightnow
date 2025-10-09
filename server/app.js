const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is imported
require('dotenv').config();

// Import routes
const queryRoutes = require('./routes/queryRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Define the origins (domains) that are allowed to make requests to your backend
const allowedOrigins = [
  'http://localhost:3000', // Keep for local frontend development (if you use port 3000)
  'http://localhost:5000', // Keep for local frontend development (if you use port 5000)
  // Your deployed Netlify frontend URL:
  'https://rightnowtest.netlify.app' // <-- THIS IS THE UPDATED LINE
];

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl requests)
        // Or if the origin is in our list of allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Deny the request if the origin is not allowed
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/articles', articleRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);