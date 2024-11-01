const express = require("express");
const router = express.Router();
const { getBill, addBill, editBill, getBillById } = require("../Controllers/BillController");



router.get("/get-bill/:userId", getBill);


router.post("/add-bill/:userId", addBill);

router.put("/edit-bill/:userId/:billId", editBill);

router.get("/get-bill/:userId/:billId", getBillById);


module.exports = router