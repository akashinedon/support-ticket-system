import { useState, useRef } from "react";

export default function TicketForm({ apiBase, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [classifying, setClassifying] = useState(false);
  const [suggested, setSuggested] = useState(null);
  const debounceRef = useRef(null);

  const classify = async (desc) => {
    if (desc.length < 20) return; // don't classify too early
    setClassifying(true);
    try {
      const res = await fetch(`${apiBase}/tickets/classify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });
      const data = await res.json();
      if (data.suggested_category) {
        setCategory(data.suggested_category);
        setPriority(data.suggested_priority);
        setSuggested(data);
      }
    } catch (e) {
      // fail silently — user can still submit
    } finally {
      setClassifying(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);
    // debounce classify call by 800ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => classify(val), 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiBase}/tickets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, priority }),
    });
    if (res.status === 201) {
      setTitle(""); setDescription(""); setCategory("general");
      setPriority("medium"); setSuggested(null);
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit a Ticket</h2>
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Title" maxLength={200} required />
      <textarea value={description} onChange={handleDescriptionChange}
        placeholder="Describe your issue..." required />
      {classifying && <span>🤖 Classifying...</span>}
      {suggested && <span>✅ AI suggested: {suggested.suggested_category} / {suggested.suggested_priority}</span>}
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {["billing","technical","account","general"].map(c =>
          <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        {["low","medium","high","critical"].map(p =>
          <option key={p} value={p}>{p}</option>)}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}