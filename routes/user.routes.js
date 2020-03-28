const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const errorService = require('../services/error.service');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', async (req, res) => {
  try {
    const paramsToValidate = [
      { name: 'firstName', type: 'String' },
      { name: 'lastName', type: 'String' },
      { name: 'email', type: 'String', isEmail: true },
      { name: 'username', type: 'String' },
      { name: 'password', type: 'String' },
      { name: 'confirmPassword', type: 'String' }
    ];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await userController.register(req);
    return res.status(200).json({ status: 'Success', message: 'User registration successful' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

router.use(authMiddleware.authenticate);

router.post('/follow', async (req, res) => {
  try {
    const paramsToValidate = [{ name: 'id', type: 'String' }];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await userController.follow(req);
    return res.status(200).json({ status: 'Success', message: 'User followed successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

router.post('/unfollow', async (req, res) => {
  try {
    const paramsToValidate = [{ name: 'id', type: 'String' }];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await userController.unfollow(req);
    return res.status(200).json({ status: 'Success', message: 'User followed successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

module.exports = router;
