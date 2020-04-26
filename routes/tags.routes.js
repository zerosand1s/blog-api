const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const errorService = require('../services/error.service');
const tagController = require('../controllers/tag.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.authenticate);

router.get('/all-tags', async (req, res, next) => {
  try {
    const tags = await tagController.getAllTags(req);
    return res.status(200).json({ status: 'Success', message: 'Tags fetched successfully', data: { tags } });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.get('/my-tags', async (req, res, next) => {
  try {
    const tags = await tagController.getUserTagsByUsername(req.user.username);
    return res.status(200).json({ status: 'Success', message: 'Tags fetched successfully', data: { tags } });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.post('/follow', async (req, res, next) => {
  try {
    const paramsToValidate = [{ name: 'id', type: 'String' }];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await tagController.follow(req);
    return res.status(200).json({ status: 'Success', message: 'Tag followed successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.post('/unfollow', async (req, res, next) => {
  try {
    const tags = await userController.getUserTagsByUsername(req.user.username);
    return res.status(200).json({ status: 'Success', message: 'Tags fetched successfully', data: { tags } });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

module.exports = router;
