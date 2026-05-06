import { AppShell } from "@/components/layout/app-shell";
import { BrandingForm } from "@/components/settings/branding-form";
import { requireBusinessAccess } from "@/lib/auth/guards";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const user = await requireBusinessAccess();
  const business = await db.business.findUnique({ where: { id: user.businessId! } });

  return (
    <AppShell businessName={business?.name ?? "Business"} logoUrl={business?.logoUrl}>
      <h2 className="mb-4 text-xl font-semibold">Business Branding & Contact Settings</h2>
      <BrandingForm />
    </AppShell>
  );
}
