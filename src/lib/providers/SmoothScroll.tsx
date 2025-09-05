"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
    useEffect(() => {
        // Skip on touch/coarse pointers or when user prefers reduced motion
        const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
        if (prefersReduced || isCoarse) {
            return;
        }

        const options: Partial<{ duration: number; easing: (t: number) => number; wheelMultiplier: number; touchMultiplier: number; }> = {
            duration: 1.1,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
            touchMultiplier: 1,
        };
        const lenis = new Lenis(options as unknown as ConstructorParameters<typeof Lenis>[0]);

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return null;
}


