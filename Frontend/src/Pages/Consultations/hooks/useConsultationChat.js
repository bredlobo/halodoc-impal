import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../../../lib/socket";

/**
 * Custom hook yang mengelola lifecycle socket untuk satu consultation room.
 *
 * @param {number|string|null} consultationId  - ID konsultasi aktif (null = disconnect)
 * @param {Array}              initialMessages - Chat history dari REST API
 */
export function useConsultationChat(consultationId, initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Ref agar event handler selalu melihat consultationId terbaru
  const consultationIdRef = useRef(consultationId);
  useEffect(() => {
    consultationIdRef.current = consultationId;
  }, [consultationId]);

  // Sync initialMessages saat berubah (misal REST history dimuat setelah mount)
  useEffect(() => {
    setMessages(initialMessages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialMessages?.map((m) => m.id))]);

  useEffect(() => {
    if (!consultationId) return;

    const socket = getSocket();

    // ── Connect ─────────────────────────────────────────────────────────
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      socket.emit("join_consultation", consultationId);
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        setTimeout(() => {
          const s = getSocket();
          if (!s.connected) s.connect();
        }, 1000);
      }
    };

    const handleConnectError = (err) => {
      const msg = err?.message || "Gagal terhubung ke server";
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

    // ── Incoming messages ────────────────────────────────────────────────
    const handleReceiveMessage = (message) => {
      if (
        message.consultationId === undefined ||
        String(message.consultationId) === String(consultationIdRef.current)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect", handleReconnect);
    socket.on("receive_message", handleReceiveMessage);

    // Jika sudah terkoneksi, langsung join room
    if (socket.connected) {
      setIsConnected(true);
      setConnectionError(null);
      socket.emit("join_consultation", consultationId);
    }

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [consultationId]);

  const sendMessage = useCallback((content) => {
    // Pengiriman pesan dilakukan via REST (useApiMutation) di component.
    // Hook ini hanya menangani penerimaan pesan real-time.
    void content;
  }, []);

  return { messages, sendMessage, isConnected, connectionError };
}
