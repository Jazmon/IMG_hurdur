module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('image', {
    uploadPath: {
      type: DataTypes.STRING,
      field: 'upload_path',
    },
    title: {
      type: DataTypes.STRING,
      field: 'title',
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description',
    },
  }, {
    classMethods: {
      associate: (models) => {
        /*Image.hasMany(models.Comment, {
          as: 'comments'
        });
        Image.hasMany(models.Like, {
          as: 'likes'
        });*/
      }
    }
  });

  return Image;
};


/*
const ImageSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: new Date
  },
  modified: {
    type: Date,
    default: new Date
  },
  uploadPath: String,
  title: String,
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
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

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
*/
