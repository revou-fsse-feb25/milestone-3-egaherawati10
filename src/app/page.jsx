import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient"; 

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <HomeClient session={session} />;
}
