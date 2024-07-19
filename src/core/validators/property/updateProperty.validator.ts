import { body } from "express-validator";
import { Property } from "../../../infrastructure/entities/property/property.entity";

export const updatePropertyValidation = [
  body("name")
    .optional()
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
  body("owner").optional(),
  body("coverUrl")
    .optional()
    .isURL()
    .withMessage("Invalid photo URL"),
  body("downPaymentPercentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Invalid percentage value"),
  body("numberOfYear")
    .optional()
    .isNumeric()
    .withMessage("Invalid number"),
  
];
