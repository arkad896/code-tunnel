import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient.auth.admin.getUserById(user.id);
  const role = userData?.user?.app_metadata?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { project_id, description, amount, due_date, status } = body;

  if (!project_id || !description || amount === undefined) {
    return NextResponse.json(
      { error: "Project ID, description, and amount are required" },
      { status: 400 }
    );
  }

  const { data, error } = await adminClient
    .from("invoices")
    .insert({
      project_id,
      description,
      amount,
      due_date: due_date || null,
      status: status || "Pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
