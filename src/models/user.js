import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  hashedPassword: String,
  salt: String,
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

const User = mongoose.model('User', UserSchema);

export default User;
