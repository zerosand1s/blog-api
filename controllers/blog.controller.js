const jwtService = require('../services/jwt.service');
const errorService = require('../services/error.service');
const Blog = require('../models/Blog');

const create = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    const blog = new Blog({
      title: req.body.title,
      body: req.body.body,
      author: user._id
    });

    return blog.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

const getAllBlogs = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    return Blog.find().populate('author');
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

const like = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    const blog = await Blog.findById(req.body.id);
    blog.likes = blog.likes + 1;
    return blog.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

const dislike = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    const blog = await Blog.findById(req.body.id);
    blog.likes = blog.likes - 1;
    return blog.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

module.exports = {
  create,
  getAllBlogs,
  like,
  dislike
};
