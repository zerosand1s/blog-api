const bcrypt = require('bcrypt');
const jwtService = require('../services/jwt.service');
const User = require('../models/User');

const register = async req => {
  try {
    const payload = req.body;

    if (payload.password !== payload.confirmPassword) {
      throw new Error({
        type: 'BAD_REQUEST',
        code: 400,
        message: 'Passwords do not match'
      });
    }

    const userWithSameUsername = await User.find({ username: payload.username });

    if (userWithSameUsername.length) {
      throw new Error({
        type: 'BAD_REQUEST',
        code: 400,
        message: 'Username already exists'
      });
    }

    const hash = await bcrypt.hash(payload.password, 10);
    const user = new User({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      username: payload.username,
      password: hash
    });

    return user.save();
  } catch (err) {
    throw new Error({
      type: 'SERVER_ERROR',
      code: 500,
      message: 'Something went wrong'
    });
  }
};

const follow = async (req, h) => {
  try {
    const token = req.headers.authorization;
    const user = await jwtService.verify(token);

    if (!user) {
      return h.response({ status: 'Error', message: 'Invalid authentication token' }).code(401);
    }

    if (user.id === req.payload.id) {
      return h.response({ status: 'Error', message: 'Can not follow self' }).code(401);
    }

    const _user = await User.findById(req.payload.id);
    const index = _user.followers.indexOf(user.id);

    if (index >= 0) {
      return h.response({ status: 'Success', message: 'You already follow this user' }).code(200);
    }

    _user.followers.push(user.id);
    await _user.save();
    return h.response({ status: 'Success', message: 'Followed user successfully' }).code(200);
  } catch (err) {
    console.error('Error while creating new user: ', err);
    return h.response({ status: 'Error', message: 'Something went wrong' }).code(500);
  }
};

const unfollow = async (req, h) => {
  try {
    const token = req.headers.authorization;
    const user = await jwtService.verify(token);

    if (!user) {
      return h.response({ status: 'Error', message: 'Invalid authentication token' }).code(401);
    }

    if (user.id === req.payload.id) {
      return h.response({ status: 'Error', message: 'Can not unfollow self' }).code(401);
    }

    const _user = await User.findById(req.payload.id);
    const index = _user.followers.indexOf(user.id);

    if (index < 0) {
      throw new Error('User not found in followers list');
    }

    _user.followers.splice(index, 1);
    await _user.save();
    return h.response({ status: 'Success', message: 'Unfollowed user successfully' }).code(200);
  } catch (err) {
    console.error('Error while creating new user: ', err);
    return h.response({ status: 'Error', message: 'Something went wrong' }).code(500);
  }
};

module.exports = {
  register,
  follow,
  unfollow
};
