import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
const loginRedirectPath = "/auth";

const isAuthRequest = (requestUrl = "") => {
  return /\/users\/(login|register|refresh)\b/.test(requestUrl);
};

const getAccessToken = () => localStorage.getItem("token");

const http = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${apiBase}/users/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newToken =
          refreshResponse.data?.token ||
          refreshResponse.data?.data?.token ||
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.access_token;

        if (newToken) {
          localStorage.setItem("token", newToken);

          // Also update the socket singleton so it uses the new token on next connect
          try {
            const { updateSocketToken } = await import("./socket");
            updateSocketToken(newToken);
          } catch {
            // socket lib may not be loaded yet — safe to ignore
          }

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return http(originalRequest);
        }

        throw new Error("No token in refresh response");
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes(loginRedirectPath)) {
          window.location.assign(loginRedirectPath);
        }

        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);

export default http;