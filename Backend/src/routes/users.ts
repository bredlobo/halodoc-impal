import { Request, Response, Router } from "express";
import {
  getAllUsers,
  userEdit,
  userLogin,
  userLogout,
  userRegister,
  refreshToken,
} from "@/modules/Users/controllers/users-controllers";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";

const router = Router();

/**
 * @swagger
 * /api/v1/users/health:
 *   get:
 *     summary: Users route health check
 *     tags: [Users]
 *     security: []
 *     responses:
 *       "200":
 *         description: Health check success
 */
router.get("/health", (req: Request, res: Response) => {
  const tes = req.body;
  console.log(tes);
  res.status(200).json({ message: "Hello, world!" });
});

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       "201":
 *         description: User created successfully
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "409":
 *         $ref: '#/components/responses/ConflictError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/register", userRegister("PATIENT"));

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login a user
 *     description: Returns access and refresh tokens in the response body and sets both as httpOnly cookies.
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserRequest'
 *     responses:
 *       "200":
 *         description: Login successful and auth cookies are set
 *         headers:
 *           Set-Cookie:
 *             description: accessToken and refreshToken httpOnly cookies
 *             schema:
 *               type: string
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "404":
 *         $ref: '#/components/responses/NotFoundError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/login", userLogin);

/**
 * @swagger
 * /api/v1/users/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Uses refreshToken cookie by default (request body fallback is supported for backward compatibility) and rotates both auth cookies.
 *     tags: [Users]
 *     security:
 *       - refreshCookieAuth: []
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       "200":
 *         description: Token refreshed successfully and auth cookies are rotated
 *         headers:
 *           Set-Cookie:
 *             description: refreshed accessToken and refreshToken httpOnly cookies
 *             schema:
 *               type: string
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout current user
 *     description: Clears accessToken and refreshToken cookies.
 *     tags: [Users]
 *     security: []
 *     responses:
 *       "200":
 *         description: Logout successful and auth cookies cleared
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/logout", userLogout);

/**
 * @swagger
 * /api/v1/users/admin/doctors:
 *   post:
 *     summary: Admin creates a doctor account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       "201":
 *         description: Doctor account created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "409":
 *         $ref: '#/components/responses/ConflictError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/admin/doctors",
  verifyToken,
  authorize(["ADMIN"]),
  userRegister("DOCTOR"),
);

/**
 * @swagger
 * /api/v1/users/admin/admins:
 *   post:
 *     summary: Admin creates another admin account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       "201":
 *         description: Admin account created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "409":
 *         $ref: '#/components/responses/ConflictError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/admin/admins",
  verifyToken,
  authorize(["ADMIN"]),
  userRegister("ADMIN"),
);

/**
 * @swagger
 * /api/v1/users/edit:
 *   post:
 *     summary: Edit current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditUserRequest'
 *     responses:
 *       "200":
 *         description: User updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *       "503":
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
router.post("/edit", verifyToken, userEdit);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Users fetched
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", verifyToken, authorize(["ADMIN"]), getAllUsers);

export default router;
