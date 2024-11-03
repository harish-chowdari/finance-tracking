const experss = require("express");
const router = experss.Router();
const { addExpenses, getExpenses, getUserData, deleteMail } = require("../Controllers/Addexpenses");

router.post("/add-expenses", addExpenses)


router.get("/get-expenses/:userId", getExpenses);


router.get("/user-data/:userId", getUserData)

router.delete("/delete-mail/:userId", deleteMail);

 
module.exports = router;