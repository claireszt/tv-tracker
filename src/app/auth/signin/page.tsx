"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Define Validation Schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
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
    criteriaMode: "all",
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Prevents auto-redirect
      });

      if (response?.ok) {
        toast.success("Login success! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        toast.error(`Login failed: ${response?.error || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header (Logo + Theme Toggle) */}
      <div className="w-full flex flex-col items-center bg-light-surface dark:bg-dark-surface p-4 relative">
        <ThemeToggle />
        <Image src="/icon.png" alt="TV Tracker Logo" width={80} height={80} />
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text text-center font-heading">
          WELCOME TO <br /> TV TRACKER
        </h1>
      </div>

      {/* Main Content - Centered Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-light-background dark:bg-dark-surface p-6">
          {/* Tabs */}
          <div className="flex justify-center pb-2">
            <span className="mr-4 text-light-text dark:text-dark-text font-bold border-b-2 border-light-secondary dark:border-dark-secondary pb-1">
              SIGN IN
            </span>
            <a href="/auth/signup" className="text-light-text dark:text-dark-text opacity-70">
              SIGN UP
            </a>
          </div>

          {/* Sign-in Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="jane@doe.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="******"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-light-accent dark:text-dark-accent text-sm">
                Forgot password?
              </a>
            </div>

            <div className="flex justify-center">
              <Button text={loading ? "Loading..." : "SUBMIT"} disabled={loading || !isValid} />
            </div>
          </form>

          {/* Sign-up Link */}
          <p className="mt-6 text-center text-sm text-light-text dark:text-dark-text">
            Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-light-secondary dark:text-dark-secondary font-bold"
            >
              Sign up!
            </a>
          </p>
        </div>
      </div>

      {/* Footer - Fixed at Bottom */}
      <div className="w-full py-4 text-center text-xs text-light-text dark:text-dark-text opacity-70 bg-light-surface dark:bg-dark-surface">
        © Claire Sztejnberg | 2025
      </div>
    </div>
  );
}
