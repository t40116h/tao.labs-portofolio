import React from "react";
import styles from "./HomeHero.module.scss";
import { InteractiveParticleLogo } from "@/components/ui/particle";
import { HomeIntro } from "@/components/home/HomeIntro";
import { SectionLabel } from "@/components/ui/section";

export function HomeHero() {
    return (
        <>
            <section className={styles.root}>
                <div className={styles.labelOverlay}>
                    <div className={styles.labelInner}>
                        <SectionLabel index={1} title="HOME" />
                    </div>
                </div>
                <div className={styles.inner}>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <InteractiveParticleLogo autoSize density={2.4} pointSize={2.0} hoverRadius={84} />
                    </div>
                </div>
            </section>
            {/* Intro section below hero */}
            <HomeIntro />
        </>
    );
}


