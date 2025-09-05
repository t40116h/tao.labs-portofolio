"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useScramble } from "@/lib/hooks/useScramble";
import styles from "./ScrambleText.module.scss";

type ScrambleTextProps = {
    children: string;
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
};

export function ScrambleText({ children, as = "span", className }: ScrambleTextProps) {
    const [text, setText] = useState(children);
    const onScramble = useCallback((t: string) => setText(t), []);
    const { scramble, stopScramble } = useScramble(children, onScramble);

    // Keep internal text in sync if the source children changes (e.g., theme label cycles)
    useEffect(() => {
        setText(children);
    }, [children]);

    const Comp: any = as;
    return (
        <Comp
            className={[styles.root, className].filter(Boolean).join(" ")}
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
            aria-label={text}
        >
            <span className={styles.placeholder} aria-hidden>{text}</span>
            <span className={styles.overlay}>{text}</span>
        </Comp>
    );
}
