import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { addPropertyValidation } from "../../core/validators/property/addProperty.validator";
import { updatePropertyValidation } from "../../core/validators/property/updateProperty.validator";
import { Property } from "../../infrastructure/entities/property/property.entity";
import { WorkingArea } from "../../infrastructure/entities/working_area/working_area.entity";
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the property
 *         name:
 *           type: string
 *           description: The name of the property
 *         owner:
 *           type: string
 *           description: The owner of the property
 *         coverUrl:
 *           type: string
 *           format: uri
 *           description: The URL of the cover image for the property
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *           description: The down payment percentage for the property
 *         numberOfYear:
 *           type: integer
 *           description: The number of years for the property
 *         units:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Unit'
 *         working_area:
 *           $ref: '#/components/schemas/WorkingArea'
 *         working_areaId:
 *           type: string
 *           format: uuid
 *           description: The ID of the working area associated with the property
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the property was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the property was last updated
 *       required:
 *         - name
 *         - owner
 *         - coverUrl
 *         - downPaymentPercentage
 *         - numberOfYear
 *         - working_areaId
 */

/**
 * @swagger
 * /api/property/{workingareaId}:
 *   post:
 *     summary: Add a new property to a working area
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: workingareaId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyRequest'
 *     responses:
 *       '201':
 *         description: Property created successfully
 *         content:
 *           application/json:    
 *             schema:
 *               $ref: '#/components/schemas/CreatePropertyResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     CreatePropertyRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *         downPaymentPercentage:
 *           type: number
 *         numberOfYear:
 *           type: number
 *     CreatePropertyResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */
router.post(
  "/:id",
  addPropertyValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { name, coverUrl, downPaymentPercentage, numberOfYear, owner } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const workingArea = await WorkingArea.findOne({ where: { id } });
      if (!workingArea) {
        return res.status(404).json({ message: `workingArea is not found!` });
      }

      await Property.create({
        name,
        coverUrl,
        downPaymentPercentage: downPaymentPercentage,
        numberOfYear: numberOfYear,
        working_areaId: id,
        owner,
      }).save();
      res.status(201).json({ message: `property is created!` });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Retrieve all properties
 *     tags:
 *       - Properties
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertiesResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * components:
 *   schemas:
 *     PropertiesResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Property'
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find({ relations: { units: true } });
    res.status(200).json({ data: properties });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/property/{name}:
 *   get:
 *     summary: Retrieve a property by name
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *           format: uri
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *         numberOfYear:
 *           type: integer
 *         working_areaId:
 *           type: string
 *           format: uuid
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */
router.get("/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const property = await Property.findOne({
      where: { name },
      relations: { units: true, working_area: true },
    });
    res.status(200).json({ data: property });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/property/{id}:
 *   put:
 *     summary: Update a property by ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyRequest'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * components:
 *   schemas:
 *     UpdatePropertyRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *           format: uri
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *         numberOfYear:
 *           type: integer
 *
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *           format: uri
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *         numberOfYear:
 *           type: integer
 *         working_areaId:
 *           type: string
 *           format: uuid
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */
router.put(
  "/:id",
  updatePropertyValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const property = await Property.findOne({ where: { id } });
      if (!property) {
        return res.status(404).json({ message: `property is not found!` });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await Property.update(id, req.body);
      res.status(200).json({ message: `property updated!` });
    } catch (e) {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Delete a property by ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Successful response
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await Property.findOne({ where: { id } });
    if (!property) {
      return res.status(404).json({ message: `property is not found!` });
    }
    const timestamp = new Date().getTime();
    property.name = property.name + "_d" + `${timestamp}`;
    await property.save();
    await Property.softRemove(property);
    res.status(200).json({ message: `property is deleted!` });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
