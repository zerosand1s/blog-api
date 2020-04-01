const express = require('express');
const router = express.Router();
const validationService = require('../services/validation.service');
const errorService = require('../services/error.service');
const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.authenticate);

router.post('/new-blog', async (req, res, next) => {
  try {
    const paramsToValidate = [
      { name: 'title', type: 'String' },
      { name: 'body', type: 'String' },
      { name: 'tags', type: 'List' }
    ];
    const validationErrors = validationService.validateRequestPayload(req, paramsToValidate);

    if (validationErrors.length) {
      throw errorService.constructError('BAD_REQUEST', 400, validationErrors[0]);
    }

    await blogController.create(req);
    return res.status(200).json({ status: 'Success', message: 'Blog created successfully' });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.get('/my-blogs', async (req, res, next) => {
  try {
    const blogs = await blogController.getMyBlogs(req);
    return res.status(200).json({ status: 'Success', message: 'Blogs fetched successfully', data: blogs });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.get('/tag/:tag', async (req, res, next) => {
  try {
    const tag = req.params.tag;
    const blogs = await blogController.getBlogsByTag(tag);
    return res.status(200).json({ status: 'Success', message: 'Blogs fetched successfully', data: blogs });
  } catch (err) {
    console.error('ERROR: ', err.message);
    next(err);
  }
});

router.patch('/like', async (req, res, next) => {
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
    next(err);
  }
});

router.patch('/dislike', async (req, res, next) => {
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
    next(err);
  }
});

module.exports = router;
