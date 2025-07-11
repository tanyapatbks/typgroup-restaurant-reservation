const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({path: './config/config.env'});

// Connect to database
connectDB();

// Route files
const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});