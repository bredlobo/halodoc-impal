import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../lib/socket";

/**
 * @typedef {Object} Message
 * @property {number}  id
 * @property {number}  consultationId
 * @property {number}  senderId
 * @property {string}  content
 * @property {string}  timestamp
 */

/**
 * Custom hook that manages the full socket lifecycle for a single consultation room.
 *
 * @param {number|string|null} consultationId  - The active consultation ID (or null to stay disconnected)
 * @param {Message[]}          initialMessages - Pre-fetched chat history from the REST API
 * @returns {{
 *   messages: Message[],
 *   sendMessage: (content: string) => void,
 *   isConnected: boolean,
 *   connectionError: string|null,
 * }}
 */
export function useConsultationChat(consultationId, initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Keep a ref so event handlers always see the latest consultationId
  const consultationIdRef = useRef(consultationId);
  useEffect(() => {
    consultationIdRef.current = consultationId;
  }, [consultationId]);

  // Sync initialMessages when they change (e.g. REST history loaded)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (!consultationId) return;

    const socket = getSocket();

    // ── connect / reconnect ──────────────────────────────────────────
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      // Join the private room for this consultation
      socket.emit("join_consultation", consultationId);
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // Server forcefully disconnected us → manual reconnect
        socket.connect();
      }
    };

    const handleConnectError = (err) => {
      setConnectionError(err.message || "Gagal terhubung ke server");
      setIsConnected(false);
    };

    // ── incoming messages ────────────────────────────────────────────
    const handleReceiveMessage = (message) => {
      // Only append if the message belongs to the current room
      if (
        message.consultationId === undefined ||
        message.consultationId === consultationIdRef.current
      ) {
        setMessages((prev) => {
          // Deduplicate by id
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    // Register listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receive_message", handleReceiveMessage);

    // If already connected, join room immediately
    if (socket.connected) {
      setIsConnected(true);
      socket.emit("join_consultation", consultationId);
    }

    // ── cleanup ──────────────────────────────────────────────────────
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receive_message", handleReceiveMessage);
      // Leave the room (best-effort; server will clean up on disconnect too)
      socket.emit("leave_consultation", consultationId);
    };
  }, [consultationId]);

  /**
   * Send a message via the REST API.
   * The response is broadcast by the backend via `emitMessageSafely`
   * so we DON'T optimistically push here — we wait for the socket event.
   *
   * The caller (component) is responsible for making the REST call;
   * this helper exists so components don't need to import socket directly.
   */
  const sendMessage = useCallback(
    (content) => {
      // No-op: actual send is done via REST in the component using useApiMutation.
      // This hook only manages receiving.  Kept for API symmetry in case you
      // want to switch to pure-socket messaging later.
      void content;
    },
    [],
  );

  return { messages, sendMessage, isConnected, connectionError };
}
