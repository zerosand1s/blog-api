const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwtService = require('../services/jwt.service');
const errorService = require('../services/error.service');

const login = async req => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('+password');

    if (!user) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Invalid username or password');
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      throw errorService.constructError('BAD_REQUEST', 400, 'Invalid username or password');
    }

    return jwtService.sign({ id: user._id });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

module.exports = {
  login
};
