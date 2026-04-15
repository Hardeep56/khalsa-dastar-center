import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { saveTenantFile } from "@/lib/storage/file-storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.businessId || session.user.role === "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const bookingId = String(form.get("bookingId") || "");
  const file = form.get("file");

  if (!(file instanceof File) || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
  }

  const stored = await saveTenantFile(session.user.businessId, file);

  const attachment = await db.attachment.create({
    data: {
      businessId: session.user.businessId,
      bookingId,
      fileName: stored.fileName,
      storagePath: stored.storagePath,
      mimeType: stored.mimeType,
      fileSizeBytes: stored.fileSizeBytes,
    },
  });

  return NextResponse.json(attachment, { status: 201 });
}
