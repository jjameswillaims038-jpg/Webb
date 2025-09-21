import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="home">
        {/* HERO */}
        <section className="hero">
          <h1>👹 NightForge</h1>
          <p>Forge the Darkest Web Tools – Crafted by <strong>Mr Dev</strong></p>
          <button className="cta-btn">⚡ Start Forging</button>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>🕸️ Core Features</h2>
          <div className="grid">
            <div className="card">
              <h3>🕷 Web Builder</h3>
              <p>Create full pro websites with builder wizard + zip export.</p>
            </div>
            <div className="card">
              <h3>👁 Web Copier</h3>
              <p>Copy websites, styles & assets into your own pack.</p>
            </div>
            <div className="card">
              <h3>💀 Dev Tools</h3>
              <p>Bot builder, code modifier, bot cloner – all in one place.</p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <h2>📊 Dark Stats</h2>
          <div className="grid">
            <div><h3>10K+</h3><p>Websites Forged</p></div>
            <div><h3>5K+</h3><p>Bots Built</p></div>
            <div><h3>∞</h3><p>Dark Energy</p></div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <h2>🗡️ What Dark Users Say</h2>
          <div className="grid">
            <div className="card">
              <p>“NightForge made me a full site in minutes. Looks like a real dev coded it.”</p>
              <h4>— ShadowHunter</h4>
            </div>
            <div className="card">
              <p>“The bot builder saved me weeks. Pure dark magic 🔮.”</p>
              <h4>— PhantomX</h4>
            </div>
            <div className="card">
              <p>“Copy-paste a site? Done. Mr Dev is a wizard fr.”</p>
              <h4>— GhostDev</h4>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq">
          <h2>❓ Dark FAQ</h2>
          <div className="faq-item">
            <h4>Is NightForge free?</h4>
            <p>Yes, core tools are free. Some unlock require ad support.</p>
          </div>
          <div className="faq-item">
            <h4>Can I really build a site without coding?</h4>
            <p>100%. Use the builder wizard → export → deploy.</p>
          </div>
          <div className="faq-item">
            <h4>Will my bot work on Telegram?</h4>
            <p>Yes. Just paste your API token into the generated code.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <h2>⚡ Ready to Forge Your Power?</h2>
          <p>Start building dark tools now with Mr Dev’s NightForge.</p>
          <button className="cta-btn">🚀 Enter The Forge</button>
        </section>
      </main>
      <Footer />
    </>
  );
}
