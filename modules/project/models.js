const mongoose = require("mongoose");
const uuid = require("uuid");

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

const CommentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.String,
    required: [true, "Comment is required"],
    trim: true,
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
  comments: [CommentSchema],
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
// Define the Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    project_id: {
      type: mongoose.Schema.Types.String,
      default: uuid.v4,
      unique: true,
    },
    project_code: {
      type: mongoose.Schema.Types.String,
      default: null,
      unique: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      trim: true,
      maxlength: [1000, "Project description cannot exceed 1000 characters"],
    },
    organization_id: {
      type: mongoose.Schema.Types.String,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    start_date: {
      type: mongoose.Schema.Types.Date,
      required: [true, "Start date is required"],
      default: Date.now,
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
    status: {
      type: mongoose.Schema.Types.String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"],
      default: "Not Started",
    },
    budget: {
      type: mongoose.Schema.Types.Number,
      min: [0, "Budget cannot be negative"],
      default: 0
    },
    actual_cost: {
      type: mongoose.Schema.Types.Number,
      min: [0, "Actual cost cannot be negative"],
      default: 0
    },
    created_by: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: [true, "Created by is required"],
    },
    updated_by: {
      type: mongoose.Schema.Types.String,
      ref: "User",
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
    milestones: [MilestoneSchema],
    files: [
      {
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
      },
    ],
    created_at: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
      immutable: true,
    },
    updated_at: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    meta_data: { type: MetaDataSchema, default: () => ({}) },
  },
  {
    collection: "project",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Add a pre-save hook to update the updatedAt field
ProjectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define indexes for faster queries
ProjectSchema.index({ name: 1, organization: 1 }, { unique: true });

exports.Project = mongoose.model("Project", ProjectSchema);
