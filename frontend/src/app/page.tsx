import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { GET as handler } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  const session = await getServerSession(handler)

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
