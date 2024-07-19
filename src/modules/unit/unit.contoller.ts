import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Property } from "../../infrastructure/entities/property/property.entity";
import { addUnitValidation } from "../../core/validators/unit/addunit.validator";
import { Unit } from "../../infrastructure/entities/unit/unit.entity";
import { updateUnitValidation } from "../../core/validators/unit/updateunit.validator";
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the unit
 *         type:
 *           type: string
 *           enum: [VILLA,APPARTMENT, TWINHOUSE, TOWNHOUSE,STUDIO]
 *           description: The type of the unit
 *         url:
 *           type: string
 *           description: The URL of the unit
 *         isReady:
 *           type: boolean
 *           description: Indicates whether the unit is ready
 *         deliveryDate:
 *           type: string
 *           description: The delivery date of the unit
 *         bedrooms:
 *           type: number
 *           description: The number of bedrooms in the unit
 *         bathrooms:
 *           type: number
 *           description: The number of bathrooms in the unit
 *         squareFootage:
 *           type: number
 *           description: The square footage of the unit
 *         total_price:
 *           type: number
 *           description: The total price of the unit
 *         propertyId:
 *           type: string
 *           description: The unique identifier of the associated property
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the unit was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the unit was last updated
 */


/**
 * @swagger
 * /api/unit/{propertyId}:
 *   post:
 *     summary: Add a new unit to a property
 *     tags:
 *       - units
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUnitRequest'
 *     responses:
 *       '201':
 *         description: Unit created successfully
 *         content:
 *           application/json:    
 *             schema:
 *               $ref: '#/components/schemas/CreateUnitResponse'
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
 *     CreateUnitRequest:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         squareFootage:
 *           type: number
 *         total_price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [APPARTMENT, HOUSE, TOWNHOUSE]
 *     CreateUnitResponse:
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
 *         error:
 *           type: string
 */
router.post("/:id", addUnitValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { url, bedrooms, bathrooms, squareFootage, total_price, type } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const property = await Property.findOne({ where: { id } });
    if (!property) {
      return res.status(404).json({ message: `property is not found!` });
    }

    await Unit.create({
      bedrooms,
      bathrooms,
      squareFootage,
      total_price,
      type,
      url,
      propertyId: id,
    }).save();
    res.status(201).json({ message: `unit is created!` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/unit:
 *   get:
 *     summary: Get all units
 *     tags:
 *       - units
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:    
 *             schema:
 *               $ref: '#/components/schemas/GetUnitsResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     GetUnitsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Unit'
 *     Unit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         squareFootage:
 *           type: number
 *         total_price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [APPARTMENT, HOUSE, TOWNHOUSE]
 *         property:
 *           $ref: '#/components/schemas/Property'
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         working_area:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */
router.get("/", async (req, res) => {
  try {
    const units = await Unit.find({
      relations: { property: { working_area: true } },
    });
    res.status(200).json({ data: units });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});
/**
 * @swagger
 * /units/{id}:
 *   get:
 *     summary: Get a unit by ID
 *     tags:
 *       - units
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUnitResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     GetUnitResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Unit'
 *     Unit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         squareFootage:
 *           type: number
 *         total_price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [APPARTMENT, HOUSE, TOWNHOUSE]
 *         property:
 *           $ref: '#/components/schemas/Property'
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         working_area:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const units = await Unit.findOne({
      where: { id },
      relations: { property: { working_area: true } },
    });
    res.status(200).json({ data: units });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

router.put(
  "/:id",
  updateUnitValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const unit = await Unit.findOne({ where: { id } });
      if (!unit) {
        return res.status(404).json({ message: `unit is not found!` });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await Unit.update(id, req.body);
      res.status(200).json({ message: `unit updated!` });
    } catch (e) {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const unit = await Unit.findOne({ where: { id } });
    if (!unit) {
      return res.status(404).json({ message: `unit is not found!` });
    }
    await Unit.softRemove(unit);
    res.status(200).json({ message: `unit is deleted!` });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
