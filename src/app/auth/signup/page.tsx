"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";

export default function SignUp() {
  return (
    <div className="flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header (Logo + Theme Toggle) */}
      <div className="w-full flex flex-col items-center bg-light-surface dark:bg-dark-surface p-6 relative">
        <ThemeToggle />
        <Image src="/icon.png" alt="TV Tracker Logo" width={80} height={80} />
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

          {/* Sign-in Form */}
          <form className="mt-6 space-y-4">
            <Input label="Username" type="text" placeholder="JaneDoe" />
            <Input label="Email" type="email" placeholder="jane@doe.com" />
            <Input label="Password" type="password" placeholder="******" />
            <Input label="Confirm Password" type="password" placeholder="******" />

            <Button text="SUBMIT" />
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
