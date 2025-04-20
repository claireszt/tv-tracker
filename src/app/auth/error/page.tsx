"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Something went wrong";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-red-500">{message}</p>
      </div>
    </div>
  );
}
