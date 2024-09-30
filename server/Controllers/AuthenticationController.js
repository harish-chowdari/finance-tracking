const Schema = require("../Models/AuthenticationModel.js");



async function SigUp(req, res) {
  try {
    const { name, email, password, colourBlind } = req.body;

    const isUserExist = await Schema.findOne({ email: email });

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new Schema({
      name,
      email,
      password,
      colourBlind,
      otp: "",
      otpExpiresAt: "",
    });

    const d = await data.save();
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}


async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await Schema.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== isUserExist.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    return res.json(isUserExist);
  } catch (error) { 
    console.log(error);
  }
}



module.exports = {
  SigUp,
  Login
};
