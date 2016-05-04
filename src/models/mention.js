const mongoose = require('mongoose');

const MentionSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: new Date
  },
  modified: {
    type: Date,
    default: new Date
  },
  mentionedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  strict: true
});

const Mention = mongoose.model('Mention', MentionSchema);

module.exports = Mention;
