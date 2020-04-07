const jwtService = require('../services/jwt.service');
const errorService = require('../services/error.service');
const errorMiddleware = require('./error.middleware');

const authenticate = async (req, res, next) => {
  try {
    const token = req.get('Authorization');

    if (!token) {
      throw errorService.constructError(
        'AUTHENTICATION_FAIL',
        401,
        'Authentication token not present in request header'
      );
    }

    const user = await jwtService.verify(token);

    if (!user) {
      throw errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err = errorService.constructError('AUTHENTICATION_FAIL', 401, 'Authentication token is expired');
    }
    if (err.name === 'JsonWebTokenError') {
      err = errorService.constructError('AUTHENTICATION_FAIL', 401, 'Invalid authentication token');
    }

    errorMiddleware.handleError(err, res);
  }
};

module.exports = {
  authenticate
};
