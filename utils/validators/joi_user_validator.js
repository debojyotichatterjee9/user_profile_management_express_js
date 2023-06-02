const JOI = require("joi");


exports.userValidation = (payload) => {
  const JOISchema = JOI.object({
    username: JOI.string()
      .min(5)
      .max(30)
      .required(),

    email: JOI.string()
      .email()
      .min(5)
      .max(50)
      .optional()
  });
  return JOISchema.validate(payload);
}
