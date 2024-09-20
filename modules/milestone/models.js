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
    is_enabled: { type: mongoose.Schema.Types.Boolean, default: false },
    is_deleted: { type: mongoose.Schema.Types.Boolean, default: false },
    enabled_on: { type: mongoose.Schema.Types.Date, default: null },
    disabled_on: { type: mongoose.Schema.Types.Date, default: null },
    deleted_on: { type: mongoose.Schema.Types.Date, default: null },
  },
  { _id: false, created_on: false, modified_on: false }
);

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, "Milestone title is required"],
    trim: true,
    maxlength: [100, "Milestone title cannot exceed 100 characters"],
  },
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
  start_date: {
    type: mongoose.Schema.Types.Date,
    required: [true, "Start date is required"],
    default: Date.now,
  },
  due_date: {
    type: mongoose.Schema.Types.Date,
    validate: {
      validator: function (v) {
        return v >= this.startDate && (!this.endDate || v <= this.endDate);
      },
      message: "Milestone due date must be within start and end dates",
    },
  },
  end_date: {
    type: mongoose.Schema.Types.Date,
    validate: {
      validator: function (v) {
        return v > this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  assigned_to: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  assigned_by: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  attachments: [AttachmentSchema],
  status: {
    type: mongoose.Schema.Types.String,
    enum: ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"],
    default: "Not Started",
  },
  tags: [
    {
      type: mongoose.Schema.Types.String,
      trim: true,
      maxlength: [10, "Tag cannot exceed 10 characters"],
    },
  ],
  priority: {
    type: mongoose.Schema.Types.String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  meta_data: { type: MetaDataSchema, default: () => ({}) },
});

// Add a pre-save hook to update the updatedAt field
MilestoneSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define indexes for faster queries
MilestoneSchema.index(
  {
    name: 1,
    organization_id: 1,
    project_id: 1,
    assigned_to: 1,
    assigned_by: 1,
  },
  { unique: true }
);

exports.Milestone = mongoose.model("Milestone", MilestoneSchema);
