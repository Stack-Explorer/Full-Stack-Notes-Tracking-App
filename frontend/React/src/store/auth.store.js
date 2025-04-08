import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingin: false,
    isSubmittingOTP: false,
    isPostingUserOTP: false,
    isVerified: false,
    isOtpPending: false,
    hasLoggedIn: false,
    hasEnteredDetails : false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data, isCheckingAuth: false, isVerified: res.data?.isVerified });
        } catch (error) {
            console.error("Error in checking auth", error);
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data, isOtpPending: true });
            const requestData = JSON.parse(res.config.data);
            console.log(requestData)
            localStorage.setItem("username", requestData.username, console.log(requestData.username));
            set({ hasEnteredDetails: true });
            console.log("hasEnteredDetails set to true"); 
            toast.success("OTP sent successfully!");
        } catch (error) {
            console.log(`Signup error called !`)
            toast.error(error.response?.data?.message);
            set({ hasEnteredDetails: false });
            console.log(`Error in signup: ${error.message}`);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingin: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user, hasLoggedIn: true });
            const requestData = JSON.parse(res.config.data);
            localStorage.setItem("username",requestData.username,console.log(requestData.username))
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(`Error in login: ${error.message}`);
        } finally {
            set({ isLoggingin: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null, isOtpPending: false, isVerified: false });
            console.log("Logout successfully");
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    },

    postUserOTP: async (userOTP, email, username, password) => {
        try {
            set({ isPostingUserOTP: true });
            const res = await axiosInstance.post("/auth/getUserDataVerifyAndSaveUser", { userOTP, email, username, password });
            set({ authUser: res.data, isOtpPending: false, isVerified: true });
            toast.success("OTP submitted");
        } catch (error) {
            toast.error(error.response.data.message);
            toast.error("Failed to submit OTP!");
        } finally {
            set({ isPostingUserOTP: false });
        }
    },

    resendOTP: async (email, username) => {
        try {
            await axiosInstance.post("/auth/resend-otp", { email, username });
            toast.success("OTP resent successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resending OTP");
        }
    },
}));