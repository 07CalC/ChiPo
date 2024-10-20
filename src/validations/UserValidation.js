const { body, param } = require("express-validator");

const userIdValidationRules = () => {
  return [
    param("userId")
      .notEmpty()
      .withMessage("UserId must be provided")
      .isLength({ min: 1, max: 20 })
      .withMessage("UserId too long or short")
      .isString()
      .withMessage("UserId is not a string"),
  ];
};

const userLoginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .isEmail(),

    body("password")
      .notEmpty()
      .isLength({ min: 1 })
      .isString(),
  ]
};

const userRegisterValidationRules = () => {
  return [
    body("userId")
      .notEmpty()
      .isLength({ min: 1, max: 20 })
      .isString(),

    body("name")
      .notEmpty()
      .isLength({ min: 1, max: 32 })
      .isString(),

    body("email")
      .notEmpty()
      .isEmail(),

    body("location")
      .notEmpty()
      .isLength({ min: 6, max: 6 })
      .isString(),

    body("creator")
      .notEmpty()
      .isBoolean(),

    body("password")
      .notEmpty()
      .isLength({ min: 1 })
      .isString(),
  ]
};

const userUpdateValidationRules = () => {
  return userIdValidationRules().concat([      
    body("phone")
      .optional()
      .isInt(),

    body("name")
      .optional()
      .isLength({ min: 1, max: 20 })
      .isString(),

    body("email")
      .optional()
      .isEmail(),

    body("location")
      .optional()
      .isLength({ min: 6 })
      .isString(),

    body("creator")
      .optional()
      .isBoolean(),

    body("address")
      .optional()
      .isLength({ min: 0 })
      .isString(),
  ])
};

module.exports = { userIdValidationRules, userRegisterValidationRules, userLoginValidationRules, userUpdateValidationRules };