import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, auditLog } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();
    const { data: userData } = await adminClient.auth.admin.getUserById(user.id);
    const role = userData?.user?.app_metadata?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { project_id, title, description, due_date } = body;

    if (!project_id || !title) {
      return NextResponse.json(
        { error: "Project ID and title are required" },
        { status: 400 }
      );
    }

    const { data, error } = await adminClient
      .from("milestones")
      .insert({
        project_id,
        title,
        description: description || null,
        due_date: due_date || null,
        status: "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[api-error]", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    await auditLog(user.id, "create_milestone", `Created milestone "${title}" for project ${project_id}`);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[api-error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
