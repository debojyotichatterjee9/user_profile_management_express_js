// const JOI = require("JOI");

// exports.createProjectValidation = (payload) => {
//   const JOISchema = JOI.object({
//     name: JOI.string().required(),
//     project_code: JOI.string().required(),
//     description: JOI.string(),
//     organization_id: JOI.string(),
//     start_date: JOI.string(),
//     end_date: JOI.string(),
//     created_by: JOI.string(),
//     status:JOI.string(),
//     budget: JOI.number(),
//     actual_cost: JOI.number(),
//     updated_by:JOI.string(),
//     tags:JOI.array(),
//     priority:JOI.string(),
//     milestones:JOI.object(),
//     files:JOI.object(),
//     meta_data:JOI.object(),
//   });
//   const JOIValidateOptions = { abortEarly: false };
//   return JOISchema.validate(payload, JOIValidateOptions);
// };

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

const commentSchema = JOI.object({
  comment: JOI.string()
    .trim()
    .required()
    .error(new Error("Comment is required")),
  commented_by: JOI.string()
    .required()
    .error(new Error("Commented by is required")),
  commented_at: JOI.date().default(Date.now),
});

const milestoneSchema = JOI.object({
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
  comments: JOI.array().items(commentSchema),
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

exports.updateProjectValidation = (payload) => {
  const JOISchema = JOI.object({
    name: JOI.string()
      .trim()
      .required()
      .max(100)
      .error(new Error("Project name is required (max 100 characters)")),
    project_id: JOI.string(),
    project_code: JOI.string(),
    description: JOI.string()
      .trim()
      .max(1000)
      .error(new Error("Project description cannot exceed 1000 characters")),
    organization_id: JOI.string()
      .required()
      .error(new Error("Organization is required")),
    start_date: JOI.date()
      .required()
      .error(new Error("Start date is required")),
    end_date: JOI.date()
      .greater(JOI.ref("start_date"))
      .error(new Error("End date must be after start date")),
    status: JOI.string().valid(
      ...["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]
    ),
    budget: JOI.number().min(0).error(new Error("Budget cannot be negative")),
    actual_cost: JOI.number()
      .min(0)
      .error(new Error("Actual cost cannot be negative")),
    created_by: JOI.string()
      .required()
      .error(new Error("Created by is required")),
    tags: JOI.array().items(
      JOI.string()
        .trim()
        .max(10)
        .error(new Error("Tag cannot exceed 10 characters"))
    ),
    priority: JOI.string().valid(...["Low", "Medium", "High"]),
    milestones: JOI.array().items(milestoneSchema),
    files: JOI.array().items(attachmentSchema),
    // No validation needed for created_at and updated_at (system generated)
    meta_data: JOI.object(),
  });
  const JOIValidateOptions = { abortEarly: false };
  return JOISchema.validate(payload, JOIValidateOptions);
};
// module.exports = createProjectValidation;
