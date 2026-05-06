import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireBusinessAccess() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && !user.businessId) {
    redirect("/login");
  }
  return user;
}
