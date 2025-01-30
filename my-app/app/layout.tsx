import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/app/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derek's Doggo Finder App",
  description: "This app is a Takehome assignment for Fetch Rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-primary via-secondary to-background text-white min-h-screen`}>
      <Header />
      <main className="px-4 md:px-16 py-8">{children}</main>
    </body>
  </html>
  );
}
