const Users = require("../Models/AuthenticationModel");



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



module.exports = {
    addBill,
    getBill
}