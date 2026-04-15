export function WorkerList({ workers }: { workers: any[] }) {
  return (
    <div className="rounded-xl border bg-white">
      {workers.map((worker) => (
        <div key={worker.id} className="flex items-center justify-between border-b p-4 last:border-b-0">
          <div>
            <p className="font-medium">{worker.name}</p>
            <p className="text-sm text-slate-500">{worker.email} · {worker.phone ?? "No phone"}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs ${worker.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
            {worker.active ? "Active" : "Inactive"}
          </span>
        </div>
      ))}
    </div>
  );
}
