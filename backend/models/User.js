const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define User schema with name, email, password, and date fields
const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// Create and export the User model
const User = mongoose.model('user', UserSchema);
module.exports = User;
