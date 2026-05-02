import { createBrowserClient } from "@supabase/ssr"

// /rest/v1, /auth/v1 gibi path suffix'leri varsa temizle
function cleanUrl(url: string): string {
  return url.replace(/\/(rest|auth|storage|realtime)(\/.*)?$/, "").replace(/\/$/, "")
}

export function createClient() {
  return createBrowserClient(
    cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
