// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for a Blog model with fields for title, subtitle, description, and date
const BlogSchema = new Schema({
    title: {
        type: String,        // The title field is a string and is required
        require: true
    },
    subtitle: {
        type: String,        // The subtitle field is a string with a default value of "General"
        default: "General"
    },
    description: {
        type: String,        // The description field is a string and is required
        require: true,
    },
    date: {
        type: Date,          // The date field is a date object with a default value of the current date
        default: Date.now
    },
});

// Export the Blog model, making it available for use in other parts of the application
module.exports = mongoose.model('blog', BlogSchema);
