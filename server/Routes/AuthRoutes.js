const express = require("express");
const { SigUp, Login } = require("../Controllers/AuthenticationController");
const router = express.Router();


router.post("/signup", SigUp);

router.post("/login", Login);


 
module.exports = router;
