const { Schema, model } = require("mongoose");

// Model de usuario no banco

const questSchema = new Schema(
  {
    subject : {
        type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    class : {
        type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    question : {
        type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    correctAnswer : {
        type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // array with strings of wrong answers for the program select some of them
    wrongAnswers : {
        type: [String],
      trim: true,
      // Sintaxe de mensagem de erro customizada pra quando a regra do Schema não for satisfeita
      required: [true, "Username is required."],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", questSchema);
