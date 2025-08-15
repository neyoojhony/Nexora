
import { useState, useRef, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.NEXORA_BACKEND || "";

export default function ChatBox({ embedded=false }){
  const [open, setOpen] = useState(embedded ? true : false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I’m Nexora. How can I help you today?" }
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const msg = text.trim();
    if (!msg) return;
    setText("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch((BACKEND_URL || "") + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data?.reply || "Sorry, I couldn’t get a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const widget = (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span>Nexora AI</span>
        <button onClick={() => setOpen(false)} style={styles.iconBtn}>×</button>
      </div>
      <div style={styles.body}>
        {messages.map((m, i) => (
          <div key={i} style={{...styles.msg, justifyContent: m.role === "user" ? "flex-end" : "flex-start"}}>
            <div style={{...styles.bubble, background: m.role === "user" ? "var(--primary)" : "var(--card)", color: m.role === "user" ? "var(--primary-ink)" : "var(--text)"}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{color:"var(--muted)", fontSize:12}}>Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div style={styles.inputRow}>
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type your message…"
          style={styles.input}
          rows={1}
        />
        <button onClick={send} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );

  if (embedded) return widget;

  return (
    <div>
      {!open && (
        <button onClick={()=>setOpen(true)} style={styles.fab}>
          Chat
        </button>
      )}
      {open && widget}
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed",
    right: 16,
    bottom: 16,
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "var(--primary)",
    color: "var(--primary-ink)",
    fontWeight: 600,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    zIndex: 50,
  },
  panel: {
    position: "fixed",
    right: 16,
    bottom: 16,
    width: 360,
    maxWidth: "95vw",
    height: 480,
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 60,
  },
  header: {
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "linear-gradient(180deg,rgba(255,255,255,0.05),transparent)",
    borderBottom: "1px solid var(--border)",
    color: "var(--text)",
    fontWeight: 600,
  },
  body: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  msg: { display: "flex" },
  bubble: {
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    whiteSpace: "pre-wrap",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: 8,
    borderTop: "1px solid var(--border)",
    background: "var(--card)",
  },
  input: {
    flex: 1,
    resize: "none",
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 8,
    outline: "none",
  },
  sendBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--primary)",
    color: "var(--primary-ink)",
    fontWeight: 600,
  },
  iconBtn: {
    background: "transparent",
    color: "var(--text)",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
  }
}
