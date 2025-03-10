import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "TV Tracker - Keep Track of Your Shows",
  description: "Easily track your watched TV episodes and discover new shows.",
  icons: {
    icon: "/ICON.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full bg-light-background dark:bg-dark-background`}
    >
      <body>{children}</body>
    </html>
  );
}
