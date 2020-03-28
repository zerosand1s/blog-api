const bcrypt = require('bcrypt');
const jwtService = require('../services/jwt.service');
const errorService = require('../services/error.service');
const User = require('../models/User');

const register = async req => {
  try {
    const payload = req.body;

    if (payload.password !== payload.confirmPassword) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Passwords do not match');
    }

    const userWithSameUsername = await User.find({ username: payload.username });

    if (userWithSameUsername.length) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Username already exists');
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
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

const follow = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('UNAUTHORIZED', 401, 'Invalid authentication token');
    }

    if (user.id === req.payload.id) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Can not follow yourself');
    }

    const _user = await User.findById(req.body.id);
    const index = _user.followers.indexOf(user.id);

    if (index >= 0) {
      throw errorService.constructError('BAD_REQUEST', 400, 'You already follow this user');
    }

    _user.followers.push(user.id);
    return _user.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

const unfollow = async req => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('UNAUTHORIZED', 401, 'Invalid authentication token');
    }

    if (user.id === req.payload.id) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Can not unfollow yourself');
    }

    const _user = await User.findById(req.payload.id);
    const index = _user.followers.indexOf(user.id);

    if (index < 0) {
      throw errorService.constructError('BAD_REQUEST', 400, 'You do not follow this user');
    }

    _user.followers.splice(index, 1);
    return _user.save();
  } catch (err) {
    console.log('ERROR: ', err);
    throw errorService.constructError('SERVER_ERROR', 500);
  }
};

module.exports = {
  register,
  follow,
  unfollow
};
