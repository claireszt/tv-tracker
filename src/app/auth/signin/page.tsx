"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Welcome back!");
        setTimeout(() => router.push("/watchlist"), 500);
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-light-surface dark:bg-dark-surface p-4 relative">
        <ThemeToggle />
        <Logo />
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text text-center font-heading">
          Welcome to <br /> TV Tracker
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-light-background dark:bg-dark-surface p-6 rounded-lg shadow-md">
          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email or Username"
              placeholder="jane@doe.com"
              type="text"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="flex justify-end">
              <a href="#" className="text-sm text-light-accent dark:text-dark-accent">
                Forgot password?
              </a>
            </div>

            <Button text={loading ? "Loading..." : "Sign In"} disabled={!isValid || loading} />
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-full bg-light-border dark:bg-dark-border" />
            <span className="px-2 text-xs text-light-text dark:text-dark-text opacity-70">OR</span>
            <div className="h-px w-full bg-light-border dark:bg-dark-border" />
          </div>

          {/* Google Sign-In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/watchlist" })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-light-border dark:border-dark-border rounded-lg py-2 px-4 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Magic Link Placeholder */}
          <div className="mt-4 w-full text-center text-sm text-light-text dark:text-dark-text opacity-60">
            ✉️ Magic link login — <span className="italic">coming soon</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-light-text dark:text-dark-text opacity-70 bg-light-surface dark:bg-dark-surface">
        © Claire Sztejnberg | 2025
      </footer>
    </div>
  );
}
