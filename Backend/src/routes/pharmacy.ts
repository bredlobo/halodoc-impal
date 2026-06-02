import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt";
import { authorize } from "@/middlewares/authorization";
import {
  getAllProducts,
  getProductById,
  getAllCategories,
  createCategory,
  getProductsByCategory,
  createProduct,
  updateStock,
  updatePrice,
  checkAvailability,
} from "@/modules/Pharmacy/controllers/pharmacy-controllers";

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
/**
 * @swagger
 * /api/v1/pharmacy/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Pharmacy]
 *     security: []
 *     responses:
 *       "200":
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/categories", getAllCategories);

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
/**
 * @swagger
 * /api/v1/pharmacy/products:
 *   get:
 *     summary: Get all products with optional filters and sorting
 *     tags: [Pharmacy]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name or description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, name, createdAt, stock]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       "200":
 *         description: Products fetched successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
// Product Routes
router.get("/products", getAllProducts);
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
/**
 * @swagger
 * /api/v1/pharmacy/products/{productId}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Pharmacy]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The product ID
 *     responses:
 *       "200":
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     stock:
 *                       type: integer
 *                     imageUrl:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       "400":
 *         $ref: '#/components/responses/BadRequestError'
 *       "404":
 *         $ref: '#/components/responses/NotFoundError'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/products/:productId", getProductById);

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
export default router;
