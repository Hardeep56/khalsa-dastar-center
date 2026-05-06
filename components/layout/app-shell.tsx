import Link from "next/link";
import { ReactNode } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/bookings", label: "Bookings" },
  { href: "/workers", label: "Workers" },
  { href: "/settings", label: "Business Settings" },
];

export function AppShell({
  children,
  businessName,
  logoUrl,
}: {
  children: ReactNode;
  businessName: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-4">
        <div className="mb-8 flex items-center gap-3">
          {logoUrl ? <img src={logoUrl} className="h-10 w-10 rounded-full object-cover" alt="Business logo" /> : null}
          <div>
            <p className="text-xs uppercase text-slate-500">Khalsa Planner</p>
            <h1 className="text-lg font-semibold">{businessName}</h1>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link key={link.href} className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
