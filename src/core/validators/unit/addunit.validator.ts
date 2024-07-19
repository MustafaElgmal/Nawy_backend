import { body } from "express-validator";
import { Property } from "../../../infrastructure/entities/property/property.entity";

export const addUnitValidation = [
  body("bedrooms")
    .notEmpty()
    .withMessage("bedrooms is required!")
    .isNumeric()
    .withMessage("Invalid number"),
  body("bathrooms")
    .notEmpty()
    .withMessage("bathrooms is required!")
    .isNumeric()
    .withMessage("Invalid number"),
  body("squareFootage")
    .notEmpty()
    .withMessage("squareFootage is required!")
    .isNumeric()
    .withMessage("Invalid number"),
  body("total_price")
    .notEmpty()
    .withMessage("total_price is required!")
    .isNumeric()
    .withMessage("Invalid number"),
    body("url")
    .notEmpty()
    .withMessage("unit photo URL is required")
    .isURL()
    .withMessage("Invalid photo URL")
];
