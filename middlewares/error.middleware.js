const handleError = (err, res) => {
  return res.status(err.code).json({
    status: 'Error',
    message: err.message
  });
};

module.exports = {
  handleError
};
