export { auth as middleware } from "@/lib/auth/config";

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*", "/workers/:path*", "/calendar/:path*", "/settings/:path*"],
};
