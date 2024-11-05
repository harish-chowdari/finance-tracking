const User = require("../Models/AuthenticationModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const ExpensesEmail = require("../Models/ExpensesEmailModel");

// Helper function to determine if two dates are in the same month and year
function isSameMonth(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    );
}

// Add Expenses Function
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

        const expenseDate = new Date(date);
        const newExpense = { category, amount, date: expenseDate };

        user.expenses.push(newExpense);

        if (isSameMonth(expenseDate, new Date())) {
            user.currentMonthExpenses = (user.currentMonthExpenses || 0) + Number(amount);
        }

        await user.save();

        return res.status(200).json({
            AddedSuccessfully: "Expense added successfully",
            expenses: user.expenses,
            currentMonthExpenses: user.currentMonthExpenses
        });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Send Email Notification
async function sendNotificationEmail(user) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Monthly Expense Limit Reached",
        text: `Hello ${user.name}, you have reached your monthly expense limit of ${user.expensesLimit}. Please review your expenses.`,
    };

    await transporter.sendMail(mailOptions);
}

// Schedule the cron job to check every minute
cron.schedule("1 * * * * *", async () => {
    console.log("Running cron job to check expense limits...");

    try {
        const users = await User.find();
        const currentMonthStart = new Date(new Date().setDate(1));

        for (const user of users) {
            if (user.currentMonthExpenses >= user.expensesLimit) {
                const emailRecord = await ExpensesEmail.findOne({
                    userId: user._id,
                    thisMonth: { $gte: currentMonthStart },
                });

                // Only send email if no record exists for the current month
                if (!emailRecord) {
                    await sendNotificationEmail(user);

                    // Log the email notification for the current month
                    await ExpensesEmail.create({
                        userId: user._id,
                        thisMonth: new Date(),
                    });

                    console.log(`Email sent to ${user.email} for reaching expense limit.`);
                }
            }
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});


const deleteMail = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        const emailRecord = await ExpensesEmail.findOneAndDelete({
            userId: user._id,
            thisMonth: { $gte: new Date(new Date().setDate(1)) },
        });

        if (!emailRecord) {
            return res.status(200).json({ emailNotFound: "Email not found" });
        }

        return res.status(200).json({ emailDeleted: "Email deleted successfully" });
    } catch (error) {
        console.error("Error deleting email:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Retrieve User Expenses
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

// Retrieve User Data
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

module.exports = { addExpenses, getExpenses, getUserData, deleteMail };
