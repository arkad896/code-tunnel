import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function auditLog(userId: string, action: string, details: string) {
  const admin = createAdminClient();
  await admin.from("audit_logs").insert({
    user_id: userId,
    action,
    details,
    ip_address: "0.0.0.0", // Optional fallback
  });
}
