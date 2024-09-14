const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  file_name: {
    type: mongoose.Schema.Types.String,
    required: [true, "File name is required"],
    trim: true,
  },
  file_url: {
    type: mongoose.Schema.Types.String,
    required: [true, "File URL is required"],
    trim: true,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: [true, "Uploaded by is required"],
  },
  uploaded_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

const MetaDataSchema = new mongoose.Schema(
  {
    is_deleted: { type: mongoose.Schema.Types.Boolean, default: false },
    deleted_on: { type: mongoose.Schema.Types.Date, default: null },
  },
  { _id: false, created_on: false, modified_on: false }
);

const CommentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.String,
    required: [true, "Comment is required"],
    trim: true,
  },
  attachments: [AttachmentSchema],
  organization_id: {
    type: mongoose.Schema.Types.String,
    ref: "Organization",
    required: [true, "Organization Id is required"],
  },
  project_id: {
    type: mongoose.Schema.Types.String,
    ref: "Project",
    required: [true, "Project Id is required"],
  },
  commented_by: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: [true, "Commented by is required"],
  },
  commented_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
  meta_data: { type: MetaDataSchema, default: () => ({}) },
});

// Add a pre-save hook to update the updatedAt field
CommentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define indexes for faster queries
CommentSchema.index(
  { commented_by: 1, organization_id: 1, project_id: 1 },
  { unique: true }
);

exports.Comment = mongoose.model("Comment", CommentSchema);
