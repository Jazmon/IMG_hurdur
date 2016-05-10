const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../sequelize');

const Comment = sequelize.define('comment', {
  text: {
    type: DataTypes.STRING,
    field: 'text',
  },
}, {
  classMethods: {
    associate: (models) => {
      Comment.belongsTo(models.User, {as: 'commenter'});
      //Comment.hasMany(models.Hashtag, {as: 'hashtags'});
      // Comment.hasMany(models.Hashtag, {as: 'mentions'});
      Comment.hasMany(models.Like, {as: 'likes'});
      // Comment.hasMany(models.Mention, {as: 'mentions'});
      // Comment.hasMany(models.Comment, {as: 'comments'});
    }
  }
});

module.exports = Comment;

/*
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
}, {
  strict: true
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
*/
