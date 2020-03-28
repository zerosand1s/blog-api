const constructError = (name, code, message) => {
  let error = new Error(message || 'Something went wrong');
  error.code = code || 500;
  error.name = name || 'UNKNOWN';

  return error;
};

module.exports = {
  constructError
};
