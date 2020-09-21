const { Schema, model } = require("mongoose");

// Model de usuario no banco

const userSchema = new Schema(
  {
    // Nome de usuario
    username: {
      type: String,
      trim: true,
      // Sintaxe de mensagem de erro customizada pra quando a regra do Schema não for satisfeita
      required: [true, "Username is required."],
      unique: true,
    },

    // Email
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // add password property here
    // Senha
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
