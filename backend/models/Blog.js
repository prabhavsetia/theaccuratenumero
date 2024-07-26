const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: {
        type: String ,
        require: true
    },
    subtitle:{
        type: String,
        default: "General"
    },
    description:{
        type: String,
        require: true,
    },
    date:{
        type: Date,
        default: Date.now
    },

  });
  module.exports = mongoose.model('blog',BlogSchema);