const Schema = require("../Models/AuthenticationModel.js");



async function SigUp(req, res) {
  try {
    const { name, email, password, diseases } = req.body;

    const isUserExist = await Schema.findOne({ email: email });

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const processedDiseases = diseases.map((disease) => {
      let avoid = [], use = [];

      if (disease === "deuteranopia") {
        avoid = ["red", "green", "brown", "orange"];
        use = ["blue", "yellow", "purple", "gray"];
      } else if (disease === "protanopia") {
        avoid = ["red", "green", "brown", "orange"];
        use = ["blue", "yellow", "purple", "gray"];
      }

      else if (disease === "tritanopia") {
        avoid = ["blue", "yellow", "green"];
        use = ["red", "pink", "gray", "black"];
      } else if (disease === "monochromacy") {
        avoid = ["all colors"];
        use = ["black", "white", "gray"];
      }

      return { disease, avoid, use };
    });

    const data = new Schema({
      name,
      email,
      password,
      diseases: processedDiseases, 
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
