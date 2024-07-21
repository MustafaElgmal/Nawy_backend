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
 *     unit_kindStringEnum:
 *       type: string
 *       enum:
 *            - VILLA
 *            - APPARTMENT
 *            - TWINHOUSE
 *            - TOWNHOUSE
 *            - STUDIO
 *     unit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         deleted_at:
 *           type: string
 *           format: date-time
 *         url:
 *           type: string
 *           format: url
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
 *         isReady:
 *           type: boolean
 *         deliveryDate:
 *           type: string
 *           format: date
 *         propertyId:
 *           type: string
 *           format: uuid
 *     CreateUnitRequest:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: url
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         squareFootage:
 *           type: number
 *         total_price:
 *           type: number
 *         isReady:
 *           type: boolean
 *         deliveryDate:
 *           type: string
 *           format: date
 *         type:
 *              $ref: '#/components/schemas/unit_kindStringEnum'
 *     UpdateUnitRequest:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: url
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         squareFootage:
 *           type: number
 *         total_price:
 *           type: number
 *         isReady:
 *           type: boolean
 *         deliveryDate:
 *           type: string
 *           format: date
 *         type:
 *              $ref: '#/components/schemas/unit_kindStringEnum'
 *     UnitResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/unit'
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
router.post("/:id", addUnitValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const {
      url,
      bedrooms,
      bathrooms,
      squareFootage,
      total_price,
      type,
      isReady,
      deliveryDate,
    } = req.body;
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
      isReady,
      deliveryDate,
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
 *               $ref: '#/components/schemas/UnitResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
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
 * /api/unit/{id}:
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
 *               $ref: '#/components/schemas/UnitResponse'
 *       '404':
 *         description: Unit entity not found
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
/**
 * @swagger
 * /api/unit/{id}:
 *   put:
 *     summary: Update a unit entity by ID
 *     tags:
 *       - units
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
 *             $ref: '#/components/schemas/UpdateUnitRequest'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Unit entity not found
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
/**
 * @swagger
 * /api/unit/{id}:
 *   delete:
 *     summary: Delete a unit by ID
 *     tags:
 *       - units
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
 *         description: unit not found
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
    const unit = await Unit.findOne({ where: { id } });
    if (!unit) {
      return res.status(404).json({ message: `unit is not found!` });
    }
    await Unit.softRemove(unit);
    res.status(204).json();
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
