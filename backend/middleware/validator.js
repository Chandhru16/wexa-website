const { body, validationResult } = require("express-validator");

// Validation rules
const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s()]{10,15}$/)
    .withMessage("Enter a valid phone number"),

  body("service")
    .optional({ checkFalsy: true })
    .isIn([
      "Custom Web Development",
      "UI/UX Design",
      "E-Commerce Solutions",
      "SEO Optimization",
      "Maintenance & Support",
      "Other"
    ])
    .withMessage("Invalid service selected"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Project details are required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters")
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

module.exports = {
  contactValidation,
  validate
};