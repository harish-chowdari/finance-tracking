const express = require("express");
const router = express.Router();
const { getBill, addBill } = require("../Controllers/BillController");



router.get("/get-bill/:userId", getBill);


router.post("/add-bill/:userId", addBill);


module.exports = router