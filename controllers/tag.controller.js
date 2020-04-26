const Promise = require('bluebird');
const _ = require('lodash');
const User = require('../models/User');
const Tag = require('../models/Tag');

const create = tagNames => {
  try {
    return Promise.map(tagNames, async name => {
      name = name.toLowerCase();
      const isAlreadyPresent = await Tag.findOne({ name });

      if (!isAlreadyPresent) {
        const tag = new Tag({ name });
        const savedTag = await tag.save();
        return savedTag._id;
      }
    });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const get = name => {
  try {
    name = name.toLowerCase();
    return Tag.findOne({ name });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const getAllTags = () => {
  try {
    return Tag.find();
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const getUserTagsByUsername = async (username) => {
  try {
    const user = await User.find({ username: username }).populate('tags');
    return user[0].tags;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const follow = async (req) => {
  try {
    return User.updateOne({ username: req.user.username }, { $push: { tags: req.body.id } });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

module.exports = {
  get,
  create,
  getAllTags,
  getUserTagsByUsername,
  follow
};
