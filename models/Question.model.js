const { Schema, model } = require("mongoose");

// Model de usuario no banco

const questSchema = new Schema(
  {
    topic: {
      type: String,
      required: [true, "Topic is required."],
      trim: true,
    },

    question: {
      type: String,
      required: [true, "Question is required."],
      trim: true,
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required."],
      trim: true,
    },

    // array with strings of wrong answers for the program select some of them
    wrongAnswer: {
      type: [String],
      required: [true, "Wrong answers are required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Question", questSchema);
