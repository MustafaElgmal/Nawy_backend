import { body } from "express-validator";
import { Property } from "../../../infrastructure/entities/property/property.entity";

export const updateUnitValidation = [
  body("bedrooms").optional().isNumeric().withMessage("Invalid number"),
  body("bathrooms").optional().isNumeric().withMessage("Invalid number"),
  body("squareFootage").optional().isNumeric().withMessage("Invalid number"),
  body("total_price").optional().isNumeric().withMessage("Invalid number"),
  body("url").optional().isURL().withMessage("Invalid photo URL"),
];
