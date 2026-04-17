import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  createCategory,
  getProductsByCategory,
  createProduct,
  updateStock,
  updatePrice,
  checkAvailability,
} from "@/modules/Pharmacy/controllers/pharmacy-controllers";
import {
  getMyCart,
  addItemToCart,
  removeCartItem,
  checkoutCart,
} from "@/modules/Pharmacy/controllers/cart-controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/pharmacy/categories:
 *   post:
 *     summary: Create product category
 *     tags: [Pharmacy]
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
 *         description: Category created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Category Routes
router.post("/categories", verifyToken, authorize(["ADMIN"]), createCategory);

/**
 * @swagger
 * /api/v1/pharmacy/categories/{categoryId}/products:
 *   get:
 *     summary: Get products by category
 *     tags: [Pharmacy]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Products fetched
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Product Routes
router.get("/categories/:categoryId/products", getProductsByCategory);

/**
 * @swagger
 * /api/v1/pharmacy/products:
 *   post:
 *     summary: Create pharmacy product
 *     tags: [Pharmacy]
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
router.post("/products", verifyToken, authorize(["ADMIN"]), createProduct);

/**
 * @swagger
 * /api/v1/pharmacy/products/{productId}/stock:
 *   patch:
 *     summary: Update product stock
 *     tags: [Pharmacy]
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
 *     responses:
 *       "200":
 *         description: Stock updated
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
  "/products/:productId/stock",
  verifyToken,
  authorize(["ADMIN"]),
  updateStock,
);

/**
 * @swagger
 * /api/v1/pharmacy/products/{productId}/price:
 *   patch:
 *     summary: Update product price
 *     tags: [Pharmacy]
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
 *               - newPrice
 *             properties:
 *               newPrice:
 *                 type: number
 *     responses:
 *       "200":
 *         description: Price updated
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
  "/products/:productId/price",
  verifyToken,
  authorize(["ADMIN"]),
  updatePrice,
);

/**
 * @swagger
 * /api/v1/pharmacy/products/{productId}/availability:
 *   get:
 *     summary: Check product availability
 *     tags: [Pharmacy]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: requiredQty
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Availability checked
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/products/:productId/availability", checkAvailability);

/**
 * @swagger
 * /api/v1/pharmacy/cart:
 *   get:
 *     summary: Get patient pharmacy cart
 *     tags: [Pharmacy]
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
 */
// Cart Routes
router.get("/cart", verifyToken, authorize(["PATIENT"]), getMyCart);

/**
 * @swagger
 * /api/v1/pharmacy/cart/items:
 *   post:
 *     summary: Add item to pharmacy cart
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemRequest'
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
router.post("/cart/items", verifyToken, authorize(["PATIENT"]), addItemToCart);

/**
 * @swagger
 * /api/v1/pharmacy/cart/items/{cartItemId}:
 *   delete:
 *     summary: Remove item from pharmacy cart
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: Item removed
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/UnauthorizedError'
 *       "403":
 *         $ref: '#/components/responses/ForbiddenError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  "/cart/items/:cartItemId",
  verifyToken,
  authorize(["PATIENT"]),
  removeCartItem,
);

/**
 * @swagger
 * /api/v1/pharmacy/cart/checkout:
 *   post:
 *     summary: Checkout pharmacy cart
 *     tags: [Pharmacy]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
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
router.post(
  "/cart/checkout",
  verifyToken,
  authorize(["PATIENT"]),
  checkoutCart,
);

export default router;
