module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('hashtag', {
    text: {
      type: DataTypes.STRING
    }
  }, {
    /*associate: (models) => {

    }*/
  });
  return Hashtag;
};

/*
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
}, {
  strict: true
});

const Hashtag = mongoose.model('Hashtag', HashtagSchema);

module.exports = Hashtag;
*/
