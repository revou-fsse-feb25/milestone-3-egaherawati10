import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient"; // Move your current code into this component

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // ⬅️ Force redirect if not logged in
  }

  return <HomeClient session={session} />;
}
