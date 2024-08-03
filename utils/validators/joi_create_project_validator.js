const JOI = require("joi");

exports.createProjectValidation = (payload) => {
  const JOISchema = JOI.object({
    name: JOI.string().required(),
    project_code: JOI.string().required(),
    description: JOI.string(),
    organization_id: JOI.string(),
  });
  const JOIValidateOptions = { abortEarly: false };
  return JOISchema.validate(payload, JOIValidateOptions);
};
