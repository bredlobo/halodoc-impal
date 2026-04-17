import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";
import { config } from "@/helpers/infra/global-config";

const port = config.express.port ?? "3000";
const host = config.express.host ?? "localhost";

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMPAL Backend API Docs",
      version: "1.0.0",
      description: "API documentation for IMPAL backend services",
    },
    servers: [
      {
        url: `http://${host}:${port}`,
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "JWT access token sent via httpOnly cookie",
        },
        refreshCookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "JWT refresh token sent via httpOnly cookie",
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "Authentication and user management endpoints",
      },
      {
        name: "Doctors",
        description: "Doctor profile and specialization management",
      },
      {
        name: "Consultations",
        description: "Consultation, chat, and prescription operations",
      },
      {
        name: "Pharmacy",
        description: "Pharmacy products, stock, and cart checkout",
      },
      {
        name: "Ecommerce",
        description: "General ecommerce product, cart, and order flows",
      },
      {
        name: "Reviews",
        description: "Doctor and product rating endpoints",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", ...swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://${host}:${port}/api-docs`);
};
