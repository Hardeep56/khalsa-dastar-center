export type Role = "SUPER_ADMIN" | "BUSINESS_ADMIN" | "WORKER";

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  BUSINESS_ADMIN: [
    "bookings:read",
    "bookings:write",
    "workers:read",
    "workers:write",
    "branding:write",
    "payments:read",
    "calendar:read",
    "attachments:write",
  ],
  WORKER: ["bookings:read:assigned", "bookings:update:status", "calendar:read:assigned"],
};

export function can(role: Role, permission: string) {
  const list = ROLE_PERMISSIONS[role] || [];
  return list.includes("*") || list.includes(permission);
}
