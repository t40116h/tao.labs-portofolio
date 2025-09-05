"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";
import { ROUTES } from "@/constants/routes";
import { HeaderMark } from "@/components/ui/logo";
import { ScrambleText } from "@/components/ui/text";

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className={styles.root}>
            <div className={["page-container", styles.container].join(" ") }>
                <Link href={ROUTES.HOME} className={styles.brand} aria-label="Home">
                    <HeaderMark size={24} />
                </Link>
                <nav className={styles.nav} aria-label="Primary">
                    <ul className={styles.navList}>
                        <li><Link href={ROUTES.ABOUT}><ScrambleText>About</ScrambleText></Link></li>
                        <li><Link href={ROUTES.PROJECTS}><ScrambleText>Projects</ScrambleText></Link></li>
                        <li><Link href={ROUTES.ARTICLES}><ScrambleText>Articles</ScrambleText></Link></li>
                        <li><Link href={ROUTES.CONTACT}><ScrambleText>Contact</ScrambleText></Link></li>
                    </ul>
                </nav>
                <Link href={ROUTES.CONTACT} className={styles.cta}>
                    <ScrambleText>let&apos;s talk</ScrambleText>
                </Link>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    className={styles.menuButton}
                    onClick={() => setOpen((v) => !v)}
                >
                    MENU
                </button>
            </div>

            <div
                id="mobile-nav"
                className={[styles.mobilePanel, open ? styles.mobileOpen : ""].join(" ")}
                role="dialog"
                aria-modal={open || undefined}
                aria-labelledby="mobile-menu-title"
                onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                }}
            >
                <button className={styles.overlayClose} onClick={() => setOpen(false)} aria-label="Close menu">CLOSE</button>
                <div className={styles.overlayContent}>
                    <nav aria-label="Mobile Primary">
                        <h2 id="mobile-menu-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(1px, 1px, 1px, 1px)" }}>Menu</h2>
                        <ul className={styles.overlayList}>
                            <li><Link href={ROUTES.ABOUT} onClick={() => setOpen(false)}>About</Link></li>
                            <li><Link href={ROUTES.PROJECTS} onClick={() => setOpen(false)}>Projects</Link></li>
                            <li><Link href={ROUTES.ARTICLES} onClick={() => setOpen(false)}>Articles</Link></li>
                            <li><Link href={ROUTES.CONTACT} onClick={() => setOpen(false)}>Contact</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}


