import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, auditLog } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Verify the caller is authenticated and is an admin
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.app_metadata?.role || user.user_metadata?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, full_name, company, phone, created_by } = body;

    if (!email || !full_name) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const token = randomUUID();

    const { data: invite, error } = await adminClient.from("invites").insert({
      email,
      full_name,
      company: company || null,
      phone: phone || null,
      token,
      created_by: created_by || user.id,
      used: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).select().single();

    if (error) {
      console.error("[api-error]", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    await auditLog(user.id, "create_invite", `Created invite for ${email}`);

    return NextResponse.json({ token: invite.token });
  } catch (error) {
    console.error("[api-error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
