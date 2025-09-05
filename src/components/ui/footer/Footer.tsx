import React from "react";
import ThemeToggle from "@/components/ui/theme/ThemeToggle";

export function Footer() {
    return (
        <footer style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
            <div
                className="page-container"
                style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "0.75rem" }}
            >
                <div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", opacity: 0.85 }}>
                        <span style={{ marginRight: 8 }}>theme:</span>
                        <span><ThemeToggle /></span>
                    </span>
                </div>
                <div style={{ textAlign: "center", fontSize: "12px", lineHeight: 1.2, opacity: 0.9, whiteSpace: "nowrap", justifySelf: "center", paddingInline: "0.5rem" }}>
                    <span>©2025 Tao.Labs. All Rights Reserved.</span>
                </div>
                <div style={{ justifySelf: "end" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 23" aria-hidden>
                        <path fill="currentColor" d="M12.53 17.783v-9.08a4.144 4.144 0 0 0-4.14-4.117v14.511a3.8 3.8 0 0 0 3.96 3.841 4.28 4.28 0 0 0 2.816-.816c-2.39-.253-2.635-1.693-2.635-4.339"/>
                        <path fill="currentColor" d="M3.775.787A3.8 3.8 0 0 0 0 4.587h16.893a3.8 3.8 0 0 0 3.775-3.8z"/>
                    </svg>
                </div>
            </div>
        </footer>
    );
}


