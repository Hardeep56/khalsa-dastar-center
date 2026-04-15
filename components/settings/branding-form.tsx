export function BrandingForm() {
  return (
    <form className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-2">
      <label className="grid gap-1 text-sm">
        Business Name
        <input className="rounded-md border px-3 py-2" name="businessName" />
      </label>
      <label className="grid gap-1 text-sm">
        Contact Email
        <input className="rounded-md border px-3 py-2" name="email" type="email" />
      </label>
      <label className="grid gap-1 text-sm">
        Contact Phone
        <input className="rounded-md border px-3 py-2" name="phone" />
      </label>
      <label className="grid gap-1 text-sm">
        Brand Color
        <input className="h-10 rounded-md border px-2" defaultValue="#6d28d9" name="brandColor" type="color" />
      </label>
      <label className="grid gap-1 text-sm md:col-span-2">
        Address
        <input className="rounded-md border px-3 py-2" name="address" />
      </label>
      <label className="grid gap-1 text-sm md:col-span-2">
        Logo (PNG/JPEG)
        <input accept="image/*" className="rounded-md border px-3 py-2" name="logo" type="file" />
      </label>
      <button className="rounded-md bg-brand px-4 py-2 text-white md:col-span-2" type="submit">
        Save Branding Settings
      </button>
    </form>
  );
}
