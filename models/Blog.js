const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: String,
    body: String,
    likes: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
