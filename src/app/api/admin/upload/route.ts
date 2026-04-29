import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, auditLog } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();
    const { data: userData } = await adminClient.auth.admin.getUserById(user.id);
    const role = userData?.user?.app_metadata?.role;
    if (role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("project_id") as string | null;
    const label = formData.get("label") as string | null;

    if (!file || !projectId || !label) {
      return NextResponse.json(
        { error: "file, project_id, and label are required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const buffer = Buffer.from(bytes);
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${projectId}/${timestamp}-${safeName}`;

    const { error: uploadError } = await adminClient.storage
      .from("deliverables")
      .upload(filePath, buffer, {
        contentType: detected.mime,
        upsert: false,
      });

    if (uploadError) {
      console.error("[api-error]", uploadError);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    // Insert into deliverables table
    const { data, error } = await adminClient
      .from("deliverables")
      .insert({
        project_id: projectId,
        label: label.trim(),
        type: "file",
        url: filePath,
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

    await auditLog(user.id, "upload_file", `Admin uploaded file ${file.name} for project ${projectId}`);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[api-error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
