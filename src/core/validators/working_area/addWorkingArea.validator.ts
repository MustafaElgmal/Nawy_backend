import { body } from "express-validator";
import { WorkingArea } from "../../../infrastructure/entities/working_area/working_area.entity";

export const addWorkingAreaValidation = [
  body("name")
    .notEmpty()
    .withMessage("name is required!")
    .custom(async (value: string) => {
      // Check if the name already exists in the database
      const existingEntity = await WorkingArea.findOne({
        where: { name: value },
      });

      if (existingEntity) {
        throw new Error("Name must be unique");
      }

      // Validation succeeded
      return true;
    }),
  body("description").notEmpty().withMessage("description is required!"),
  body("url")
  .notEmpty()
  .withMessage("working area photo URL is required")
  .isURL()
  .withMessage("Invalid photo URL")
];
