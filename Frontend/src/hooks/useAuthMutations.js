import { useMutation } from "@tanstack/react-query";
import http from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const api = import.meta.env.VITE_API_BASE_URL ?? "";
export const Login = async (email, password) => {
  try {
    const userLogin = await http.post(`${api}/users/login`, {
      email,
      password,
    });

    return userLogin.data.data || userLogin.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      throw error.response.data.errors;
    }

    throw new Error(error.response?.data?.message || "Login gagal");
  }
};

export const useLogin = () => {
  const { login } = useAuth(); 

  return useMutation({
    mutationKey: ["login"],
    mutationFn: ({ email, password }) => Login(email, password),
    onSuccess: (data) => {
      const user = data.user || data;
      const token = data.token || data.access_token || null;

      login(user, token);
    }
  });
};

export const Register = async (formData) => {
  try {
    const response = await http.post(`${api}/users/register`, formData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      throw error.response.data.errors;
    }

    throw new Error(error.response?.data?.message || "Register gagal");
  }
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: Register,
  });
};

export const Logout = async () => {
  try {
    await http.post(`/api/v1/users/logout`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout gagal");
  }
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: Logout,
  });
};

export const Refresh = async () => {
  try {
    const res = await http.post(`${api}/users/refresh`, {});
    return res.data?.data?.accessToken || res.data?.accessToken;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Refresh gagal");
  }
};

export const useRefresh = () => {
  return useMutation({
    mutationKey: ["refresh"],
    mutationFn: Refresh,
  });
};
