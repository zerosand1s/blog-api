const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, select: false },
    follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
