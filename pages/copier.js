import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnlockWrapper from "../components/UnlockWrapper";

export default function Copier() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState("idle");

  const startCopy = async () => {
    if (!/^https?:\/\//i.test(url)) return alert("Enter a full https:// URL");

    setStage("fetching");
    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!res.ok) throw new Error("Failed to fetch site");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `site.zip`;
      link.click();
      setStage("done");
    } catch (err) {
      console.error(err);
      alert("Error copying site: " + err.message);
      setStage("idle");
    }
  };

  return (
    <>
      <Navbar />
      <UnlockWrapper>
        <main style={{ maxWidth: 1100, margin: "20px auto", padding: 20 }}>
          <h1 style={{ color: "var(--accent)" }}>👁️ NightForge Web Copier</h1>
          <p style={{ color: "var(--muted)" }}>
            Paste a public URL to download a full ZIP of the website (HTML + CSS + JS + assets).
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ flex: 1 }}
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button className="btn-primary" onClick={startCopy}>
              {stage === "fetching" ? "⏳ Copying..." : "⚡ Copy Website"}
            </button>
          </div>

          {stage === "done" && <p style={{ color: "var(--neon)", marginTop: 12 }}>✅ ZIP download started!</p>}
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
