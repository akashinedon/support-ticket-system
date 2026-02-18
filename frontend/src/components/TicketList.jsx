import { useState } from "react";

export default function TicketList({ apiBase, tickets, onFilter, onStatusChange }) {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const applyFilter = (key, val) => {
    const updated = { ...filters, [key]: val };
    if (!val) delete updated[key];
    setFilters(updated);
    onFilter({ ...updated, search });
  };

  const changeStatus = async (id, newStatus) => {
    await fetch(`${apiBase}/tickets/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    onStatusChange(filters);
  };

  return (
    <div>
      <h2>Tickets</h2>
      {/* Filter controls */}
      <input placeholder="Search..." value={search}
        onChange={e => { setSearch(e.target.value); onFilter({ ...filters, search: e.target.value }); }} />
      <select onChange={e => applyFilter('category', e.target.value)}>
        <option value="">All Categories</option>
        {["billing","technical","account","general"].map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select onChange={e => applyFilter('priority', e.target.value)}>
        <option value="">All Priorities</option>
        {["low","medium","high","critical"].map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select onChange={e => applyFilter('status', e.target.value)}>
        <option value="">All Statuses</option>
        {["open","in_progress","resolved","closed"].map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {tickets.map(t => (
        <div key={t.id} style={{ border: "1px solid #ccc", margin: 8, padding: 12 }}>
          <strong>{t.title}</strong> — {t.category} | {t.priority} |
          <select value={t.status} onChange={e => changeStatus(t.id, e.target.value)}>
            {["open","in_progress","resolved","closed"].map(s =>
              <option key={s} value={s}>{s}</option>)}
          </select>
          <p>{t.description.slice(0, 150)}...</p>
          <small>{new Date(t.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}