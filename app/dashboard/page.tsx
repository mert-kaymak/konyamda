import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./_components/DashboardClient"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, bio, avatar_url, is_organizer")
    .eq("id", user.id)
    .single()

  return (
    <DashboardClient
      profile={profile ?? { id: user.id, full_name: null, phone: null, bio: null, avatar_url: null, is_organizer: false }}
      email={user.email ?? ""}
    />
  )
}
