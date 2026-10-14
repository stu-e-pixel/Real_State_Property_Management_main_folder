class Validation {
  static validate(schema, source = "body") {
    return (req, res, next) => {
      if (!schema || typeof schema.validate !== "function") {
        return res.status(500).json({
          success: false,
          message: "Invalid validation schema",
        });
      }

      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }

      req[source] = value;
      next();
    };
  }
}

module.exports = Validation;