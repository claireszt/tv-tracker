"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";

export default function SignIn() {
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
          <form className="mt-6 space-y-4">
            <Input label="Email" type="email" placeholder="jane@doe.com" />
            <Input label="Password" type="password" placeholder="******" />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="#" className="text-light-accent dark:text-dark-accent text-sm">
                Forgot password?
              </a>
            </div>

            <Button text="SUBMIT" />
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
