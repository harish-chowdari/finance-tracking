const experss = require("express");
const router = experss.Router();
const { addExpenses, getExpenses, getUserData } = require("../Controllers/Addexpenses");

router.post("/add-expenses", addExpenses)


router.get("/get-expenses/:userId", getExpenses);


router.get("/user-data/:userId", getUserData)

 
module.exports = router;