export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>NightForge</h4>
          <p>👹 NightForge v1.0 — Forged in Darkness</p>
          <p>
            Crafted by <strong>Mr Dev</strong>
          </p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>
            <a
              href="https://wa.me/2349164624021"
              target="_blank"
              rel="noreferrer"
              className="footer-whatsapp"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                alt="WhatsApp"
                width="20"
                height="20"
                style={{ marginRight: "8px" }}
              />
              Chat with Dev
            </a>
          </p>
        </div>

        <div>
          <h4>Legal</h4>
          <p>
            <small>Use responsibly.</small>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NightForge — Mr Dev</span>
      </div>
    </footer>
  );
}
