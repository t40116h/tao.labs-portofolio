"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeSetting = "system" | "light" | "dark";

function resolveTheme(setting: ThemeSetting): "light" | "dark" {
    if (setting === "system") {
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return setting;
}

export function useTheme() {
    // To avoid hydration mismatch, always start as "system" for SSR and initial client render
    const [setting, setSetting] = useState<ThemeSetting>("system");

    // Load saved preference on mount (client only)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = window.localStorage.getItem("theme-setting") as ThemeSetting | null;
        if (saved && (saved === "system" || saved === "light" || saved === "dark")) {
            setSetting(saved);
        } else {
            setSetting("system");
        }
    }, []);

    // Apply theme to <html data-theme>
    useEffect(() => {
        const apply = (mode: "light" | "dark") => {
            const root = document.documentElement;
            root.setAttribute("data-theme", mode);
        };

        const mode = resolveTheme(setting);
        apply(mode);

        if (setting === "system") {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => apply(mq.matches ? "dark" : "light");
            mq.addEventListener("change", handler);
            return () => mq.removeEventListener("change", handler);
        }
        return () => {};
    }, [setting]);

    const setThemeSetting = useCallback((next: ThemeSetting) => {
        setSetting(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("theme-setting", next);
        }
    }, []);

    return { setting, setThemeSetting };
}


