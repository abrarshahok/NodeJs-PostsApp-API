const User = require("../models/user");
const { body } = require("express-validator");

const validateSignupRules = () => {
  return [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 3 })
      .withMessage("Name should be of atleast 3 characters."),
    body("email")
      .isEmail()
      .withMessage("Enter a valid email.")
      .custom(async (email, { req }) => {
        const found = await User.findOne({ email: email });
        if (found) {
          return Promise.reject("Email already exists");
        }
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("password should be of atleast 6 characters."),
  ];
};

const validateSigninRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("password should be of atleast 6 characters."),
  ];
};

module.exports = { validateSignupRules, validateSigninRules };
