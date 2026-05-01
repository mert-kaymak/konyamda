import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import OrganizatorDashboard from "./_components/OrganizatorDashboard"

export default async function OrganizatorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone, bio, is_organizer")
    .eq("id", user.id)
    .single()

  if (!profile?.is_organizer) redirect("/dashboard")

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })

  const expIds = (experiences ?? []).map((e) => e.id)

  const [{ data: categories }, bookingsResult] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    expIds.length > 0
      ? supabase
          .from("bookings")
          .select(
            "id, experience_id, participant_count, booking_date, total_price, status, created_at, profiles(full_name), experiences(title)"
          )
          .in("experience_id", expIds)
          .order("created_at", { ascending: false })
          .limit(100)
      : Promise.resolve({ data: [] }),
  ])

  return (
    <OrganizatorDashboard
      profile={profile}
      initialExperiences={experiences ?? []}
      categories={categories ?? []}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialBookings={(bookingsResult.data ?? []) as any[]}
    />
  )
}
