"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background">
      <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text font-heading">
        Hello {session.user.username || "Guest"}!
      </h1>
      <p>This page is under construction for now 🛠️</p>
      <p>Come back later!</p>
    </div>
  );
}
