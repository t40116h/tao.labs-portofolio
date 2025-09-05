"use client";

import React, { useEffect, useRef } from "react";
import { LOGO_SVG_STRING } from "@/components/ui/particle/constants";

type Particle = {
    baseX: number;
    baseY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    noiseOffset: number;
    // Destruction / regeneration state
    isBroken: boolean;
    timeSinceBreakMs: number;
    reassembleDelayMs: number;
    reassembleDurationMs: number;
    smoothVX: number;
    smoothVY: number;
};

interface InteractiveParticleLogoProps {
    size?: number; // when provided, sets intrinsic width of the logo area (not including padding)
    autoSize?: boolean; // when true, fills the parent container width
    density?: number;
    pointSize?: number;
    hoverRadius?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function InteractiveParticleLogo({
    size = 200,
    autoSize = false,
    density = 3,
    pointSize = 1.6,
    hoverRadius = 40,
    color,
    className,
    style,
}: InteractiveParticleLogoProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | undefined>(undefined);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
    const resizeRaf = useRef<number | undefined>(undefined);
    const colorRef = useRef<string>("#000");
    const lastFrameTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const container = containerRef.current as HTMLDivElement;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const context: CanvasRenderingContext2D = ctx;

        const devicePixelRatioSafe = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

        function computeAndResizeCanvas() {
            const parent = containerRef.current;
            if (!parent) return { width: 0, height: 0, safePadding: 0 };

            // Compute safe padding relative to hover radius and particle jitter
            const computedSafePadding = Math.ceil((hoverRadius ?? 40) + Math.max(pointSize * 2, 12));
            const aspect = 23 / 21; /* from SVG viewBox 21x23 */

            let cssInnerWidth = size;
            if (autoSize) {
                // Fill parent width, but keep the logo inside safe padding
                const parentRect = parent.getBoundingClientRect();
                cssInnerWidth = Math.max(160, Math.floor(parentRect.width - computedSafePadding * 2));
            }

            const cssWidth = cssInnerWidth + computedSafePadding * 2;
            const cssHeight = Math.round((cssInnerWidth * aspect) + computedSafePadding * 2);

            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;
            const width = Math.floor(cssWidth * devicePixelRatioSafe);
            const height = Math.floor(cssHeight * devicePixelRatioSafe);
            canvas.width = width;
            canvas.height = height;
            return { width, height, safePadding: computedSafePadding, cssInnerWidth };
        }

        let { width, height, cssInnerWidth } = computeAndResizeCanvas();

        // Color inherits from current text color; update on theme changes
        const updateColor = () => {
            colorRef.current = color || getComputedStyle(container).color || "#000";
        };
        updateColor();
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        let prefersReducedMotion = media.matches;
        const handleMediaChange = () => {
            prefersReducedMotion = media.matches;
            if (prefersReducedMotion) {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                drawStatic();
            } else {
                startAnimation();
            }
        };
        media.addEventListener?.("change", handleMediaChange);

        // React to data-theme changes on <html>
        const themeObserver = new MutationObserver(() => updateColor());
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = "data:image/svg+xml;utf8," + encodeURIComponent(LOGO_SVG_STRING);

        let disposed = false;

        image.onload = () => {
            if (disposed) return;

            const samplingCanvas = document.createElement("canvas");
            samplingCanvas.width = width;
            samplingCanvas.height = height;
            const samplingContext = samplingCanvas.getContext("2d");
            if (!samplingContext) return;

            samplingContext.clearRect(0, 0, width!, height!);
            // Draw the SVG centered within the padded area
            const drawWidth = Math.floor((cssInnerWidth! ) * devicePixelRatioSafe);
            const drawHeight = Math.floor((cssInnerWidth! * (23 / 21)) * devicePixelRatioSafe);
            const offsetX = Math.floor((width! - drawWidth) / 2);
            const offsetY = Math.floor((height! - drawHeight) / 2);
            samplingContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
            const rgba = samplingContext.getImageData(0, 0, width, height).data;

            const spacing = Math.max(1, Math.floor(density * devicePixelRatioSafe));
            const particles: Particle[] = [];

            for (let y = 0; y < height; y += spacing) {
                for (let x = 0; x < width; x += spacing) {
                    const i = (y * width + x) * 4;
                    const alpha = rgba[i + 3];
                    if (alpha > 10) {
                        particles.push({
                            baseX: x + 0.5,
                            baseY: y + 0.5,
                            x: x + 0.5,
                            y: y + 0.5,
                            vx: 0,
                            vy: 0,
                            noiseOffset: Math.random() * 1000,
                            isBroken: false,
                            timeSinceBreakMs: 0,
                            reassembleDelayMs: 240 + Math.random() * 420,
                            reassembleDurationMs: 600 + Math.random() * 700,
                            smoothVX: 0,
                            smoothVY: 0,
                        });
                    }
                }
            }

            // Assign depth layers by radial distance from center: outer ring = back (0), inner = front
            const LAYER_COUNT = 3;
            if (particles.length) {
                let sumX = 0, sumY = 0;
                for (const p of particles) { sumX += p.baseX; sumY += p.baseY; }
                const cx = sumX / particles.length;
                const cy = sumY / particles.length;
                let maxDist = 1;
                for (const p of particles) {
                    const dx = p.baseX - cx;
                    const dy = p.baseY - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > maxDist) maxDist = dist;
                }
                // Attach dynamic field 'layer' using type assertion
                for (const p of particles as Particle[]) {
                    const dx = p.baseX - cx;
                    const dy = p.baseY - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const raw = Math.min(LAYER_COUNT - 1, Math.floor((dist / maxDist) * LAYER_COUNT));
                    // back = outer ring
                    (p as unknown as { layer: number }).layer = (LAYER_COUNT - 1) - raw;
                    // stagger reassembly so back returns first
                    const perLayerDelay = 180;
                    const layer = (p as unknown as { layer: number }).layer ?? 0;
                    p.reassembleDelayMs += layer * perLayerDelay;
                }
                // Draw order: back first, front last
                (particles as unknown as Array<Particle & { layer: number }>).sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));
            }

            // Save back
            particlesRef.current = particles;

            if (prefersReducedMotion) {
                drawStatic();
                return;
            }

            startAnimation();
        };

        const onPointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = (event.clientX - rect.left) * devicePixelRatioSafe;
            mouseRef.current.y = (event.clientY - rect.top) * devicePixelRatioSafe;
            mouseRef.current.active = true;
        };
        const onPointerLeave = () => {
            mouseRef.current.active = false;
        };
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerleave", onPointerLeave);

        function drawStatic() {
            context.clearRect(0, 0, width, height);
            context.fillStyle = colorRef.current;
            const radius = pointSize * devicePixelRatioSafe * 0.5;
            for (const p of particlesRef.current) {
                context.beginPath();
                context.arc(p.x, p.y, radius, 0, Math.PI * 2);
                context.fill();
            }
        }

        function step(time: number) {
            const last = lastFrameTimeRef.current;
            lastFrameTimeRef.current = time;
            const dtMs = last == null ? 16 : Math.max(1, Math.min(50, time - last));
            const particles = particlesRef.current;
            context.clearRect(0, 0, width, height);
            context.fillStyle = colorRef.current;
            const radius = pointSize * devicePixelRatioSafe * 0.5;
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const mouseActive = mouseRef.current.active;
            const hoverRadiusScaled = (hoverRadius ?? 40) * devicePixelRatioSafe;
            const hoverRadiusSquared = hoverRadiusScaled * hoverRadiusScaled;
            const explodeMin = 6 * devicePixelRatioSafe;
            const explodeMax = 18 * devicePixelRatioSafe;

            function smoothDamp(current: number, target: number, currentVelocity: number, smoothTime: number, deltaTime: number) {
                const omega = 2 / Math.max(0.0001, smoothTime);
                const x = omega * deltaTime;
                const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
                const change = current - target;
                const temp = (currentVelocity + omega * change) * deltaTime;
                const newVel = (currentVelocity - omega * temp) * exp;
                const newPos = target + (change + temp) * exp;
                return { pos: newPos, vel: newVel };
            }

            for (let index = 0; index < particles.length; index++) {
                const p = particles[index];

                const tJit = time * 0.001 + p.noiseOffset;
                const jitterX = Math.sin(tJit * 1.7) * 0.15 * devicePixelRatioSafe;
                const jitterY = Math.cos(tJit * 1.3) * 0.15 * devicePixelRatioSafe;

                // Explosion trigger when mouse is near
                if (mouseActive && !p.isBroken) {
                    const dx0 = p.x - mouseX;
                    const dy0 = p.y - mouseY;
                    const d2 = dx0 * dx0 + dy0 * dy0;
                    if (d2 < hoverRadiusSquared) {
                        const d = Math.sqrt(d2) || 0.0001;
                        const nx = dx0 / d;
                        const ny = dy0 / d;
                        const k = 1 - d / hoverRadiusScaled; // stronger near cursor center
                        const impulse = explodeMin + (explodeMax - explodeMin) * (0.7 + 0.3 * Math.random()) * k;
                        p.vx += nx * impulse;
                        p.vy += ny * impulse;
                        p.isBroken = true;
                        p.timeSinceBreakMs = 0;
                    }
                }

                if (p.isBroken) {
                    // While broken, let it scatter and drift
                    p.timeSinceBreakMs += dtMs;
                    const damping = 0.92;
                    // Reassemble after delay with an eased spring for flowing motion
                    if (p.timeSinceBreakMs >= p.reassembleDelayMs) {
                        const elapsed = p.timeSinceBreakMs - p.reassembleDelayMs;
                        const progress = Math.min(1, Math.max(0, elapsed / p.reassembleDurationMs));
                        const eased = easeOutCubic(progress);
                        const baseSmooth = 0.28; // seconds
                        const endSmooth = 0.14;  // seconds
                        const smoothTime = baseSmooth + (endSmooth - baseSmooth) * eased;
                        const dtSec = dtMs / 1000;
                        const sx = smoothDamp(p.x, p.baseX, p.smoothVX, smoothTime, dtSec);
                        const sy = smoothDamp(p.y, p.baseY, p.smoothVY, smoothTime, dtSec);
                        p.x = sx.pos;
                        p.y = sy.pos;
                        p.smoothVX = sx.vel;
                        p.smoothVY = sy.vel;
                        // fade jitter as particle settles
                        const jitterFade = 1 - eased;
                        p.x += jitterX * 0.5 * jitterFade;
                        p.y += jitterY * 0.5 * jitterFade;
                        // Finish when close enough
                        const dxb = p.baseX - p.x;
                        const dyb = p.baseY - p.y;
                        if (dxb * dxb + dyb * dyb < (1.5 * devicePixelRatioSafe) * (1.5 * devicePixelRatioSafe)) {
                            p.x = p.baseX;
                            p.y = p.baseY;
                            p.vx = 0;
                            p.vy = 0;
                            p.smoothVX = 0;
                            p.smoothVY = 0;
                            p.isBroken = false;
                            p.timeSinceBreakMs = 0;
                        }
                    } else {
                        // Not yet reassembling: slow drift with friction
                        p.vx *= damping;
                        p.vy *= damping;
                        p.x += p.vx + jitterX;
                        p.y += p.vy + jitterY;
                    }
                } else {
                    // Normal behavior: mild spring + subtle mouse repulsion
                    let ax = 0;
                    let ay = 0;
                    if (mouseActive) {
                        const dx = p.x - mouseX;
                        const dy = p.y - mouseY;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < hoverRadiusSquared) {
                            const d = Math.sqrt(d2) || 0.0001;
                            const force = (1 - d / hoverRadiusScaled) * 1.6;
                            ax += (dx / d) * force * 0.9;
                            ay += (dy / d) * force * 0.9;
                        }
                    }
                    ax += (p.baseX - p.x) * 0.02;
                    ay += (p.baseY - p.y) * 0.02;
                    p.vx = (p.vx + ax) * 0.9;
                    p.vy = (p.vy + ay) * 0.9;
                    p.x += p.vx + jitterX;
                    p.y += p.vy + jitterY;
                }

                context.beginPath();
                context.arc(p.x, p.y, radius, 0, Math.PI * 2);
                context.fill();
            }

            rafRef.current = requestAnimationFrame(step);
        }

        function startAnimation() {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(step);
        }

        function reflow() {
            if (resizeRaf.current) cancelAnimationFrame(resizeRaf.current);
            resizeRaf.current = requestAnimationFrame(() => {
                const dims = computeAndResizeCanvas();
                width = dims.width;
                height = dims.height;
                cssInnerWidth = dims.cssInnerWidth;
                // Force re-sample by triggering image onload path again
                image.onload?.(new Event("load"));
            });
        }

        const ResizeObs = (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
        const ro = ResizeObs ? new ResizeObs(() => reflow()) : undefined;
        if (ro && container) ro.observe(container);
        window.addEventListener("resize", reflow);

        return () => {
            disposed = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            canvas.removeEventListener("pointermove", onPointerMove);
            canvas.removeEventListener("pointerleave", onPointerLeave);
            particlesRef.current = [];
            media.removeEventListener?.("change", handleMediaChange);
            themeObserver.disconnect();
            if (ro && container) ro.unobserve(container);
            window.removeEventListener("resize", reflow);
        };
    }, [size, autoSize, density, pointSize, hoverRadius, color]);

    return (
        <div ref={containerRef} className={className} style={{ color: "var(--foreground)", ...style }}>
            <canvas ref={canvasRef} role="img" aria-label="Interactive particle logo" />
        </div>
    );
}


