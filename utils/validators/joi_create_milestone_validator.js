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

exports.createMilestoneValidation = (payload) => {
  const JOISchema = JOI.object({
    title: JOI.string()
      .trim()
      .required()
      .max(100)
      .error(new Error("Milestone title is required (max 100 characters)")),
    due_date: JOI.date()
      .when("startDate", {
        is: JOI.required(),
        then: JOI.date()
          .greater(JOI.ref("startDate"))
          .when("endDate", {
            is: JOI.exist(),
            then: JOI.date().less(JOI.ref("endDate")),
            otherwise: JOI.allow(null),
          }),
        otherwise: JOI.allow(null),
      })
      .error(
        new Error("Milestone due date must be within project start and end dates")
      ),
    assigned_to: JOI.string(),
    attachments: JOI.array().items(attachmentSchema),
    status: JOI.string().valid(
      ...["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]
    ),
    tags: JOI.array().items(
      JOI.string()
        .trim()
        .max(10)
        .error(new Error("Tag cannot exceed 10 characters"))
    ),
    priority: JOI.string().valid(...["Low", "Medium", "High"]),
  });
  const JOIValidateOptions = { abortEarly: false };
  return JOISchema.validate(payload, JOIValidateOptions);
};