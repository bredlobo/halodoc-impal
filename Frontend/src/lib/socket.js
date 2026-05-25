import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:3001";

let socket = null;

/**
 * Returns the singleton socket instance.
 * Creates it on first call using the JWT token from localStorage.
 */
export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

/**
 * Disconnect and destroy the singleton (call on logout).
 */
export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
