"use client";

import React, { useEffect, useState } from "react";
import styles from "./BuildStatusBadge.module.scss";

export function BuildStatusBadge() {
    const [visible, setVisible] = useState(true);
    const [message, setMessage] = useState("site in build");

    useEffect(() => {
        // Optionally, we could read from an env flag or localStorage in future
        setMessage("site in build");
    }, []);

    // Allow disabling via env on production or after stabilization
    if (!visible || process.env.NEXT_PUBLIC_SHOW_BUILD_BADGE === "false") return null;

    return (
        <div className={styles.root}>
            <div className={styles.badge} role="status" aria-live="polite">
                <span className={styles.dot} aria-hidden />
                <span>{message}</span>
                <span className="loading-dots">...</span>
                <button className={styles.close} aria-label="Dismiss build status" onClick={() => setVisible(false)}>×</button>
            </div>
        </div>
    );
}


