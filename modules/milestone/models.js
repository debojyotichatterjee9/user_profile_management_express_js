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

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: [true, "Milestone title is required"],
    trim: true,
    maxlength: [100, "Milestone title cannot exceed 100 characters"],
  },
  due_date: {
    type: mongoose.Schema.Types.Date,
    validate: {
      validator: function (v) {
        return v >= this.startDate && (!this.endDate || v <= this.endDate);
      },
      message: "Milestone due date must be within project start and end dates",
    },
  },
  assigned_to: {
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
});

// Add a pre-save hook to update the updatedAt field
MilestoneSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define indexes for faster queries
MilestoneSchema.index({ name: 1, organization: 1 }, { unique: true });

exports.Project = mongoose.model("Milestone", MilestoneSchema);