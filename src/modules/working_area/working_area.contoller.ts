import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { addWorkingAreaValidation } from "../../core/validators/working_area/addWorkingArea.validator";
import { WorkingArea } from "../../infrastructure/entities/working_area/working_area.entity";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     WorkingArea:
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
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         url:
 *           type: string
 *           format: url
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateWorkingAreaRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the working area
 *         description:
 *           type: string
 *           description: Description of the working area
 *         url:
 *           type: string
 *           format: url
 *           description: URL of the working area
 *     UpdateWorkingAreaRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the working area
 *         description:
 *           type: string
 *           description: Description of the working area
 *         url:
 *           type: string
 *           format: url
 *           description: URL of the working area
 *     WorkingAreaResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkingArea'
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
 * /api/workingarea:
 *   post:
 *     tags:
 *       - Working Areas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkingAreaRequest'
 *     responses:
 *       '201':
 *         description: Successful response
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
 */

router.post(
  "/",
  addWorkingAreaValidation,
  async (req: Request, res: Response) => {
    try {
      const { name, description, url } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const workingarea = await WorkingArea.create({
        name,
        description,
        url,
      }).save();
      res.status(201).json(workingarea);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
);

/**
 * @swagger
 * /api/workingarea:
 *   get:
 *     tags:
 *       - Working Areas
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkingAreaResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", async (req, res) => {
  try {
    const workingArea = await WorkingArea.find({
      relations: { properties: true },
    });
    res.status(200).json({ data: workingArea });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/workingarea/{name}:
 *   get:
 *     tags:
 *       - Working Areas
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
 *               $ref: '#/components/schemas/WorkingAreaResponse'
 *       '404':
 *         description: Working area not found
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
    const workingArea = await WorkingArea.findOne({
      where: { name },
      relations: { properties: { units: true } },
    });
    res.status(200).json({ data: workingArea });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/workingarea/{id}:
 *   put:
 *     tags:
 *       - Working Areas
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
 *             $ref: '#/components/schemas/UpdateWorkingAreaRequest'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Working area not found
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
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workingArea = await WorkingArea.findOne({ where: { id } });
    if (!workingArea) {
      return res.status(404).json({ message: `workingArea is not found!` });
    }

    await WorkingArea.update(id, req.body);
    res.status(200).json({ message: "Working area is updated!" });
  } catch (e) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

/**
 * @swagger
 * /api/workingarea/{id}:
 *   delete:
 *     tags:
 *       - Working Areas
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
 *         description: Working area not found
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
    const workingArea = await WorkingArea.findOne({ where: { id } });
    if (!workingArea) {
      return res.status(404).json({ message: `workingArea is not found!` });
    }
    const timestamp = new Date().getTime();
    workingArea.name = workingArea.name + "_d" + `${timestamp}`;
    await workingArea.save();
    await WorkingArea.softRemove(workingArea);
    res.status(204).json();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
