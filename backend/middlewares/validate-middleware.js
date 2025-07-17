const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    // Construct an errors object based on zod errors
    const errors = {};
    err.errors.forEach(({ path, message }) => {
      // path is an array; take first element as the field name
      const field = path[0];
      errors[field] = message;
    });

    return res.status(422).json({
      message: "Validation failed",
      errors,           // <-- send field-specific errors here
    });
  }
};

module.exports = validate;
