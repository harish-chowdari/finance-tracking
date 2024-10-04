const User = require("../Models/AuthenticationModel"); 

async function addExpenses(req, res) {
    try {
        const { category, amount, date, userId } = req.body; 

        if (!category || !amount || !date || !userId) {
            return res.status(200).json({ allFieldsRequired: "All fields are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        const newExpense = {
            category,
            amount,
            date
        };

        

        user.expenses.push(newExpense);

        await user.save();

        return res.status(200).json({ AddedSuccessfully: "Expense added successfully", expenses: user.expenses });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { addExpenses };
