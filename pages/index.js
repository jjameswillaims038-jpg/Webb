import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="home">
        {/* HERO */}
        <section className="hero">
          <h1>👹 NightForge</h1>
          <p>
            Forge the Darkest Web Tools – Crafted by <strong>Mr Dev</strong>
          </p>
          <Link href="/tools" className="cta-btn">
            ⚡ Start Forging
          </Link>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>🕸️ Core Features</h2>
          <div className="grid">
            <Link href="/builder" className="card">
              <h3>🕷 Web Builder</h3>
              <p>Create full pro websites with builder wizard + zip export.</p>
            </Link>
            <Link href="/copier" className="card">
              <h3>👁 Web Copier</h3>
              <p>Copy websites, styles & assets into your own pack.</p>
            </Link>
            <Link href="/devtools" className="card">
              <h3>💀 Dev Tools</h3>
              <p>Bot builder, code modifier, bot cloner – all in one place.</p>
            </Link>
          </div>
        </section>

        {/* DARK ARSENAL */}
        <section className="arsenal">
          <h2>🔥 Dark Arsenal</h2>
          <p>The ultimate set of dark-web utilities – pick your weapon:</p>
          <div className="grid">
            <div className="card">
              <h3>⚡ Auto Zip</h3>
              <p>Bundle your builds into ready-to-deploy packs.</p>
            </div>
            <div className="card">
              <h3>🕶 Shadow Hosting</h3>
              <p>One-click Vercel/Netlify deploy scripts.</p>
            </div>
            <div className="card">
              <h3>🔗 Link Encryptor</h3>
              <p>Obfuscate and protect URLs before sharing.</p>
            </div>
            <div className="card">
              <h3>🎭 Theme Switch</h3>
              <p>Swap color palettes with one command.</p>
            </div>
          </div>
        </section>

        {/* QUICK START */}
        <section className="quickstart">
          <h2>⚡ Quick Start</h2>
          <div className="steps">
            <div className="step">
              <span>1</span>
              <h4>Select a Tool</h4>
              <p>Pick a builder, copier or dark utility.</p>
            </div>
            <div className="step">
              <span>2</span>
              <h4>Customize</h4>
              <p>Add your dark flavor – no coding required.</p>
            </div>
            <div className="step">
              <span>3</span>
              <h4>Forge & Deploy</h4>
              <p>Export your site or bot and launch instantly.</p>
            </div>
          </div>
          <Link href="/tools" className="cta-btn">
            🚀 Enter The Forge
          </Link>
        </section>

        {/* CTA */}
        <section className="cta">
          <h2>⚡ Ready to Unleash the Darkness?</h2>
          <p>Start forging tools now with Mr Dev’s NightForge.</p>
          <Link href="/tools" className="cta-btn">
            🔥 Begin Now
          </Link>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .home {
          padding: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        section {
          margin-bottom: 60px;
          text-align: center;
        }
        h1 {
          font-size: 2.2rem;
          margin-bottom: 12px;
          color: var(--accent);
        }
        h2 {
          font-size: 1.6rem;
          margin-bottom: 16px;
          color: var(--neon);
        }
        .hero p {
          color: var(--muted);
          margin-bottom: 20px;
        }
        .cta-btn {
          display: inline-block;
          background: #ff004c;
          color: #fff;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .card {
          background: #0c0c12;
          border: 1px solid #111;
          border-radius: 10px;
          padding: 20px;
          text-align: left;
        }
        .card h3 {
          margin: 0 0 8px;
          color: var(--accent);
        }
        .card p {
          color: var(--muted);
          margin: 0;
        }
        .steps {
          display: grid;
          gap: 16px;
        }
        .step {
          background: #0c0c12;
          border: 1px solid #111;
          padding: 16px;
          border-radius: 8px;
          text-align: left;
        }
        .step span {
          display: inline-block;
          background: var(--accent);
          color: #000;
          font-weight: bold;
          padding: 4px 10px;
          border-radius: 50%;
          margin-bottom: 8px;
        }
        .cta {
          background: linear-gradient(180deg, #0f0f18, #050507);
          padding: 40px 20px;
          border-radius: 12px;
        }
        /* Larger screens */
        @media (min-width: 700px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1000px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .arsenal .grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .steps {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  );
}
