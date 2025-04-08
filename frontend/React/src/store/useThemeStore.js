import { create } from "zustand";

// Theme is current and setTheme is what you want to set

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "light",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}));