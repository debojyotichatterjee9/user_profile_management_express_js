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

const CommentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.String,
    required: [true, "Comment is required"],
    trim: true,
  },
  attachments: [AttachmentSchema],
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

// Add a pre-save hook to update the updatedAt field
CommentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define indexes for faster queries
CommentSchema.index({ name: 1, organization: 1 }, { unique: true });

exports.Project = mongoose.model("Comment", CommentSchema);