const express = require("express");
const router = express.Router();

const authValidator = require("../validators/auth-validator.js");
const authController = require("../controllers/auth-controller.js");

const {
  validationResultHandler,
} = require("../validators/validation-result-handler.js");

// /auth/signup => PUT
router.put(
  "/signup",
  authValidator.validateSignupRules(),
  validationResultHandler,
  authController.signup
);

// /auth/signup => POST
router.post(
  "/signin",
  authValidator.validateSigninRules(),
  validationResultHandler,
  authController.signin
);

module.exports = router;
