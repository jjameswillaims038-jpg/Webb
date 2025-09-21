export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>NightForge</h4>
          <p>👹 NightForge v1.0 — Forged in Darkness</p>
          <p>Crafted by <strong>Mr Dev</strong></p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>WhatsApp: <a href="https://wa.me/2349164624021" target="_blank" rel="noreferrer">+234 916 462 4021</a></p>
          <p>Email: <a href="mailto:mrdev@nightforge.example">mrdev@nightforge.example</a></p>
        </div>

        <div>
          <h4>Follow</h4>
          <p><a href="https://www.facebook.com/share/g/1AxuTVmdHg/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a></p>
        </div>

        <div>
          <h4>Legal</h4>
          <p><small>Use responsibly.</small></p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NightForge — Mr Dev</span>
      </div>
    </footer>
  );
}
