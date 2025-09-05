import React from "react";
import styles from "./HomeIntro.module.scss";
import { SectionLabel } from "@/components/ui/section";
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
                </div>
            </div>
        </section>
    );
}


