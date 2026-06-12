export function Topbar({ title, description }: { title: string; description: string }) {
  return (
    <header className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-100 bg-white px-6 py-5 shadow-sm transition-shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="rounded-full bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-700 shadow-sm">
          Học kỳ 2 • 2025-2026
        </div>
      </div>
    </header>
  );
}
