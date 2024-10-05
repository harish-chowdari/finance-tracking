const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, 
    },
    diseases: [
      {
        disease: { type: String },
        avoid: { type: [String] },
        use: { type: [String] },
      },
    ],
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    expenses: [
      {
        category: { type: String },
        amount: { type: Number },
        date: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
