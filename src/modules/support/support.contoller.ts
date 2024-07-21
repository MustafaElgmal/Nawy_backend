import { Router, Request, Response } from "express";
import { addSupportValidation } from "../../core/validators/support/addSupport.validator";
import { Support } from "../../infrastructure/entities/support/support.entity";
import { updateSupportValidation } from "../../core/validators/support/updateSupport.validator";
import { validationResult } from "express-validator";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Support:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         whatsApp_phone:
 *           type: string
 *         phone_number:
 *           type: string
 *         mail_us:
 *           type: string
 *           format: url
 *     CreateSupportRequest:
 *       type: object
 *       properties:
 *         whatsApp_phone:
 *           type: string
 *           description: WhatsApp_phone of the support
 *         phone_number:
 *           type: string
 *           description: Phone_number of the support
 *         mail_us:
 *           type: string
 *           format: url
 *           description: Mail_us of the support
 *     UpdateSupportRequest:
 *       type: object
 *       properties:
 *         whatsApp_phone:
 *           type: string
 *         phone_number:
 *           type: string
 *         mail_us:
 *           type: string
 *           format: url
 *     SupportResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Support'
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
 * /api/support:
 *   post:
 *     summary: Add a new support
 *     tags:
 *       - support
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupportRequest'
 *     responses:
 *       '201':
 *         description: Support created successfully
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
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.post("/", addSupportValidation, async (req: Request, res: Response) => {
  try {
    const { whatsApp_phone, phone_number, mail_us } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await Support.create({
      whatsApp_phone,
      phone_number,
      mail_us,
    }).save();
    res.status(201).json({ message: `support is created!` });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Get all support entities
 *     tags:
 *       - support
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", async (req, res) => {
  try {
    const support = await Support.find();
    res.status(200).json({ data: support });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/support/{id}:
 *   put:
 *     summary: Update a support entity by ID
 *     tags:
 *       - support
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
 *             $ref: '#/components/schemas/UpdateSupportRequest'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Support entity not found
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
  updateSupportValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const support = await Support.findOne({ where: { id } });
      if (!support) {
        return res.status(404).json({ message: `support is not found!` });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      await Support.update(id, req.body);
      res.status(200).json({ message: `support is updated!` });
    } catch (e) {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

export default router;
