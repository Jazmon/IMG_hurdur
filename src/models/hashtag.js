import mongoose from 'mongoose';

const HashtagSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: new Date
  },
  modified: {
    type: Date,
    default: new Date
  },
  text: String,
}, { strict: true });

const Hashtag = mongoose.model('Hashtag', HashtagSchema);

export default Hashtag;
