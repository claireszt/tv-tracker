import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Playfair_Display, Poppins } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "TV Tracker - Keep Track of Your Shows",
  description: "Easily track your watched TV episodes and discover new shows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full bg-light-background dark:bg-dark-background`}
    >
      <body className="font-poppins">
        <SessionProviderWrapper>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
