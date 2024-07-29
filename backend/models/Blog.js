// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for a Blog model with the necessary fields
const BlogSchema = new Schema({
    author: {
        type: String,       
        required: true
    },
    title: {
        type: String,       
        required: true
    },
    content: {
        type: String,       
        required: true
    },
    summary: {
        type: String,       
        required: true
    },
    date: {
        type: Date,         
        default: Date.now
    },
    status: {
        type: String,        
        default: "draft"
    },
    category: {
        type: String,       
        default: "General"
    },
});

// Export the Blog model, making it available for use in other parts of the application
module.exports = mongoose.model('Blog', BlogSchema);
