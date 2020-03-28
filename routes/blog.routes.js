const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const errorService = require('../services/error.service');
const blogController = require('../controllers/blog.controller');

router.post('/new-blog', async (req, res) => {
  try {
    const paramsToValidate = [
      { name: 'title', type: 'String' },
      { name: 'body', type: 'String' }
    ];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await blogController.create(req);
    return res.status(200).json({ status: 'Success', message: 'Blog created successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await blogController.getAllBlogs(req);
    return res.status(200).json({ status: 'Success', message: 'Blogs fetched successfully', data: blogs });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

router.patch('/like', async (req, res) => {
  try {
    const paramsToValidate = [{ name: 'id', type: 'String' }];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await blogController.like(req);
    return res.status(200).json({ status: 'Success', message: 'Blog liked successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

router.patch('/dislike', async (req, res) => {
  try {
    const paramsToValidate = [{ name: 'id', type: 'String' }];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await blogController.dislike(req);
    return res.status(200).json({ status: 'Success', message: 'Blog disliked successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    return res.status(err.code).json({
      status: 'Error',
      message: err.message
    });
  }
});

module.exports = router;
