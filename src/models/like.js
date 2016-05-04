const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: new Date
  },
  modified: {
    type: Date,
    default: new Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  strict: true
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
