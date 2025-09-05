import { Manrope, EB_Garamond, JetBrains_Mono } from "next/font/google";

export const inter = Manrope({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["300", "400", "500", "600", "700", "800"],
});

export const garamond = EB_Garamond({
    subsets: ["latin"],
    variable: "--font-garamond",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

export const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});


