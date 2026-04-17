import http from "./axios";

export async function apiFetch(url, options = {}) {
  const { method = "GET", body, headers = {}, ...restOptions } = options;

  try {
    const response = await http({
      url,
      method,
      data: body,
      headers,
      ...restOptions,
    });

    return response.data;
  } catch (error) {
    const requestError = new Error(
      error?.response?.data?.message ||
      error?.response?.statusText ||
      error?.message ||
      "Request failed"
    );

    requestError.status = error?.response?.status;
    requestError.data = error?.response?.data;

    throw requestError;
  }
}
