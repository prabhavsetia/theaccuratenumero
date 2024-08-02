const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define User schema with name, description, p1-p6, price and date fields
const ServicesSchema = new Schema({
    servicename: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    p1: {
        type: String,
    },
    p2: {
        type: String,
    },
    p3: {
        type: String,
    },
    p4: {
        type: String,
    },
    p5: {
        type: String,
    },
    p6: {
        type: String,
    },
    price: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// Create and export the User model
const Services = mongoose.model('services', ServicesSchema);
module.exports = Services;
