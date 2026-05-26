import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:3001";

let socket = null;

/**
 * Returns the singleton socket instance.
 * Always reads the latest token from localStorage so reconnections
 * after login or token refresh work correctly.
 */
export function getSocket() {
  const token = localStorage.getItem("token");

  if (socket) {
    // If socket exists but token has changed (e.g. after re-login),
    // update auth and reconnect so the server sees the new token.
    if (socket.auth?.token !== token) {
      socket.auth = { token };
      // If already connected with wrong token, reconnect
      if (socket.connected) {
        socket.disconnect();
        socket.connect();
      }
    }
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  // Always send the latest token on every reconnect attempt
  socket.on("reconnect_attempt", () => {
    socket.auth = { token: localStorage.getItem("token") };
  });

  return socket;
}

/**
 * Update the token on the existing socket (e.g. after a token refresh).
 * Reconnects so the server validates the new token.
 */
export function updateSocketToken(newToken) {
  if (!socket) return;
  socket.auth = { token: newToken };
  if (socket.connected) {
    socket.disconnect();
    socket.connect();
  }
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
