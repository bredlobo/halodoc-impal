import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { CorsOptions } from "cors";
import jwt from "jsonwebtoken";
import { config } from "@/helpers/infra/global-config";

let io: Server;

export const initSocket = (server: HttpServer, corsOptions: CorsOptions) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.use((socket: Socket, next) => {
    // Try to get token from auth object (standard client) OR query string (Postman)
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow connections but without attaching user data if no token,
      // or enforce auth? Requirement says "This requires socket authentication"
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const jwtSecret =
        config.key.jwtSecret || config.key.privateKey || "dev-secret";
      const decoded = jwt.verify(token, jwtSecret) as { userId: number };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    if (socket.data.userId) {
      socket.join(`user_${socket.data.userId}`);
      console.log(`User ${socket.id} joined room user_${socket.data.userId}`);
    }

    /*
      Available Socket Events & Rooms:
      - new_consultation_request : room `user_{doctorId}`
        payload: { consultationId, patientName, expiresAt, remainingSeconds }
      - consultation_accepted    : room `user_{patientId}`
        payload: { consultationId, doctorName }
      - consultation_declined    : room `user_{patientId}`
        payload: { consultationId, message }
      - consultation_timeout     : room `user_{patientId}`
        payload: { consultationId, message }
      - consultation_started     : room `consultation_{id}`
        payload: { consultationId, startTime }
      - receive_message          : room `consultation_{id}`
      - prescription_ready       : room `user_{patientId}`
    */

    // Join a specific consultation room
    socket.on("join_consultation", (consultationId: number | string) => {
      const room = `consultation_${consultationId}`;
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from socket: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.io is not initialized! Ensure initSocket is called first.",
    );
  }
  return io;
};

export const emitMessageSafely = (consultationId: number, data: any) => {
  try {
    getIO().to(`consultation_${consultationId}`).emit("receive_message", data);
  } catch (socketErr) {
    console.error(
      `Socket error: ${socketErr instanceof Error ? socketErr.message : String(socketErr)}`,
    );
  }
};
