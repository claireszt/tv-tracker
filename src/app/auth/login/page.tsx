"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";

const signInSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"google" | "credentials" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!email) {
      router.push("/auth/start");
      return;
    }

    const fetchUserDetails = async () => {
      const res = await fetch(`/api/user/details?email=${encodeURIComponent(email)}`);
      const result = await res.json();

      if (!result.exists) {
        toast.error("User not found");
        router.push("/auth/start");
        return;
      }

      setSignupMethod(result.signupMethod);
      setShowPassword(result.signupMethod === "credentials");
    };

    fetchUserDetails();
  }, [email, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Welcome back!");
      router.push("/watchlist");
    } else {
      toast.error("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-light-surface dark:bg-dark-surface p-4 relative">
        <ThemeToggle />
        <Logo />
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text text-center font-heading">
          Welcome back
        </h1>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-light-background dark:bg-dark-surface p-6 rounded-lg shadow-md space-y-4">
          <p className="text-center text-sm text-light-text dark:text-dark-text">
            Sign in as <strong>{email}</strong>
          </p>

          {showPassword && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
                error={errors.password?.message}
              />
              <Button
                text={loading ? "Signing in..." : "Continue"}
                disabled={!isValid || loading}
              />
            </form>
          )}

          {signupMethod === "google" && (
            <button
              onClick={() => signIn("google", { callbackUrl: "/watchlist" })}
              className="flex items-center justify-center gap-2 w-full border border-light-border dark:border-dark-border rounded-lg py-2 px-4 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-light-text dark:text-dark-text opacity-70 bg-light-surface dark:bg-dark-surface">
        © Claire Sztejnberg | 2025
      </footer>
    </div>
  );
}
