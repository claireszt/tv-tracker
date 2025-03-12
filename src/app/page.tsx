import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct path
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin"); // Redirect only if user is NOT logged in
  }

  return <div>Welcome to TV Tracker</div>;
}
