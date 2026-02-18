import { useState, useEffect } from "react";

export default function StatsDashboard({ apiBase, refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/tickets/stats/`)
      .then(r => r.json()).then(setStats);
  }, [refreshKey]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ background: "#f5f5f5", padding: 16, marginBottom: 20 }}>
      <h2>Dashboard</h2>
      <p>Total: {stats.total_tickets} | Open: {stats.open_tickets} | Avg/day: {stats.avg_tickets_per_day}</p>
      <div>
        <strong>Priority:</strong> {Object.entries(stats.priority_breakdown).map(([k,v]) => `${k}: ${v}`).join(" | ")}
      </div>
      <div>
        <strong>Category:</strong> {Object.entries(stats.category_breakdown).map(([k,v]) => `${k}: ${v}`).join(" | ")}
      </div>
    </div>
  );
}