import { body } from "express-validator";

export const addSupportValidation = [
  body("whatsApp_phone")
    .notEmpty()
    .withMessage("Mobile phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid mobile phone number"),
  body("phone_number")
    .notEmpty()
    .withMessage("Mobile phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid mobile phone number"),
  body("mail_us")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address"),
];
