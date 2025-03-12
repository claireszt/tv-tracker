"use client"; // Ensures this runs in the client side

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-light-background dark:bg-dark-background">
      <div className="flex flex-col items-center justify-center">
        <Logo />
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text font-heading">
          Hello!
        </h1>
        <p>This page is under construction for now 🛠️</p>
        <p>Come back later!</p>
      </div>
      {/* Logout Button */}
      <Button text="Logout" onClick={() => signOut({ callbackUrl: "/auth/signin" })} />
    </div>
  );
}
