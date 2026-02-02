import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpotlightCursor } from "@/components/ui/spotlight-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Preloader } from "@/components/ui/preloader";
import { SoundManager } from "@/components/ui/sound-manager";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Le Nguyen Thai Duong - Portfolio",
  description: "Senior Full Stack Engineer & Creative Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}
      >
        <Preloader />
        <SoundManager />
        <div className="fixed inset-0 z-50 pointer-events-none bg-noise opacity-20 mix-blend-soft-light"></div>
        <ScrollProgress />
        <SpotlightCursor />
        <SmoothScroll />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
