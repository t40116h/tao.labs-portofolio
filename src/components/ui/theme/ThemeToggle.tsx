"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils/cn";
import styles from "./ThemeToggle.module.scss";
import { ScrambleText } from "@/components/ui/text";
// styles no longer used after simplification

// icons removed for simplified text-only toggle

// --- ThemeToggle Component (Modified) ---
// Using string literals directly (system | light | dark)

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { setting, setThemeSetting } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => { /* mount only */ }, [mounted]);

    // Simple text cycle: system -> light -> dark -> system
    const cycleTheme = () => {
        if (setting === "system") setThemeSetting("light");
        else if (setting === "light") setThemeSetting("dark");
        else setThemeSetting("system");
    };

    const label = setting === "system" ? "system" : setting === "light" ? "white" : "dark";

    return (
        <button
            type="button"
            className={cn(styles.textToggle, className)}
            onClick={cycleTheme}
            aria-label="Toggle theme"
        >
            <ScrambleText>{label}</ScrambleText>
        </button>
    );
};

export default ThemeToggle;