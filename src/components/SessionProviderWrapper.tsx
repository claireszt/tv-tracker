"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration issues
  if (!mounted) return null;

  return <SessionProvider>{children}</SessionProvider>;
}
