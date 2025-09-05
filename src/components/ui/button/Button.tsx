import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button className={[styles.button, className].filter(Boolean).join(" ")} {...props}>
            {children}
        </button>
    );
}


