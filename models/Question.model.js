const { Schema, model } = require("mongoose");

// Model de usuario no banco

const questSchema = new Schema(
  {
    topic: {
      type: String,
      required: [true, "Topic is required."],
      lowercase: true,
      trim: true,
    },

    question: {
      type: String,
      required: [true, "Question is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // array with strings of wrong answers for the program select some of them
    wrongAnswer: {
      type: [String],
      trim: true,
      // Sintaxe de mensagem de erro customizada pra quando a regra do Schema não for satisfeita
      required: [true, "Wrong answers are required."],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Question", questSchema);
