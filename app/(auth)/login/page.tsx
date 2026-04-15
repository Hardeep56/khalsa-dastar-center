import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
        <p className="mb-5 text-sm text-slate-500">Turban tying planner - multi-tenant SaaS</p>
        <form className="space-y-3" method="post" action="/api/auth/callback/credentials">
          <input className="w-full rounded-md border px-3 py-2" name="email" placeholder="you@business.com" type="email" />
          <input className="w-full rounded-md border px-3 py-2" name="password" placeholder="••••••••" type="password" />
          <button className="w-full rounded-md bg-brand py-2 text-white" type="submit">Sign in</button>
        </form>
        <p className="mt-4 text-xs text-slate-500">Need setup help? See <Link className="underline" href="https://next-auth.js.org">Auth docs</Link>.</p>
      </section>
    </main>
  );
}
