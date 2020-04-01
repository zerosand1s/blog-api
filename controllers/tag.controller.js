const Promise = require('bluebird');
const _ = require('lodash');
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

module.exports = {
  create
};
