import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  createSpecialization,
  getAllSpecializations,
  getDoctorsBySpecialization,
  updateCredentials,
  updatePhoto,
  getConsultationHistory,
  getAllDoctors,
  getDoctorById,
} from "@/modules/Doctors/controllers/doctors-controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security: []
 *     responses:
 *       "200":
 *         description: Doctors fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", getAllDoctors);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   get:
 *     summary: Get doctor by id
 *     tags: [Doctors]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Doctor fetched
 *       "404":
 *         $ref: '#/components/responses/NotFoundError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", getDoctorById);

/**
 * @swagger
 * /api/v1/doctors/specializations:
 *   get:
 *     summary: Get all doctor specializations
 *     tags: [Doctors]
 *     security: []
 *     responses:
 *       "200":
 *         description: Specializations fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Create doctor specialization
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Specialization created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Specializations
router.get("/specializations", getAllSpecializations);

router.post(
  "/specializations",
  verifyToken,
  authorize(["ADMIN"]),
  createSpecialization,
);

/**
 * @swagger
 * /api/v1/doctors/specializations/{specId}/doctors:
 *   get:
 *     summary: Get doctors by specialization
 *     tags: [Doctors]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: specId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Doctors fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/specializations/:specId/doctors", getDoctorsBySpecialization);

/**
 * @swagger
 * /api/v1/doctors/credentials:
 *   patch:
 *     summary: Update doctor credentials
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strNumber
 *             properties:
 *               strNumber:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Credentials updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Doctor Profile Settings
router.patch(
  "/credentials",
  verifyToken,
  authorize(["DOCTOR"]),
  updateCredentials,
);

/**
 * @swagger
 * /api/v1/doctors/photo:
 *   patch:
 *     summary: Update doctor profile photo
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       "200":
 *         description: Photo updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch("/photo", verifyToken, authorize(["DOCTOR"]), updatePhoto);

/**
 * @swagger
 * /api/v1/doctors/consultations/history:
 *   get:
 *     summary: Get doctor consultation history
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Consultation history retrieved
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/consultations/history",
  verifyToken,
  authorize(["DOCTOR"]),
  getConsultationHistory,
);

export default router;
