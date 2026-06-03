import { useState, useEffect } from "react";

/**
 * Hook untuk memuat Midtrans Snap.js secara dinamis dan menyediakan
 * fungsi `pay()` untuk membuka popup pembayaran.
 */
export const useMidtrans = () => {
  const [isLoaded, setIsLoaded] = useState(() => !!window.snap);

  useEffect(() => {
    if (window.snap) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY || ""
    );

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Midtrans script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /**
   * Buka popup pembayaran Midtrans Snap
   * @param {string} token - Token pembayaran dari backend
   * @param {Function} onSuccess
   * @param {Function} onPending
   * @param {Function} onError
   * @param {Function} onClose
   */
  const pay = (token, onSuccess, onPending, onError, onClose) => {
    if (!window.snap) {
      console.error("Midtrans snap is not loaded yet");
      return;
    }

    window.snap.pay(token, {
      onSuccess: function (result) {
        if (onSuccess) onSuccess(result);
      },
      onPending: function (result) {
        if (onPending) onPending(result);
      },
      onError: function (result) {
        if (onError) onError(result);
      },
      onClose: function () {
        if (onClose) onClose();
      },
    });
  };

  return { isLoaded, pay };
};
