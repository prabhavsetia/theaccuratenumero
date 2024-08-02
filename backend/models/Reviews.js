const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  servicename: {
    type: Schema.Types.String,
    ref: 'Services'
  },

});

module.exports = mongoose.model('Reviews', ReviewSchema);
