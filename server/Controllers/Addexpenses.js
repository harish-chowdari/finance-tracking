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



async function getExpenses(req, res) {
    try { 
   
        const { userId } = req.params;

        if (!userId) {
            return res.status(200).json({ userIdRequired: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        return res.status(200).json({ expenses: user.expenses });
    } catch (error) {
        console.error("Error getting expenses:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



async function getUserData(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(200).json({ userIdRequired: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        return res.status(200).json({ userData: user });
    } catch (error) {
        console.error("Error getting user data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



module.exports = { addExpenses, getExpenses, getUserData };
