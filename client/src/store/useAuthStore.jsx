import Cookies from "js-cookie";
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/services";
import { Navigate } from "react-router-dom";

export const useAuthStore = create((set) => ({
  userData: null,
  isUserAuth: true,
  isAuthLoading: null,

  userAuthCheck: async () => {
    try {
      const response = await axiosInstance.get("/api/auth/me");
      set({ userData: response.data.data });
    } catch (error) {
      set({ userData: null });
      Promise.reject(error);
    } finally {
      set({ isUserAuth: false });
    }
  },

  userSignUp: async (formData) => {
    try {
      set({ isAuthLoading: true });
      const response = await axiosInstance.post("/api/auth/signup", formData);
      toast.success(response.data.message);
      <Navigate to="/signin" />;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isAuthLoading: false });
    }
  },

  userSignIn: async (formData) => {
    try {
      set({ isAuthLoading: true });
      const response = await axiosInstance.post("/api/auth/signin", formData);
      toast.success(response.data.message);

      Cookies.set("accessToken", response.data.data.accessToken, {
        path: "/",
        secure: true,
        sameSite: "strict",
        expires: 1 / 48,
      });

      set({ userData: response.data.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    } finally {
      set({ isAuthLoading: false });
      <Navigate to="/" />;
    }
  },

  userSignOut: async () => {
    try {
      set({ isAuthLoading: true });
      const response = await axiosInstance.post("/api/auth/signout");
      toast.success(response.data.message);
      Cookies.remove("accessToken");
      set({ userData: [] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isAuthLoading: false });
    }
  },
}));
