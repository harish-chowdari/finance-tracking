const Users = require("../Models/AuthenticationModel");
const Emails = require("../Models/EmailsModel");
const nodemailer = require('nodemailer');
const cron = require("node-cron");


const addBill = async (req, res) => {

    const {userId} = req.params;

    try {
        const { billNumber, toBePaidOn, category, amount } = req.body;

        if (!billNumber || !toBePaidOn || !category || !amount) {
            return res.status(200).json({ allFieldsRequired: "All fields are required" });
        }

        const user = await Users.findById(userId);

        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        const newBill = {
            billNumber,
            toBePaidOn,
            category,
            amount
        };

        user.bills.push(newBill);

        await user.save();

        return res.status(200).json({ AddedSuccessfully: "Bill added successfully", bills: user.bills });

    } catch (error) {
        console.error("Error adding bill:", error);
    }
}






const getBill = async (req, res) => {
    try {

        const {userId} = req.params;

        if (!userId) {
            return res.status(200).json({ userIdRequired: "User ID is required" });
        }

        const user = await Users.findById(userId);

        if (!user) {
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        return res.status(200).json({ bills: user.bills });

    } catch (error) {
        console.error("Error getting bills:", error);

    }
}




async function sendReminderEmails() {
    try {
        const users = await Users.find();

        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

        for (const user of users) {
            for (const bill of user.bills) {
                const dueDate = new Date(bill.toBePaidOn);


                if (isNaN(dueDate)) {
                    console.error(`Invalid date for bill: ${bill.billNumber}`);
                    continue; 
                }

                const daysDifference = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

                if (daysDifference === 10 || daysDifference === 0) {
                    const emailRecord = await Emails.findOne({
                        billId: bill._id,
                        userId: user._id,
                        today: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        },
                    });

                    if (!emailRecord) {
                        let transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASSWORD,
                            },
                        });

                        let subject, text;

                        // Format the due date to a readable string (e.g., "October 12, 2024")
                        const formattedDueDate = dueDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        if (daysDifference === 10) {
                            subject = "Bill Payment Reminder (10 days left)";
                            text = `Dear ${user.name}, this is a reminder to pay your bill number ${bill.billNumber} amounting to $${bill.amount}. You have 10 days to pay before the due date: ${formattedDueDate}.`;
                        } else if (daysDifference === 0) {
                            subject = "Bill Payment Reminder (Due Today)";
                            text = `Dear ${user.name}, this is a final reminder to pay your bill number ${bill.billNumber} amounting to $${bill.amount}. The bill is due today: ${formattedDueDate}. Please make the payment to avoid any penalties.`;
                        }

                        let mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: user.email,
                            subject: subject,
                            text: text,
                        };

                        transporter.sendMail(mailOptions, async function (error, info) {
                            if (error) {
                                console.error(`Failed to send email to ${user.email}:`, error);
                            } else {
                                const newEmail = new Emails({
                                    billId: bill._id,
                                    userId: user._id,
                                    today: currentDate,
                                });

                                await newEmail.save();
                                console.log(`Reminder email sent to ${user.email} for bill ${bill.billNumber}`);
                            }
                        });
                    } else {
                        console.log(`Reminder already sent for bill ${bill.billNumber} of user ${user.email}`);
                    }
                }
            }
        }

        return { message: "Email processing completed" };

    } catch (error) {
        console.error("Error processing reminder emails:", error);
    }
}






cron.schedule("1 * * * * *", async () => {
    console.log("Running daily email reminder check..."); 
    await sendReminderEmails();
});



const editBill = async (req, res) => {
    const { userId, billId } = req.params;
    const user = await Users.findById(userId);

    if (!user) {
        return res.status(200).json({ userIdNotFound: "User not found" });
    }
    const { toBePaidOn,  category, billNumber, amount,  } = req.body;

    try {
        

        const bill = user.bills.id(billId);
        if (!bill) {
            return res.status(200).json({ billNotFound: "Bill not found" });
        }

        bill.toBePaidOn = toBePaidOn || bill.toBePaidOn;
        bill.category = category || bill.category;
        bill.amount = amount || bill.amount;
        bill.billNumber = billNumber || bill.billNumber;

        await user.save();
        return res.status(200).json({ success: "Bill updated successfully", updatedBill: bill });
    } catch (error) {
        console.error("Error editing bill:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getBillById = async (req, res) => {
    const { userId, billId } = req.params;
    try {
        const user = await Users.findById(userId);
        if (!user) {    
            return res.status(200).json({ userIdNotFound: "User not found" });
        }

        const bill = user.bills.id(billId);
        if (!bill) {
            return res.status(200).json({ billNotFound: "Bill not found" });
        }

        return res.status(200).json({ bill: bill });
    } catch (error) {
        console.error("Error getting bill:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addBill,
    getBill,
    sendReminderEmails,
    editBill,
    getBillById
}