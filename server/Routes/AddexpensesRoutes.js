const experss = require("express");
const router = experss.Router();
const { addExpenses, getExpenses } = require("../Controllers/Addexpenses");

router.post("/add-expenses", addExpenses)


router.get("/get-expenses/:userId", getExpenses);

 
module.exports = router;