import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "../styles/transitions.css";
import ClientLayout from "../components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fisherman's notes",
  description: "Note your catch",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // if favicon.io generated one
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // During build/SSR, render minimal layout to prevent context errors
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    return (
      <html lang="en">
        <body className={geistSans.className}>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={geistSans.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

// Disable static generation to prevent context issues
export const dynamic = "force-dynamic";
export const revalidate = 0;
