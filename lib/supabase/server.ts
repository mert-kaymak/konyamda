import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function cleanUrl(url: string): string {
  return url.replace(/\/(rest|auth|storage|realtime)(\/.*)?$/, "").replace(/\/$/, "")
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
