import { authOptions } from "@/lib/auth"; // ✅ Import from lib/auth.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/watchlist"); // ✅ Redirect authenticated users to Watchlist
  } else {
    redirect("/auth/signin"); // ✅ Redirect unauthenticated users to Sign In
  }
}
