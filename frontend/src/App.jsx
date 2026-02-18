import { useState, useEffect } from "react";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import StatsDashboard from "./components/StatsDashboard";

const API = "http://localhost:8000/api";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [statsKey, setStatsKey] = useState(0); // increment to trigger re-fetch

  const fetchTickets = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API}/tickets/?${params}`);
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => { fetchTickets(); }, []);

  const onTicketCreated = () => {
    fetchTickets();
    setStatsKey(k => k + 1); // refresh stats
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1>Support Ticket System</h1>
      <StatsDashboard apiBase={API} refreshKey={statsKey} />
      <TicketForm apiBase={API} onCreated={onTicketCreated} />
      <TicketList apiBase={API} tickets={tickets} onFilter={fetchTickets} onStatusChange={fetchTickets} />
    </div>
  );
}