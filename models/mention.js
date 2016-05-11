module.exports = (sequelize, DataTypes) => { // eslint-disable-line no-unused-vars
  const Mention = sequelize.define('mention', {

  }, {
    associate: (models) => {
      /*Mention.hasOne(models.User, {as: 'mentioner'});
      Mention.hasOne(models.User, {as: 'mentioned_user'});*/
    }
  });
  return Mention;
};

/*
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
*/
