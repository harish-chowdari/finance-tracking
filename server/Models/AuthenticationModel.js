const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    diseases: [{
        disease: { type: String }, // Stores the disease name
        avoid: { type: [String] },  // Array of colors to avoid
        use: { type: [String] }
    }],
    otp: {
        type: String 
    },
    otpExpiresAt: {
        type: Date
    }
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);
