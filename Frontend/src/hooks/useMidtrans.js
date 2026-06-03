import { useState, useEffect } from "react";

export const useMidtrans = () => {
  const [isLoaded, setIsLoaded] = useState(() => !!window.snap);

  useEffect(() => {
    // If already loaded
    if (window.snap) {
      return;
    }

    const script = document.createElement("script");
    // Use sandbox for development, switch to production url if needed
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    // Client key should ideally come from env
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
    
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
