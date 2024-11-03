const express = require("express");
const { SigUp, Login, deleteAcc, editAcc } = require("../Controllers/AuthenticationController");
const router = express.Router();


router.post("/signup", SigUp);

router.post("/login", Login);

router.delete("/delete/:userId", deleteAcc);

router.put("/update-account/:userId", editAcc);




 
module.exports = router;
