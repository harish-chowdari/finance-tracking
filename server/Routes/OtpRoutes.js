const express = require("express");
const { sendOTPEmail, updatePassword } = require("../Controllers/Otp");
const router = express.Router();


router.post("/send-otp", sendOTPEmail);

router.post("/update-password", updatePassword);


 
module.exports = router;
