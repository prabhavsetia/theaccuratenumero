const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/theaccuratenumero';

// Function to connect to MongoDB
const connectToMongo = () => {
  mongoose.connect(mongoURI).then((res) => {
    // Log success message on successful connection
    console.log("Database connected");
  }).catch(error => {
    // Log error message if connection fails
    console.log(error);
  });
}

module.exports = connectToMongo;
