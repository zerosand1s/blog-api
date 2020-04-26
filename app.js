const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const blogsRouter = require('./routes/blog.routes');
const tagsRouter = require('./routes/tags.routes');

const errorMiddleware = require('./middlewares/error.middleware');
const errorService = require('./services/error.service');

const app = express();

db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/tags', tagsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    err = errorService.constructError('NOT_FOUND', 404, 'API endpoint not found');
  }

  errorMiddleware.handleError(err, res);
});

module.exports = app;
