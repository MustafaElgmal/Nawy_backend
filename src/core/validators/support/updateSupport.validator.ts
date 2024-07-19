import { body } from "express-validator";

export const updateSupportValidation = [
  body("whatsApp_phone")
    .optional()
    .isMobilePhone("en-US")
    .withMessage("Invalid mobile phone number"),
  body("phone_number")
    .optional()
    .isMobilePhone("en-US")
    .withMessage("Invalid mobile phone number"),
  body("mail_us")
    .optional()
    .isEmail()
    .withMessage("Invalid email address"),
];
