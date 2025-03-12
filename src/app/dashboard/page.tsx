"use client"; // Ensures this runs in the client side

import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-light-background dark:bg-dark-background">
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text font-heading">
          Hello!
        </h1>
        <p className="text-light-text dark:text-dark-text font-body">
          This page is under construction for now 🛠️
        </p>
        <p className="text-light-text dark:text-dark-text font-body">Come back later!</p>
      </div>
      {/* Logout Button */}
      <Button text="Logout" onClick={() => signOut({ callbackUrl: "/auth/signin" })} />
    </div>
  );
}
