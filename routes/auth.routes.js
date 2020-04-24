const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const errorService = require('../services/error.service');
const authController = require('../controllers/auth.controller');

router.post('/login', async (req, res, next) => {
  try {
    const paramsToValidate = [
      { name: 'username', type: 'String' },
      { name: 'password', type: 'String' }
    ];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    const data = await authController.login(req);
    return res.status(200).json({ status: 'Success', message: 'User logged in successfully', data: data });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

module.exports = router;
