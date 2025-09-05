import { ScrambleText } from "@/components/ui/text";
import { SectionLabel } from "@/components/ui/section";
export function ArticlesIntro() {
    return (
        <section className="page-center">
            <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                    <SectionLabel title="ARTICLES" countText="N/A" align="center" />
                </div>
                <h1 style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                    <ScrambleText>still building</ScrambleText>
                </h1>
                <p style={{ marginTop: "8px", opacity: 0.85 }}>
                    <ScrambleText>loading</ScrambleText>
                    <span className="loading-dots">...</span>
                </p>
            </div>
        </section>
    );
}


