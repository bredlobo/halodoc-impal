import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  createProductByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  getCart,
  addToCart,
  updateCartItem,
  checkout,
  updateOrderStatus,
} from "@/modules/Ecommerce/controllers/ecommerce-controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/ecommerce/products:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Ecommerce]
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
 *               - categoryId
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       "201":
 *         description: Product created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Admin Product Management
router.post(
  "/products",
  verifyToken,
  authorize(["ADMIN"]),
  createProductByAdmin,
);

/**
 * @swagger
 * /api/v1/ecommerce/products/{productId}:
 *   patch:
 *     summary: Update product (admin)
 *     tags: [Ecommerce]
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
 *             properties:
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       "200":
 *         description: Product updated
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Ecommerce]
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
 *     responses:
 *       "200":
 *         description: Product deleted
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  "/products/:productId",
  verifyToken,
  authorize(["ADMIN"]),
  updateProductByAdmin,
);
router.delete(
  "/products/:productId",
  verifyToken,
  authorize(["ADMIN"]),
  deleteProductByAdmin,
);

/**
 * @swagger
 * /api/v1/ecommerce/cart:
 *   get:
 *     summary: Get patient ecommerce cart
 *     tags: [Ecommerce]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Cart fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Add item to ecommerce cart
 *     tags: [Ecommerce]
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
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 minimum: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       "201":
 *         description: Item added to cart
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Cart Operations
router.get("/cart", verifyToken, authorize(["PATIENT"]), getCart);
router.post("/cart", verifyToken, authorize(["PATIENT"]), addToCart);

/**
 * @swagger
 * /api/v1/ecommerce/cart/{productId}:
 *   patch:
 *     summary: Update quantity of a cart item
 *     tags: [Ecommerce]
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       "200":
 *         description: Cart item updated
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
  "/cart/:productId",
  verifyToken,
  authorize(["PATIENT"]),
  updateCartItem,
);

/**
 * @swagger
 * /api/v1/ecommerce/checkout:
 *   post:
 *     summary: Checkout ecommerce cart
 *     tags: [Ecommerce]
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
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Checkout successful
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Order Operations
router.post("/checkout", verifyToken, authorize(["PATIENT"]), checkout);

/**
 * @swagger
 * /api/v1/ecommerce/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin)
 *     tags: [Ecommerce]
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
 *                 enum: [PENDING, PAID, SHIPPED, COMPLETED, CANCELLED]
 *     responses:
 *       "200":
 *         description: Order status updated
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
  "/orders/:id/status",
  verifyToken,
  authorize(["ADMIN"]),
  updateOrderStatus,
);

export default router;
