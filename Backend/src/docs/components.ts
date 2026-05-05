/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "password123"
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           example: "password123"
 *         telephoneNumber:
 *           type: string
 *           pattern: '^\\+?[0-9]{8,15}$'
 *           example: "+628123456789"
 *         dob:
 *           type: string
 *           format: date
 *           example: "2026-04-01"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *         specializationId:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *           description: Required when creating a DOCTOR account
 *         strNumber:
 *           type: string
 *           example: "STR-123456789"
 *           description: Required when creating a DOCTOR account
 *
 *     LoginUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "password123"
 *
 *     EditUserRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           example: "John Doe Edited"
 *         telephoneNumber:
 *           type: string
 *           pattern: '^\\+?[0-9]{8,15}$'
 *           example: "+628123456789"
 *         dob:
 *           type: string
 *           format: date
 *           example: "2026-04-01"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *         specializationId:
 *           type: integer
 *           minimum: 1
 *         strNumber:
 *           type: string

 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           minLength: 1
 *           description: Optional in practice when refreshToken cookie is present
 *
 *     AddCartItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - shippingAddress
 *       properties:
 *         shippingAddress:
 *           type: string
 *           minLength: 8
 *           example: "123 Main Street, City"
 *
 *   responses:
 *     BadRequestError:
 *       description: Incomplete or invalid payload / logic failure
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Bad Request or Validation Error"
 *
 *     ValidationError:
 *       description: Validation Error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "email tidak valid"
 *
 *     UnauthorizedError:
 *       description: Missing or invalid authentication token, or invalid credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *
 *     ForbiddenError:
 *       description: User does not have the required role privileges
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Forbidden"
 *
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Not Found"
 *
 *     ConflictError:
 *       description: Conflict (e.g. Email already in use)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Conflict"
 *
 *     InternalServerError:
 *       description: Unexpected server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Internal Server Error"
 *
 *     ServiceUnavailable:
 *       description: Service Unavailable / Feature not implemented
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Service Unavailable"
 */
