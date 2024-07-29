const connectToMongo = require('./db');
const express = require('express');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
connectToMongo();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Backend Started...');
});

// Routes for authentication and blog functionalities
app.use('/api/auth', require('./routs/auth'));
app.use('/api/blogs', require('./routs/blog'));

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
