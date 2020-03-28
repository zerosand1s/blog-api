const validateRequestPayload = (req, paramsToValidate) => {
  const payload = req.body;
  const regex = new RegExp('.{1,}@[^.]{1,}');
  const errors = [];

  paramsToValidate.forEach(param => {
    if (!payload || !payload.hasOwnProperty(param.name) || !payload[param.name].length) {
      errors.push(`Missing parameter: ${param.name}`);
    }

    if (param.type === 'Number' && isNaN(payload[param.name])) {
      errors.push(`Invalid parameter: ${param.name}`);
    }

    if (param.isEmail && !regex.test(payload[param.name])) {
      errors.push(`Invalid email address: ${param.name}`);
    }
  });

  return errors;
};

module.exports = {
  validateRequestPayload
};
