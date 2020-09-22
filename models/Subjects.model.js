const { Schema, model } = require("mongoose");

// Model de usuario no banco

const subjectSchema = new Schema(
  {
    subject: {
      type: String,
      // required: [true, "Subject is required."],
      // lowercase: true,
      // trim: true,
    },

    classs: {
      type: String,
      // required: [true, "Class is required."],
      // lowercase: true,
      // trim: true,
    },

    topic: {
      type: String,
      // required: [true, "Topic is required."],
      // unique: true,
      // lowercase: true,
      // trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Subject", subjectSchema);
