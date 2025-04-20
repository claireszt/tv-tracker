"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      const t = setTimeout(() => router.push("/watchlist"), 200);
      return () => clearTimeout(t);
    }
  }, [session, status, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Something went wrong");
        return;
      }

      toast.success("Username saved!");

      await signIn("google", { redirect: false });
      router.push("/watchlist");
    } catch (err: any) {
      toast.error("Error setting username.", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-light-background dark:bg-dark-background">
      <Logo />
      <h1 className="text-2xl md:text-3xl font-bold text-center text-light-text dark:text-dark-text mb-4">
        One last step...
      </h1>
      <p className="text-sm text-center mb-6 text-light-text dark:text-dark-text opacity-80">
        Choose your username to finish setting up your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 bg-light-surface dark:bg-dark-surface p-6 rounded-2xl shadow-md"
      >
        <Input
          label="Username"
          placeholder="claireszt"
          {...register("username")}
          error={errors.username?.message}
        />

        <Button text={loading ? "Saving..." : "Save & Continue"} disabled={!isValid || loading} />
      </form>
    </div>
  );
}
