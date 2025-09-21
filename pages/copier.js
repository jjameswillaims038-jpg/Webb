import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnlockWrapper from "../components/UnlockWrapper";

export default function Copier() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [stage, setStage] = useState("idle");
  const [loading, setLoading] = useState(false);

  const startCopy = async () => {
    if (!/^https?:\/\//i.test(url)) return alert("Enter full https:// URL");

    setStage("fetch");
    setLoading(true);

    try {
      const res = await fetch("/api/copy-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Failed to copy site");

      setStage("package");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "site.zip";
      link.click();

      setStage("done");
      setPreview(url);

    } catch (err) {
      console.error(err);
      alert("Error copying site: " + err.message);
      setStage("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <UnlockWrapper>
        <main style={{ maxWidth: 1100, margin: "20px auto", padding: 20 }}>
          <h1 style={{ color: "var(--accent)" }}>👁️ Web Copier — Full</h1>
          <p style={{ color: "var(--muted)" }}>
            Paste a public URL to download a fully packaged website ZIP including CSS, JS, images, and README.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              style={{ flex: 1 }}
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn-primary" onClick={startCopy} disabled={loading}>
              {loading ? "⏳ Copying..." : "⚡ Copy Site"}
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <strong>Progress:</strong> {stage}
            <div
              style={{
                height: 8,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 4,
                overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  height: 8,
                  width:
                    stage === "idle"
                      ? "0%"
                      : stage === "fetch"
                      ? "25%"
                      : stage === "package"
                      ? "85%"
                      : "100%",
                  background: "linear-gradient(90deg,var(--neon),var(--accent))",
                }}
              />
            </div>
          </div>

          {preview && (
            <div style={{ marginTop: 16 }}>
              <h4>Preview</h4>
              <iframe
                src={preview}
                style={{ width: "100%", height: 480, border: "1px solid var(--panel)" }}
              />
              <p style={{ color: "var(--muted)" }}>
                ZIP includes index.html, CSS/JS folders, assets, and README for deployment.
              </p>
            </div>
          )}
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
