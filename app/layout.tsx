import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { KeyProvider } from "@/components/KeyProvider";
import TopBar from "@/components/TopBar";
import Assistant from "@/components/Assistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Decision Intelligence Lab · for Technology Leaders",
  description: "Hands-on, industry use-case driven Decision Intelligence masterclass with LangGraph agents and BYOK Groq.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        <KeyProvider>
          <TopBar />
          <main>{children}</main>
          <Assistant />
        </KeyProvider>
      </body>
    </html>
  );
}
