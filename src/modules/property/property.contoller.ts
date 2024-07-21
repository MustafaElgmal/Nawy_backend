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
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *           format: url
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *         numberOfYear:
 *           type: integer
 *         working_areaId:
 *           type: string
 *           format: uuid
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
 *     UpdatePropertyRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         owner:
 *           type: string
 *         coverUrl:
 *           type: string
 *           format: url
 *         downPaymentPercentage:
 *           type: number
 *           format: decimal
 *         numberOfYear:
 *           type: integer
 *     PropertiesResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Property'
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     NotFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     BadResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadResponse'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
 *               $ref: '#/components/schemas/PropertiesResponse'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
