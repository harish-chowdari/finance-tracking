const mongoose = require("mongoose");

const EmailsSchema = new mongoose.Schema({
    billId: {
        type: mongoose.Types.ObjectId,
        ref: "Bills",
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
    },
    today: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Emails", EmailsSchema);