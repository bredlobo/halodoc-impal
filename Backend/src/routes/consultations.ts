import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  requestConsultation,
  respondToConsultation,
  updateStatus,
  processPayment,
  midtransWebhook,
  getChatHistory,
  sendMessage,
  generatePrescription,
  updatePrescriptionNotes,
  addPrescriptionItem,
  removePrescriptionItem,
  getConsultationById,
} from "@/modules/Consultations/controllers/consultations-controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/consultations/request:
 *   post:
 *     summary: Request a new consultation
 *     tags: [Consultations]
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
 *               - doctorId
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       "201":
 *         description: Consultation requested
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Consultations
router.post(
  "/request",
  verifyToken,
  authorize(["PATIENT"]),
  requestConsultation,
);

/**
 * @swagger
 * /api/v1/consultations/{id}/respond:
 *   patch:
 *     summary: Respond to a consultation request (Accept/Decline)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [ACCEPT, DECLINE]
 *     responses:
 *       "200":
 *         description: Consultation responded to
 */
router.patch(
  "/:id/respond",
  verifyToken,
  authorize(["DOCTOR"]),
  respondToConsultation,
);

/**
 * @swagger
 * /api/v1/consultations/{id}/status:
 *   patch:
 *     summary: Update consultation status
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [REQUESTED, ONGOING, COMPLETED, CANCELLED]
 *     responses:
 *       "200":
 *         description: Consultation status updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  "/:id/status",
  verifyToken,
  authorize(["PATIENT", "DOCTOR", "ADMIN"]),
  updateStatus,
);

/**
 * @swagger
 * /api/v1/consultations/{id}:
 *   get:
 *     summary: Get consultation details by ID
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Consultation details fetched
 */
router.get(
  "/:id",
  verifyToken,
  authorize(["PATIENT", "DOCTOR", "ADMIN"]),
  getConsultationById,
);

/**
 * @swagger
 * /api/v1/consultations/{id}/payment:
 *   post:
 *     summary: Mark consultation payment as paid
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Payment processed
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/:id/payment",
  verifyToken,
  authorize(["PATIENT"]),
  processPayment,
);

/**
 * @swagger
 * /api/v1/consultations/webhook:
 *   post:
 *     summary: Midtrans webhook handler
 *     tags: [Consultations]
 *     responses:
 *       "200":
 *         description: Webhook processed
 */
router.post("/webhook", midtransWebhook);

/**
 * @swagger
 * /api/v1/consultations/{id}/messages:
 *   get:
 *     summary: Get consultation chat history
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Chat history fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Send chat message in consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       "201":
 *         description: Message sent
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Chat Messages
router.get(
  "/:id/messages",
  verifyToken,
  authorize(["PATIENT", "DOCTOR"]),
  getChatHistory,
);
router.post(
  "/:id/messages",
  verifyToken,
  authorize(["PATIENT", "DOCTOR"]),
  sendMessage,
);

/**
 * @swagger
 * /api/v1/consultations/{id}/prescriptions:
 *   post:
 *     summary: Generate prescription for consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Prescription generated
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Prescriptions
router.post(
  "/:id/prescriptions",
  verifyToken,
  authorize(["DOCTOR"]),
  generatePrescription,
);

/**
 * @swagger
 * /api/v1/consultations/prescriptions/{prescriptionId}/notes:
 *   patch:
 *     summary: Update prescription notes
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
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
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Prescription notes updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  "/prescriptions/:prescriptionId/notes",
  verifyToken,
  authorize(["DOCTOR"]),
  updatePrescriptionNotes,
);

/**
 * @swagger
 * /api/v1/consultations/prescriptions/{prescriptionId}/items:
 *   post:
 *     summary: Add item to prescription
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
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
 *               - productId
 *               - dosage
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 minimum: 1
 *               dosage:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       "201":
 *         description: Prescription item added
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
  "/prescriptions/:prescriptionId/items",
  verifyToken,
  authorize(["DOCTOR"]),
  addPrescriptionItem,
);

/**
 * @swagger
 * /api/v1/consultations/prescriptions/items/{itemId}:
 *   delete:
 *     summary: Remove item from prescription
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Prescription item removed
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  "/prescriptions/items/:itemId",
  verifyToken,
  authorize(["DOCTOR"]),
  removePrescriptionItem,
);

export default router;
