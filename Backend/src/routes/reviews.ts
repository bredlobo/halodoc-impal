import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  submitDoctorRating,
  submitProductRating,
  getAverageRating,
} from "@/modules/Reviews/controllers/reviews-controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/reviews/doctors/{doctorId}:
 *   post:
 *     summary: Submit rating for a doctor
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Rating submitted
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Submitting Ratings
router.post(
  "/doctors/:doctorId",
  verifyToken,
  authorize(["PATIENT"]),
  submitDoctorRating,
);

/**
 * @swagger
 * /api/v1/reviews/products/{productId}:
 *   post:
 *     summary: Submit rating for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Product rating submitted
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/products/:productId",
  verifyToken,
  authorize(["PATIENT"]),
  submitProductRating,
);

/**
 * @swagger
 * /api/v1/reviews/{type}/{targetId}/average:
 *   get:
 *     summary: Get average rating by target type and id
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [doctor, product]
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Average rating retrieved
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Fetching Average Ratings
router.get("/:type/:targetId/average", getAverageRating); // e.g. GET /api/v1/reviews/doctor/1/average

export default router;
