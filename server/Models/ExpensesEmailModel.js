const mongoose = require("mongoose");

const ExpensesEmailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
    },
    thisMonth: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ExpensesEmail", ExpensesEmailSchema);
