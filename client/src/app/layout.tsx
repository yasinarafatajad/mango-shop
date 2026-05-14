import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mango Shop | সেরা আমের সমাহার",
  description: "রাজশাহীর সুস্বাদু এবং তাজা আম সরাসরি আপনার দ্বারে।",
};

interface RootLayoutProps {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body className="app-container pb-24">
        <Header />
        <div style={{ minHeight: "calc(100vh - 300px)" }}>
          {children}
        </div>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
