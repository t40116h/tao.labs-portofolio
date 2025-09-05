import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import { AppProvider } from "@/lib/context/AppContext";
import { Header } from "@/components/ui/header";
import { inter, garamond, mono } from "@/lib/fonts";
import { SmoothScroll } from "@/lib/providers/SmoothScroll";
import { Footer } from "@/components/ui/footer/Footer";
import { BuildStatusBadge } from "@/components/ui/status/BuildStatusBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tao.Labs",
  description: "N/A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${inter.variable} ${garamond.variable} ${mono.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProvider>
          <SmoothScroll />
          <Header />
          <main className="page-container">
            {children}
          </main>
          <Footer />
          <BuildStatusBadge />
        </AppProvider>
      </body>
    </html>
  );
}
