import { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnlockWrapper from "../components/UnlockWrapper";

export default function Builder() {
  const [siteTitle, setSiteTitle] = useState("NightForge Pro");
  const [tagline, setTagline] = useState("Forged with precision by Mr Dev");
  const [about, setAbout] = useState(
    "NightForge builds modern, responsive websites in minutes — optimized for speed, style, and deployment."
  );
  const [features, setFeatures] = useState(["Fast", "Dark theme", "Deploy-ready"]);
  const [navLinks, setNavLinks] = useState([
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
  ]);
  const [logoDataUrl, setLogoDataUrl] = useState(null);

  const [sitePrompt, setSitePrompt] = useState(
    "Build a professional dark landing page with hero, features, about, and footer."
  );
  const [genHtml, setGenHtml] = useState("");
  const [genCss, setGenCss] = useState("");
  const [assets, setAssets] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const iframeRef = useRef(null);
  const [previewHTML, setPreviewHTML] = useState("");

  useEffect(() => {
    if (genHtml) {
      writePreview(genHtml, genCss);
    } else {
      writePreview(buildFallbackHtml(), null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genHtml, genCss, siteTitle, tagline, about, features, navLinks, logoDataUrl]);

  function writePreview(html, css) {
    let final = html;
    if (css) {
      if (!/<\/head>/i.test(final)) {
        final = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${final}</body></html>`;
      } else {
        final = final.replace(/<\/head>/i, `<style>${css}</style></head>`);
      }
    }
    setPreviewHTML(final);
    if (iframeRef.current) {
      try {
        const doc = iframeRef.current.contentWindow.document;
        doc.open();
        doc.write(final);
        doc.close();
      } catch (e) {
        console.error("Preview write failed", e);
      }
    }
  }

  function buildFallbackHtml() {
    const featuresHtml = features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
    const navHtml = navLinks
      .map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`)
      .join(" ");
    const logoTag = logoDataUrl
      ? `<img src="logo.png" class="site-logo" alt="logo">`
      : `<div class="site-logo-placeholder">NF</div>`;

    return `<!doctype html>
<html>
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
  </section>
  <main>
    <section id="about" class="site-section">
      <h2>About</h2>
      <p>${escapeHtml(about)}</p>
    </section>
    <section id="features" class="site-section">
      <h2>Features</h2>
      <ul>${featuresHtml}</ul>
    </section>
  </main>
  <footer class="site-footer">Generated with ❤️ by NightForge</footer>
</body>
</html>`;
  }

  function escapeHtml(s) {
    return (s || "")
      .toString()
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

  async function generateSite() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "Website Builder",
          input: JSON.stringify({ siteTitle, tagline, about, features, navLinks, sitePrompt }),
          instructions:
            "Return JSON with keys: html, css, assets (object mapping filename to base64 data URLs, optional). Html should be a full webpage without <style> tags.",
        }),
      });
      const data = await res.json();
      setLoading(false);
      const parsed = JSON.parse(data.result);
      setGenHtml(parsed.html || "");
      setGenCss(parsed.css || "");
      setAssets(parsed.assets || {});
      writePreview(parsed.html, parsed.css);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Generation failed.");
    }
  }

  async function downloadZip() {
    const zip = new JSZip();
    const html = genHtml || buildFallbackHtml();
    const css = genCss || defaultCss();
    zip.file("index.html", html);
    zip.file("style.css", css);

    if (assets && typeof assets === "object") {
      for (const [name, dataUrl] of Object.entries(assets)) {
        const bin = dataURLtoBlob(dataUrl);
        zip.file(name, bin);
      }
    } else if (logoDataUrl) {
      const bin = dataURLtoBlob(logoDataUrl);
      zip.file("logo.png", bin);
    }

    zip.file("README.md", `# ${siteTitle}\n\nGenerated with NightForge.\n`);
    const content = await zip.generateAsync({ type: "blob" });
    saveBlob(content, `${siteTitle.replace(/\s+/g, "_")}.zip`);
  }

  function defaultCss() {
    return `
:root { --bg:#07070a; --panel:#0b0b10; --muted:#aaa; --accent:#ff004c; --neon:#00ff99; --text:#e9f7ee; }
body { font-family: Inter, system-ui, sans-serif; margin: 0; background: var(--bg); color: var(--text); }
.site-header{ background:var(--panel); padding:12px;}
.site-hero{ padding:60px 20px; text-align:center; background:linear-gradient(180deg,#0f0f18,#050507);}
.site-hero h1{ color:var(--accent);} .site-section{ max-width:900px; margin:32px auto; padding:0 20px;}
.site-footer{ text-align:center; padding:20px; background:var(--panel); color:var(--muted);}
`;
  }

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  function saveBlob(blob, name) {
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
        <main className="container section">
          <h1 className="section-title">🕸️ NightForge Pro Web Builder</h1>
          <section className="card step-panel">
            <label>
              Describe your site
              <textarea className="input" rows={3} value={sitePrompt} onChange={(e) => setSitePrompt(e.target.value)} />
            </label>
            <label>
              Site Title
              <input className="input" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
            </label>
            <label>
              Tagline
              <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </label>
            <label>
              About
              <textarea className="input" rows={2} value={about} onChange={(e) => setAbout(e.target.value)} />
            </label>
            <label>
              Features (comma separated)
              <input className="input" value={features.join(", ")} onChange={(e) => setFeatures(e.target.value.split(",").map(s => s.trim()))} />
            </label>
            <label>
              Nav Links (label:href, one per line)
              <textarea
                className="input"
                rows={3}
                value={navLinks.map(n => `${n.label}:${n.href}`).join("\n")}
                onChange={(e) =>
                  setNavLinks(
                    e.target.value.split("\n").map(line => {
                      const [label, href] = line.split(":");
                      return { label: label?.trim() || "", href: href?.trim() || "#" };
                    })
                  )
                }
              />
            </label>
            <label>
              Upload logo
              <input type="file" accept="image/*" onChange={onLogoFile} />
            </label>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" disabled={loading} onClick={generateSite}>
                🚀 Generate
              </button>
              <button className="btn" onClick={downloadZip}>
                📦 Download ZIP
              </button>
            </div>
            {loading && <p className="muted">Generating...</p>}
            {error && <p className="muted" style={{ color: "salmon" }}>{error}</p>}
          </section>

          <aside className="card" style={{ marginTop: 16 }}>
            <h4>Preview</h4>
            <iframe ref={iframeRef} style={{ width: "100%", height: 500, border: 0 }} title="preview" />
          </aside>
        </main>
      </UnlockWrapper>
      <Footer />
    </>
  );
}
