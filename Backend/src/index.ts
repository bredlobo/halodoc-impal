import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import userRoutes from "@/routes/users";
import pharmacyRoutes from "@/routes/pharmacy";
import consultationsRoutes from "@/routes/consultations";
import doctorsRoutes from "@/routes/doctors";
import { config } from "@/helpers/infra/global-config";
import { setupSwagger } from "@/docs/swagger";
import { initSocket } from "@/helpers/utils/socket";
import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";

const app: Application = express();
const httpServer = createServer(app);
const PORT = Number(config.express.port ?? "3000");
const HOST = config.express.host ?? "localhost";

const defaultCorsOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
//a
const configuredCorsOrigins =
  process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? defaultCorsOrigins;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Requests without an origin header (curl/postman/server-to-server) are allowed.
    if (!origin) {
      return callback(null, true);
    }

    if (configuredCorsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/pharmacy", pharmacyRoutes);
app.use("/api/v1/consultations", consultationsRoutes);
app.use("/api/v1/doctors", doctorsRoutes);

setupSwagger(app);
initSocket(httpServer, corsOptions);

// Clean up expired consultations on startup
ConsultationsRepository.cancelExpiredConsultations()
  .then((res) => {
    if (res.count > 0) {
      console.log(`Cleaned up ${res.count} expired requested consultations.`);
    }
  })
  .catch((err) => {
    console.error("Failed to clean up expired consultations on startup", err);
  });

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
