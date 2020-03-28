const jwtService = require('../services/jwt.service');
const errorService = require('../services/error.service');

const authenticate = async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('ERROR: ', err.message);

    if (err.name === 'TokenExpiredError') {
      err = errorService.constructError('TOKEN_EXPIRED', 401, 'Authentication token is expired');
    }

    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
};

module.exports = {
  authenticate
};
