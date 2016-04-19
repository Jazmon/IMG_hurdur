import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: new Date
  },
  modified: {
    type: Date,
    default: new Date
  },
  text: String,
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like'
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hashtag'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
}, { strict: true });

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
