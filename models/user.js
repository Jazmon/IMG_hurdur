const bcrypt = require('bcryptjs');
const config = require('../config');

// NOTE: bcrypt stores salt in the hash
// https://stackoverflow.com/q/13023361/5965327

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      field: 'email',
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
      }
    },
    superUser: {
      type: DataTypes.BOOLEAN,
      field: 'super_user',
      defaultValue: false,
      validate: {
        notNull: true
      },
    },
    username: {
      type: DataTypes.STRING,
      field: 'username',
    },
    passwordHash: {
      type: DataTypes.STRING,
      field: 'password',
      set: (val) => {
        bcrypt.genSalt(config.saltWorkFactor, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(val, salt, (err, hash) => {
            if (err) throw err;
            this.setDataValue('passwordHash', hash);
          });
        });
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: (val) => {
        this.setDataValue('password', val);
        this.setDataValue('passwordHash', val);
      },
      validate: {
        notNull: true,
        notEmpty: true,
        len: [config.passwordMinLength, config.passwordMaxLength],
      }
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      validate: {
        isAlpha: true,
      }
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',

    },
  }, {
    classMethods: {
      validPassword: (password, hash) => {
        bcrypt.compare(password, hash, (err, res) => {
          if (err) throw err;
          return res;
        });
      },
      associate: (models) => {
        /*User.hasMany(models.User, {
          as: 'followers'
        });
        User.hasMany(models.User, {
          as: 'following'
        });
        User.hasMany(models.Image, {
          as: 'images'
        });
        User.hasMany(models.Comment, {
          as: 'profile_comments'
        });*/
      }
    }
  });
  return User;
};
/*
const UserSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String,
    name: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },

  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  profilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  description: String,
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Uesr'
  }],
  joinDate: {
    type: Date,
    default: new Date
  },
  lastLoginDate: {
    type: Date,
    default: null
  }
});

// Methods

// Generate a hash
UserSchema.methods.generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

// Validate password
UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
//export default User;*/
