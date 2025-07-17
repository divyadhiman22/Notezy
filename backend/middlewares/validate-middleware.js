const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    const errors = {};
    err.errors.forEach(({ path, message }) => {
      const field = path[0];
      errors[field] = message;
    });

    return res.status(422).json({
      message: "Validation failed",
      errors,          
    });
  }
};

module.exports = validate;
