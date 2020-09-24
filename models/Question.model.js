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
<<<<<<< HEAD
=======
      lowercase: true,
>>>>>>> e35b85ddf62c2046871946614db2215fa2241cf3
      trim: true,
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required."],
<<<<<<< HEAD
=======
      lowercase: true,
>>>>>>> e35b85ddf62c2046871946614db2215fa2241cf3
      trim: true,
    },

    // array with strings of wrong answers for the program select some of them
    wrongAnswer: {
      type: [String],
      required: [true, "Wrong answers are required."],
<<<<<<< HEAD
      trim: true,
=======
>>>>>>> e35b85ddf62c2046871946614db2215fa2241cf3
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Question", questSchema);
