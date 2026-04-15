import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveTenantFile(businessId: string, file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const folder = path.join(process.cwd(), "uploads", businessId);
  await mkdir(folder, { recursive: true });

  const storagePath = path.join(folder, `${Date.now()}-${safeName}`);
  await writeFile(storagePath, buffer);

  return {
    fileName: file.name,
    storagePath,
    mimeType: file.type,
    fileSizeBytes: file.size,
  };
}
