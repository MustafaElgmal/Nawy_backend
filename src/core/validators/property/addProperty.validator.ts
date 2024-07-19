import { body } from "express-validator";
import { Property } from "../../../infrastructure/entities/property/property.entity";

export const addPropertyValidation = [
  body("name")
    .notEmpty()
    .withMessage("name is required!")
    .custom(async (value: string) => {
      // Check if the name already exists in the database
      const existingEntity = await Property.findOne({
        where: { name: value },
      });

      if (existingEntity) {
        throw new Error("Name must be unique");
      }

      // Validation succeeded
      return true;
    }),
  body("coverUrl")
    .notEmpty()
    .withMessage("property photo URL is required")
    .isURL()
    .withMessage("Invalid photo URL"),
  body("downPaymentPercentage")
    .notEmpty()
    .withMessage("Percentage value is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Invalid percentage value"),
  body("numberOfYear")
    .notEmpty()
    .withMessage(" numberOfYear is required!")
    .isNumeric()
    .withMessage("Invalid number"),
    body("owner").notEmpty().withMessage("owner is required!"),
];
