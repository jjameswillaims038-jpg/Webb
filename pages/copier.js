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
        body: JSON.stringify({ url }),
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
        <main className="container section">
          <h1 className="section-title">👁️ NightForge Web Copier</h1>
          <p className="section-subtitle">
            Paste a public URL to download a full ZIP of the website (HTML + CSS + JS + assets).
          </p>

          <div className="form-row">
            <input
              className="input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn" onClick={startCopy}>
              {stage === "fetching" ? "⏳ Copying..." : "⚡ Copy Website"}
            </button>
          </div>

          {stage === "done" && (
            <p className="success-msg">✅ ZIP download!</p>
          )}
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
