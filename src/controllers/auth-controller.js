const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const success = await user.save();

    if (success) {
      return res
        .status(201)
        .send({ success: true, message: "Signup success." });
    }

    return res.status(200).send({ success: false, message: "Signup failed!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong!" });
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res
          .status(200)
          .send({ success: false, message: "Password does not match!" });
      }

      const token = jwt.sign(
        { email: user.email, userId: user._id.toString() },
        "secrettoken",
        { expiresIn: "1h" }
      );

      if (token) {
        return res
          .status(200)
          .send({ success: true, message: "Signin success.", jwt: token });
      }
    } else {
      return res
        .status(200)
        .send({ success: false, message: "User with email not found!" });
    }

    return res.status(200).send({ success: false, message: "Signin failed!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong" });
  }
};

module.exports = { signup, signin };
