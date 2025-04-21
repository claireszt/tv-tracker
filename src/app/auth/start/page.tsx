"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function StartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("callbackUrl")) {
      router.replace("/auth/start");
    }
  }, []);

  useEffect(() => {
    if (session?.user && !session.user.username) {
      router.replace("/auth/complete-profile");
    }
  }, [session, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/exists?email=${encodeURIComponent(data.email)}`);
      const result = await res.json();

      if (result.exists) router.push(`/auth/login?email=${encodeURIComponent(data.email)}`);
      else router.push(`/auth/signup?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error("Something went wrong");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background px-4">
      <Logo />
      <h1 className="text-2xl font-bold mt-6 text-light-text dark:text-dark-text">Welcome</h1>
      <p className="text-sm text-light-text dark:text-dark-text opacity-80 mb-6">
        Enter your email to continue
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow"
      >
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Button text={loading ? "Checking..." : "Continue"} disabled={!isValid || loading} />
      </form>
      <div className="mt-6">
        <button
          onClick={() => signIn("google", { callbackUrl: "/watchlist" })}
          className="flex items-center justify-center gap-2 w-full border border-light-border dark:border-dark-border rounded-lg py-2 px-4 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
