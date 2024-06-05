const { body } = require("express-validator");

const validateAddPostRules = () => {
  return [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title should be of 5 character."),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Content should be of 5 character."),
  ];
};

module.exports = { validateAddPostRules };
