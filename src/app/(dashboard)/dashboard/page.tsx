export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-md p-5">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Active Campaigns
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-5">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Total Leads
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-5">
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Total Jobs
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
