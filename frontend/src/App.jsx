
import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

const examples = [
  "A local clinic needs a simple website with doctor profiles, contact details and an appointment form. The budget is limited.",
  "A small cafe needs a modern website with its menu, opening hours, location and WhatsApp ordering.",
  "A client wants an Instagram content package with 12 posts, captions and a consistent visual style."
];

function App() {
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function generatePlan() {
    if (message.trim().length < 10) {
      setError("Add a little more detail about the client's request.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_message: message.trim(),
          currency
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Could not generate the project plan.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Can't reach GigPilot's backend. Make sure FastAPI is running on port 8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyText(key, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setError("Clipboard access failed. Select and copy the text manually.");
    }
  }

  const sections = result
    ? [
        { key: "project_summary", title: "Project overview", icon: "✦", text: result.project_summary },
        { key: "quotation_draft", title: "Quotation draft", icon: "₹", text: result.quotation_draft },
        { key: "estimated_timeline", title: "Estimated timeline", icon: "◷", text: result.estimated_timeline },
        { key: "client_reply", title: "Ready-to-send reply", icon: "↗", text: result.client_reply }
      ]
    : [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-mark">G</span>
          <span>gigpilot<span className="brand-ai">.ai</span></span>
        </a>

        <div className="side-label">WORKSPACE</div>
        <a className="nav-item active" href="#brief"><span>✳</span> New project plan</a>
        <a className="nav-item" href="#results"><span>▤</span> Generated results</a>

        <div className="sidebar-bottom">
          <div className="local-badge"><span className="status-dot" /> Local AI enabled</div>
          <p>Your client messages stay on your machine when using local Ollama inference.</p>
          <div className="model-tag">QWEN 2.5 · 1.5B</div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> New project</div>
          <div className="top-status"><span className="status-dot" /> Local inference</div>
        </header>

        <section className="hero">
          <div className="eyebrow"><span /> FREELANCER TOOLKIT · OPEN-SOURCE AI</div>
          <h1>Turn client messages<br />into <span>paid opportunities.</span></h1>
          <p className="hero-copy">
            Go from a messy client brief to a clear project plan, a quotation draft,
            and a reply you can actually send.
          </p>
          <div className="hero-pills">
            <span>✦ Project planning</span>
            <span>↗ Scope protection</span>
            <span>◉ Runs locally</span>
          </div>
        </section>

        <section className="workspace-grid" id="brief">
          <div className="panel input-panel">
            <div className="panel-heading">
              <div>
                <div className="step-label">STEP 01</div>
                <h2>Client brief</h2>
              </div>
              <span className="heading-icon">✎</span>
            </div>

            <label htmlFor="client-message">What did the client ask for?</label>
            <p className="field-help">Paste a WhatsApp message, email, or rough project notes.</p>
            <textarea
              id="client-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey, I need a website for my clinic. It should have doctor profiles, contact details and an appointment booking form. My budget is limited..."
              maxLength={5000}
            />

            <div className="textarea-footer">
              <span>{message.length}/5000 characters</span>
              <button className="text-button" onClick={() => setMessage(examples[0])}>Try an example ↗</button>
            </div>

            <div className="example-list">
              <span className="example-label">QUICK START</span>
              {examples.map((example, i) => (
                <button key={example} className="example-button" onClick={() => setMessage(example)}>
                  <span>0{i + 1}</span>
                  {["Clinic website", "Cafe website", "Social media package"][i]}
                  <span className="example-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="form-bottom">
              <div className="currency-field">
                <label htmlFor="currency">Quotation currency</label>
                <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">INR · ₹ Rupee</option>
                  <option value="USD">USD · $ Dollar</option>
                  <option value="GBP">GBP · £ Pound</option>
                </select>
              </div>
              <button className="generate-button" onClick={generatePlan} disabled={loading}>
                {loading ? <><span className="spinner" /> Thinking...</> : <>Generate gig kit <span>↗</span></>}
              </button>
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            <p className="privacy-note">⌁ Your brief is sent to your local Ollama model through your local backend.</p>
          </div>

          <div className="panel preview-panel" id="results">
            <div className="panel-heading">
              <div>
                <div className="step-label">STEP 02</div>
                <h2>Your gig kit</h2>
              </div>
              <span className="draft-badge">{result ? "GENERATED" : "AWAITING BRIEF"}</span>
            </div>

            {!result && !loading && (
              <div className="empty-state">
                <div className="empty-art"><span>✳</span><i>↗</i><b>₹</b></div>
                <h3>Your next gig starts here.</h3>
                <p>Submit a client brief to generate your project summary, deliverables, pricing draft and client reply.</p>
                <div className="empty-features">
                  <span>01 <b>Understand the brief</b></span>
                  <span>02 <b>Spot unclear scope</b></span>
                  <span>03 <b>Prepare your reply</b></span>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loader-ring" />
                <h3>Building your gig kit...</h3>
                <p>Your local model is analysing the client brief.</p>
              </div>
            )}

            {result && (
              <div className="results-list">
                {sections.map((section) => (
                  <article className="result-card" key={section.key}>
                    <div className="result-title">
                      <span className="result-icon">{section.icon}</span>
                      <h3>{section.title}</h3>
                      <button onClick={() => copyText(section.key, section.text)}>
                        {copied === section.key ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <p>{section.text}</p>
                  </article>
                ))}

                <article className="result-card">
                  <div className="result-title">
                    <span className="result-icon">☑</span>
                    <h3>Deliverables</h3>
                    <button onClick={() => copyText("deliverables", result.deliverables.join("\n"))}>
                      {copied === "deliverables" ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <ul>{result.deliverables.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </article>

                <article className="result-card warning-card">
                  <div className="result-title">
                    <span className="result-icon">!</span>
                    <h3>Scope risks</h3>
                    <button onClick={() => copyText("scope_risks", result.scope_risks.join("\n"))}>
                      {copied === "scope_risks" ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <ul>{result.scope_risks.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </article>

                <article className="result-card">
                  <div className="result-title">
                    <span className="result-icon">?</span>
                    <h3>Questions to clarify</h3>
                    <button onClick={() => copyText("questions", result.clarifying_questions.join("\n"))}>
                      {copied === "questions" ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <ul>{result.clarifying_questions.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </article>

                <p className="estimate-disclaimer">
                  AI-generated estimates are indicative only. Confirm requirements, pricing and timelines with the client before committing.
                </p>
                <button className="reset-button" onClick={() => { setResult(null); setMessage(""); setError(""); }}>
                  + Create another gig kit
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-brand"><span className="brand-mark small">G</span> GigPilot AI</div>
          <span>Built for freelancers who'd rather spend less time planning and more time delivering.</span>
          <span className="footer-open">OPEN-WEIGHT AI · LOCAL FIRST</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
