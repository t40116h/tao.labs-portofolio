import React from "react";
import styles from "./HomeIntro.module.scss";
import { SectionLabel } from "@/components/ui/section";
import { ScrambleText } from "@/components/ui/text";
import { LogoBadge } from "@/components/ui/logo";

export function HomeIntro() {
    return (
        <section className={styles.root}>
            <div className={styles.inner}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <SectionLabel index={2} title="INTRO" />
                </div>
                <div className={styles.content}>
                    <h2 className={styles.title}>Hi, I’m Taopik.Hidayat</h2>
                    <div style={{ marginTop: "12px" }}>
                        <LogoBadge size={120} />
                    </div>
                    <div className={styles.socials}>
                        <a href="https://x.com/t40116h" target="_blank" rel="noopener noreferrer"><ScrambleText>X</ScrambleText></a>
                        <a href="https://t.me/t40116h" target="_blank" rel="noopener noreferrer"><ScrambleText>Telegram</ScrambleText></a>
                        <a href="https://instagram.com/t40116h" target="_blank" rel="noopener noreferrer"><ScrambleText>Instagram</ScrambleText></a>
                        <a href="https://github.com/t40116h" target="_blank" rel="noopener noreferrer"><ScrambleText>Github</ScrambleText></a>
                    </div>
                </div>
            </div>
        </section>
    );
}


