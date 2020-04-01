const handleError = (err, res) => {
  if (!err.code) {
    err.code = 500;
    err.message = 'Internal Server Error';
  }
  return res.status(err.code).json({
    status: 'Error',
    message: err.message
  });
};

module.exports = {
  handleError
};
