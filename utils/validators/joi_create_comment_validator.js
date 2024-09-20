const JOI = require("joi");

const attachmentSchema = JOI.object({
  file_name: JOI.string()
    .trim()
    .required()
    .error(new Error("File name is required")),
  file_url: JOI.string()
    .trim()
    .required()
    .error(new Error("File URL is required")),
  uploaded_by: JOI.string()
    .required()
    .error(new Error("Uploaded by is required")),
  uploaded_at: JOI.date().default(Date.now),
});

exports.createCommentValidation = (payload) => {
  const JOISchema = JOI.object({
    comment: JOI.string()
      .trim()
      .required()
      .max(1000)
      .error(new Error("Comment is required (max 1000 characters)")),
    organization_id: JOI.string(),
    project_id: JOI.string(),
    commented_at: JOI.date()
      .required()
      .error(new Error("Start date is required")),
    commented_by: JOI.string(),
    attachments: JOI.array().items(attachmentSchema),
  });
  const JOIValidateOptions = { abortEarly: false };
  return JOISchema.validate(payload, JOIValidateOptions);
};
