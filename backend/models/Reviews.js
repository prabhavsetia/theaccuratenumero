const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true
  },
  servicename: {
    type: Schema.Types.String,
    ref: 'Services'
  },
  stars:{
    type: Number,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model('Reviews', ReviewSchema);
