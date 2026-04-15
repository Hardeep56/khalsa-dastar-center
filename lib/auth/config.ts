import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "BUSINESS_ADMIN" | "WORKER";
      businessId?: string | null;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await db.user.findUnique({ where: { email: credentials.email as string } });
        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.businessId = (user as { businessId?: string | null }).businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "SUPER_ADMIN" | "BUSINESS_ADMIN" | "WORKER";
        session.user.businessId = token.businessId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
