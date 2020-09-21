const { Schema, model } = require("mongoose");

// Model de usuario no banco

const questSchema = new Schema(
  {
    senderId : {
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    receiverId : {
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    message : {
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    color : {
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", questSchema);