import React from "react";
import styles from "./SectionLabel.module.scss";

interface SectionLabelProps {
    index?: number; // e.g., 1 for 01
    title: string; // e.g., HOME
    total?: number; // e.g., 06 to show 01/06, optional
    countText?: string; // custom text inside brackets, e.g., "N/A"
    align?: "left" | "right" | "center";
}

export function SectionLabel({ index, title, total, countText, align = "left" }: SectionLabelProps) {
    const formattedIndex = index != null ? index.toString().padStart(2, "0") : undefined;
    const formattedTotal = total != null ? total.toString().padStart(2, "0") : undefined;
    const bracketText = countText != null
        ? countText
        : formattedIndex != null
            ? (formattedTotal != null ? `${formattedIndex} / ${formattedTotal}` : formattedIndex)
            : "";
    return (
        <div className={styles.root} style={{ justifyItems: align === "right" ? "end" : align === "center" ? "center" : "start" }}>
            <span className={styles.count}>[{" "}{bracketText}{" "}]</span>
            <div className={styles.dash} />
            <span className={styles.title}>{title}</span>
        </div>
    );
}


