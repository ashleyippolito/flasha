import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PasswordGate from "@/components/PasswordGate";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLASHA 2026 Schedule",
  description: "Personal itinerary builder for the FLASHA 2026 conference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <PasswordGate>
          <Nav />
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">{children}</main>
          <footer className="text-center text-xs text-slate-400 py-6">
            Powered by ScriptToolKit © 2025 | Ashley Ippolito, M.S., CCC-SLP
          </footer>
        </PasswordGate>
      </body>
    </html>
  );
}
