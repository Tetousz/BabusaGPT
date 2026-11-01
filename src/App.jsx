
import { useState } from "react";
import {
  ArrowUp, ChevronDown, Menu, MessageSquare,
  Plus, Settings2, Terminal, X
} from "lucide-react";
import "./App.css";

const initialChats = [
  { id: 1, title: "Getting started" },
  { id: 2, title: "Untitled conversation" },
];

export default function App() {
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState(1);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeChat = chats.find((chat) => chat.id === activeId);
  const currentMessages = messages[activeId] || [];

  function newChat() {
    const id = Date.now();
    setChats((old) => [{ id, title: "New conversation" }, ...old]);
    setActiveId(id);
    setDraft("");
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setMessages((old) => ({
      ...old,
      [activeId]: [...(old[activeId] || []), { role: "user", text }],
    }));

    setChats((old) =>
      old.map((chat) =>
        chat.id === activeId && chat.title === "New conversation"
          ? { ...chat, title: text.slice(0, 32) }
          : chat
      )
    );
    setDraft("");
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><Terminal size={17} /></div>
            <span>nocturne<span className="muted">.ai</span></span>
            <button className="icon-button mobile-close"
              onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X size={17} />
            </button>
          </div>

          <button className="new-chat" onClick={newChat}>
            <Plus size={16} /> New conversation
            <span className="shortcut">⌘ K</span>
          </button>

          <div className="section-label">WORKSPACE</div>
          <div className="chat-list">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`chat-item ${chat.id === activeId ? "active" : ""}`}
                onClick={() => setActiveId(chat.id)}
              >
                <MessageSquare size={15} />
                <span>{chat.title}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="account">
              <div className="avatar">F</div>
              <div className="account-info">
                <span className="account-name">Guest</span>
                <span className="account-plan">Local preview</span>
              </div>
              <Settings2 size={16} className="muted" />
            </div>
          </div>
        </aside>
      )}

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button className="icon-button"
                onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu size={18} />
              </button>
            )}
            <span className="breadcrumb">Workspace</span>
            <span className="slash">/</span>
            <span className="current-page">{activeChat?.title || "New chat"}</span>
          </div>
          <button className="model-select" title="AI integration comes later">
            <span className="status-dot" />
            No model connected
            <ChevronDown size={14} />
          </button>
        </header>

        <section className="conversation">
          {currentMessages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-mark"><Terminal size={22} /></div>
              <div className="eyebrow">A QUIETER KIND OF AI</div>
              <h1>Think clearly.<br /><span>Build deliberately.</span></h1>
              <p>A personal workspace for ideas, code, and everything in between.</p>
              <div className="suggestions">
                <button onClick={() => setDraft("Help me plan a coding project.")}>
                  <span className="suggestion-index">01</span>
                  <span><strong>Plan a project</strong><small>Turn an idea into a roadmap</small></span>
                </button>
                <button onClick={() => setDraft("Explain a programming concept to me.")}>
                  <span className="suggestion-index">02</span>
                  <span><strong>Explore an idea</strong><small>Understand something new</small></span>
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {currentMessages.map((message, index) => (
                <article className="message" key={index}>
                  <div className="message-role">
                    {message.role === "user" ? "YOU" : "NOCTURNE"}
                  </div>
                  <div className="message-text">{message.text}</div>
                </article>
              ))}
              <div className="preview-note">
                Preview mode — AI responses will be enabled in a later stage.
              </div>
            </div>
          )}
        </section>

        <div className="composer-wrap">
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything..."
              rows={1}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form.requestSubmit();
                }
              }}
              aria-label="Message"
            />
            <div className="composer-footer">
              <span className="composer-hint">SHIFT + ENTER FOR NEW LINE</span>
              <button className="send-button" type="submit"
                disabled={!draft.trim()} aria-label="Send message">
                <ArrowUp size={17} />
              </button>
            </div>
          </form>
          <p className="disclaimer">Independent interface · AI integration not connected</p>
        </div>
      </main>
    </div>
  );
}
