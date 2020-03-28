const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = async payload => {
  const secret = process.env.JWT_SECRET;

  try {
    return await jwt.sign(payload, secret, { expiresIn: '1d' });
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

const verify = async token => {
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('+password');

    return user;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

module.exports = {
  sign,
  verify
};
