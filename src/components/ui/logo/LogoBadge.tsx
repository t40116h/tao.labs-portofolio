import React from "react";
import styles from "./LogoBadge.module.scss";

type LogoBadgeProps = {
    className?: string;
    size?: number;
};

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className, size = 32 }) => {
    const style = { "--logo-size": `${size}px` } as React.CSSProperties & { [key: string]: string };
    return (
        <div className={[styles.container, className].filter(Boolean).join(" ")} style={style}>
            <svg
                className={styles.svg}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <mask id="badgeMask">
                        <rect width="100" height="100" rx="16" fill="white" />
                        <rect x="3" y="3" width="94" height="94" rx="14" fill="black" />
                    </mask>
                    <clipPath id="badgeClip">
                        <rect x="3" y="3" width="94" height="94" rx="14" />
                    </clipPath>
                    <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A7C7FF" />
                        <stop offset="50%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#A7C7FF" />
                    </linearGradient>
                    <filter id="geminiGlow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="100" height="100" rx="16" className={styles.badgeBackground} />
                <rect
                    x="0.5"
                    y="0.5"
                    width="99"
                    height="99"
                    rx="15.5"
                    className={styles.badgeBorderStatic}
                    strokeWidth={2}
                />
                {/* Profile image clipped to inner rounded rect */}
                <image
                    href="/profile.png"
                    x="3"
                    y="3"
                    width="94"
                    height="94"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#badgeClip)"
                />
                <g mask="url(#badgeMask)">
                    <rect
                        x="1"
                        y="1"
                        width="98"
                        height="98"
                        rx="15"
                        className={styles.badgeBorderAnimated}
                        stroke="url(#geminiGradient)"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="0.25 0.75"
                        strokeWidth={3}
                        filter="url(#geminiGlow)"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="0"
                            to="-1"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            values="1;0.6;1"
                            dur="0.7s"
                            repeatCount="indefinite"
                        />
                    </rect>
                </g>
            </svg>
        </div>
    );
};


