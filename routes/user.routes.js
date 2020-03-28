const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const userController = require('../controllers/user.controller');

router.post('/register', async (req, res, next) => {
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
      throw new Error({
        type: 'BAD_REQUEST',
        code: 400,
        message: validationErrors[0]
      });
    }

    await userController.register(req);
    return res.status(200).json({ status: 'Success', message: 'User registration successful' });
  } catch (err) {
    console.error('ERROR: ', err);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

module.exports = router;
