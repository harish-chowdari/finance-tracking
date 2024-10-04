const experss = require("express");
const router = experss.Router();
const { addExpenses } = require("../Controllers/Addexpenses");

router.post("/add-expenses", addExpenses)

 
module.exports = router;