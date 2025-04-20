"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already">("loading");
  const router = useRouter();

  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await res.json();

        if (res.ok) {
          if (result.message === "Already verified") {
            setStatus("already");
            toast("Email already verified");
          } else {
            setStatus("success");
            toast.success("Email verified! You can now log in.");
            setTimeout(
              () => router.push(`/auth/login?email=${encodeURIComponent(result.email)}`),
              1500
            );
          }
        } else {
          setStatus("error");
          toast.error(result.error || "Verification failed");
        }
      } catch (err: any) {
        setStatus("error");
        toast.error("Something went wrong");
        console.error(err.message);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-light-background dark:bg-dark-background">
      <h1 className="text-3xl font-bold mb-4 text-light-text dark:text-dark-text">
        Email Verification
      </h1>
      {status === "loading" && <p className="text-sm text-muted">Verifying...</p>}
      {status === "success" && <p className="text-green-600">✅ Email verified! Redirecting...</p>}
      {status === "already" && <p className="text-yellow-600">ℹ️ Email already verified.</p>}
      {status === "error" && (
        <p className="text-red-600">❌ Verification failed. The link may be expired or invalid.</p>
      )}
    </div>
  );
}
