import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "100 Agentic AI Systems | Zero to Hero",
  description: "A comprehensive learning platform for AI Agent mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-slate-50 min-h-screen flex">
        <Sidebar />
        <main className="flex-1 lg:ml-72 min-h-screen transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
