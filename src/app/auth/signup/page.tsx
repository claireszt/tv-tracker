"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Define Validation Schema
const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        toast.error(result.error || "Sign-up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header (Logo + Theme Toggle) */}
      <div className="w-full flex flex-col items-center bg-light-surface dark:bg-dark-surface p-6 relative">
        <ThemeToggle />
        <Logo />
        <h1 className="mt-2 text-3xl font-bold text-light-text dark:text-dark-text text-center font-heading">
          WELCOME TO <br /> TV TRACKER
        </h1>
      </div>

      {/* Main Content - Centered Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-light-background dark:bg-dark-surface p-4">
          {/* Tabs */}
          <div className="flex justify-center pb-2">
            <a href="/auth/signin" className="text-light-text dark:text-dark-text opacity-70">
              SIGN IN
            </a>
            <span className="ml-4 text-light-text dark:text-dark-text font-bold border-b-2 border-light-secondary dark:border-dark-secondary pb-1">
              SIGN UP
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <Input
              label="Username"
              type="text"
              placeholder="JaneDoe"
              {...register("username")}
              error={errors.username?.message}
            />

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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="******"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <div className="flex justify-center">
              <Button text={loading ? "Loading..." : "SUBMIT"} disabled={loading || !isValid} />
            </div>
          </form>

          {/* Sign-up Link */}
          <p className="mt-6 text-center text-sm text-light-text dark:text-dark-text">
            Already have an account?{" "}
            <a
              href="/auth/signin"
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
