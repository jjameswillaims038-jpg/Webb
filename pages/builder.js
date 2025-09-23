import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnlockWrapper from "../components/UnlockWrapper";
import JSZip from "jszip";

export default function Builder() {
  const [step, setStep] = useState(1);
  const [siteTitle, setSiteTitle] = useState("NightForge Pro");
  const [tagline, setTagline] = useState("Forged with precision by Mr Dev");
  const [about, setAbout] = useState(
    "NightForge helps you spin up a modern, responsive website in minutes — optimized for speed, beauty, and deployment."
  );
  const [features, setFeatures] = useState([
    "⚡ Lightning Fast",
    "🎨 Sleek Dark Theme",
    "🚀 Ready to Deploy",
  ]);
  const [navLinks, setNavLinks] = useState([
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
  ]);
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [previewHTML, setPreviewHTML] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    buildPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteTitle, tagline, about, features, navLinks, logoDataUrl]);

  function buildPreview() {
    const featuresHtml = features.map((f) => `<div class="feature-card">${f}</div>`).join("");
    const navHtml = navLinks.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
    const logoTag = logoDataUrl
      ? `<img src="logo.png" class="site-logo" alt="logo">`
      : `<div class="site-logo-placeholder">NF</div>`;
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(siteTitle)}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      ${logoTag}
      <nav class="site-nav">${navHtml}</nav>
    </div>
  </header>

  <section class="site-hero">
    <h1>${escapeHtml(siteTitle)}</h1>
    <p class="tag">${escapeHtml(tagline)}</p>
    <a href="#about" class="btn-cta">Learn More</a>
  </section>

  <main>
    <section id="about" class="site-section">
      <h2>About</h2>
      <p>${escapeHtml(about)}</p>
    </section>

    <section id="features" class="site-section">
      <h2>Features</h2>
      <div class="features-grid">${featuresHtml}</div>
    </section>
  </main>

  <footer class="site-footer">
    <p>Generated with ❤️ by Mr Dev — NightForge</p>
  </footer>
</body>
</html>`;
    setPreviewHTML(html);

    if (iframeRef.current) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }

  function escapeHtml(s) {
    return (s || "").toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  const onLogoFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(f);
  };

  async function downloadZip() {
    const zip = new JSZip();
    const css = `
/* Reset & base */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "Inter", system-ui, sans-serif;
  margin: 0;
  background: #0a0a0f;
  color: #f5f5f7;
  line-height: 1.6;
}

/* Header */
.site-header {
  background: #0e0e15;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.site-logo { height: 42px; }
.site-logo-placeholder {
  height: 42px; width: 42px;
  background: #222; color: #fff;
  display: flex; align-items: center; justify-content: center;
  border-radius: 6px; font-weight: 700;
}
.site-nav a {
  margin-left: 20px;
  color: #00ffcc;
  text-decoration: none;
  font-weight: 500;
}
.site-nav a:hover { color: #ff004c; }

/* Hero */
.site-hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg,#0f0f18,#050507);
}
.site-hero h1 { font-size: 3rem; color: #ff004c; margin-bottom: 16px; }
.site-hero .tag { font-size: 1.2rem; color: #ddd; margin-bottom: 24px; }
.btn-cta {
  display: inline-block;
  padding: 12px 24px;
  background: #00ff99;
  color: #000;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}
.btn-cta:hover { background: #ff004c; color: #fff; }

/* Sections */
.site-section {
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
}
.site-section h2 { color: #00ffcc; margin-bottom: 16px; }

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 20px;
}
.feature-card {
  background: #161622;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  text-align: center;
  transition: transform 0.2s ease;
}
.feature-card:hover { transform: translateY(-4px); }

/* Footer */
.site-footer {
  text-align: center;
  padding: 30px 20px;
  background: #0e0e15;
  color: #999;
  margin-top: 60px;
  font-size: 0.9rem;
}
`;
    zip.file("index.html", previewHTML);
    zip.file("style.css", css);
    if (logoDataUrl) {
      const bin = dataURLtoBlob(logoDataUrl);
      zip.file("logo.png", bin);
    }
    zip.file("README.md", `# ${siteTitle}\n\nGenerated by NightForge Pro (Mr Dev).\n\nOpen index.html to preview locally or deploy to Vercel/Netlify.\n`);
    const content = await zip.generateAsync({ type: "blob" });
    saveBlobAs(content, `${siteTitle.replace(/\s+/g, "_")}.zip`);
  }

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  function saveBlobAs(blob, name) {
    if (typeof window === "undefined") return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <Navbar />
      <UnlockWrapper>
        <main style={{ maxWidth: 1100, margin: "20px auto", padding: "20px" }}>
          <h1 style={{ color: "var(--accent)" }}>🕸️ NightForge — Pro Web Builder</h1>

          <div className="builder-layout">
            <div>
              {/* Steps remain same */}
              {step === 1 && (
                <section className="step-panel">
                  <h3>Step 1 — Site Info</h3>
                  <label>
                    Site Title
                    <input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
                  </label>
                  <label>
                    Tagline
                    <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                  </label>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-primary" onClick={() => setStep(2)}>
                      Next
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="step-panel">
                  <h3>Step 2 — About & Features</h3>
                  <label>
                    About
                    <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4}></textarea>
                  </label>
                  <label>
                    Features (comma-separated)
                    <input
                      value={features.join(", ")}
                      onChange={(e) =>
                        setFeatures(e.target.value.split(",").map((s) => s.trim()))
                      }
                    />
                  </label>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-ghost" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button className="btn-primary" onClick={() => setStep(3)}>
                      Next
                    </button>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="step-panel">
                  <h3>Step 3 — Navigation Links</h3>
                  {navLinks.map((l, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        value={l.label}
                        onChange={(e) => {
                          const arr = [...navLinks];
                          arr[i].label = e.target.value;
                          setNavLinks(arr);
                        }}
                        placeholder="Label"
                      />
                      <input
                        value={l.href}
                        onChange={(e) => {
                          const arr = [...navLinks];
                          arr[i].href = e.target.value;
                          setNavLinks(arr);
                        }}
                        placeholder="Href"
                      />
                    </div>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => setNavLinks([...navLinks, { label: "New", href: "#" }])}>
                      + Add Link
                    </button>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-ghost" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button className="btn-primary" onClick={() => setStep(4)}>
                      Next
                    </button>
                  </div>
                </section>
              )}

              {step === 4 && (
                <section className="step-panel">
                  <h3>Step 4 — Upload Logo</h3>
                  <input type="file" accept="image/*" onChange={onLogoFile} />
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-ghost" onClick={() => setStep(3)}>
                      Back
                    </button>
                    <button className="btn-primary" onClick={() => setStep(5)}>
                      Next
                    </button>
                  </div>
                </section>
              )}

              {step === 5 && (
                <section className="step-panel">
                  <h3>Step 5 — Review & Download</h3>
                  <p>Preview below. When ready, download a ZIP with index.html, style.css and assets.</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn-ghost" onClick={() => setStep(4)}>
                      Back
                    </button>
                    <button className="btn-primary" onClick={downloadZip}>
                      📦 Download ZIP
                    </button>
                  </div>
                </section>
              )}
            </div>

            <aside>
              <div style={{ position: "sticky", top: 20 }}>
                <h4 style={{ marginTop: 0, color: "var(--neon)" }}>Live Preview</h4>
                <div style={{ border: "1px solid var(--panel)", borderRadius: 8, overflow: "hidden" }}>
                  <iframe title="preview" ref={iframeRef} style={{ width: "100%", height: 520, border: 0 }} />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
