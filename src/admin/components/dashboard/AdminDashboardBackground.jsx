export function AdminDashboardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden>
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-accent-soft blur-3xl" />
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-sun/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
    </div>
  );
}
