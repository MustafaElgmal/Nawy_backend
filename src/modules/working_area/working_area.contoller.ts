import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { addWorkingAreaValidation } from "../../core/validators/working_area/addWorkingArea.validator";
import { WorkingArea } from "../../infrastructure/entities/working_area/working_area.entity";

const router = Router();
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
 *             $ref: '#/components/schemas/WorkingAreaInput'
 *     responses:
 *       '201':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkingArea'
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
 *     WorkingAreaInput:
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
 *       required:
 *         - name
 *         - description
 *         - url
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

      const workingarea=await WorkingArea.create({
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
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkingArea'
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
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         status:
 *           type: integer
 *           description: HTTP status code
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
 *               $ref: '#/components/schemas/WorkingArea'
 *       '404':
 *         description: Working area not found
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
 *     WorkingArea:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the working area
 *         name:
 *           type: string
 *           description: Name of the working area
 *         description:
 *           type: string
 *           description: Description of the working area
 *         url:
 *           type: string
 *           format: uri
 *           description: URL of the working area
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the working area was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the working area was last updated
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
 *             $ref: '#/components/schemas/UpdateWorkingArea'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkingArea'
 *       '404':
 *         description: Working area not found
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
 *     UpdateWorkingArea:
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
 *           format: uri
 *           description: URL of the working area
 *     WorkingArea:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the working area
 *         name:
 *           type: string
 *           description: Name of the working area
 *         description:
 *           type: string
 *           description: Description of the working area
 *         url:
 *           type: string
 *           format: uri
 *           description: URL of the working area
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the working area was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the working area was last updated
 */
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workingArea = await WorkingArea.findOne({ where: { id } });
    if (!workingArea) {
      return res.status(404).json({ message: `workingArea is not found!` });
    }

    await WorkingArea.update(id, req.body);
    res.status(200).json(workingArea );
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
    const workingArea = await WorkingArea.findOne({ where: { id } });
    if (!workingArea) {
      return res.status(404).json({ message: `workingArea is not found!` });
    }
    const timestamp = new Date().getTime();
    workingArea.name = workingArea.name + "_d" + `${timestamp}`;
    await workingArea.save();
    await WorkingArea.softRemove(workingArea);
    res.status(200).json({ message: `workingArea is deleted!` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
