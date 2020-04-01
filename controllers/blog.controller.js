const Blog = require('../models/Blog');
const User = require('../models/User');
const tagController = require('../controllers/tag.controller');

const create = async req => {
  try {
    const tagIds = await tagController.create(req.body.tags);
    const blog = new Blog({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id,
      tags: tagIds
    });

    const savedBlog = await blog.save();
    return User.updateOne({ username: req.user.username }, { $push: { blogs: savedBlog._id } });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const getMyBlogs = async req => {
  try {
    return Blog.find({ author: req.user._id });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const getBlogsByTag = async tagName => {
  try {
    const tagDetails = await tagController.get(tagName);
    return Blog.find({ tags: tagDetails._id });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const like = async req => {
  try {
    const blog = await Blog.findById(req.body.id);
    blog.likes = blog.likes + 1;
    return blog.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const dislike = async req => {
  try {
    const blog = await Blog.findById(req.body.id);
    blog.likes = blog.likes - 1;
    return blog.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

module.exports = {
  create,
  getMyBlogs,
  getBlogsByTag,
  like,
  dislike
};
