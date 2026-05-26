import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../lib/socket";

/**
 * Custom hook that manages the full socket lifecycle for a single consultation room.
 *
 * @param {number|string|null} consultationId  - The active consultation ID (or null to stay disconnected)
 * @param {Array}              initialMessages - Pre-fetched chat history from the REST API
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

  // Sync initialMessages when they change (e.g. REST history loaded after mount)
  useEffect(() => {
    setMessages(initialMessages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialMessages?.map((m) => m.id))]);

  useEffect(() => {
    if (!consultationId) return;

    const socket = getSocket(); // always gets latest token via singleton

    // ── connect ───────────────────────────────────────────────────────
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
      // Server forced disconnect (e.g. kicked out) — try to reconnect
      if (reason === "io server disconnect") {
        setTimeout(() => {
          const s = getSocket();
          if (!s.connected) s.connect();
        }, 1000);
      }
    };

    const handleConnectError = (err) => {
      const msg = err?.message || "Gagal terhubung ke server";

      // Token expired / invalid → refresh page as last resort
      if (msg.includes("Invalid token") || msg.includes("Authentication error")) {
        setConnectionError("Sesi habis — silakan refresh halaman");
      } else {
        setConnectionError(msg);
      }
      setIsConnected(false);
    };

    const handleReconnect = () => {
      setConnectionError(null);
    };

    // ── incoming messages ─────────────────────────────────────────────
    const handleReceiveMessage = (message) => {
      if (
        message.consultationId === undefined ||
        String(message.consultationId) === String(consultationIdRef.current)
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
    socket.on("reconnect", handleReconnect);
    socket.on("receive_message", handleReceiveMessage);

    // If already connected, join room immediately
    if (socket.connected) {
      setIsConnected(true);
      setConnectionError(null);
      socket.emit("join_consultation", consultationId);
    }

    // ── cleanup ───────────────────────────────────────────────────────
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [consultationId]);

  const sendMessage = useCallback((content) => {
    // Actual send is done via REST (useApiMutation) in the component.
    // This hook manages receiving only.
    void content;
  }, []);

  return { messages, sendMessage, isConnected, connectionError };
}
