"use client";

import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background">
        <Button text="Logout" onClick={() => signOut({ callbackUrl: "/auth/signin" })} />
      </div>
    </>
  );
}
