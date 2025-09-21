import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <div className="logo">👹 NightForge</div>
          <div className="tag">Forge the dark web & bots — Mr Dev</div>
        </div>

        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/builder">Builder</Link>
          <Link href="/copier">Copier</Link>
          <Link href="/devtools">Dev Tools</Link>
        </nav>
      </div>
    </header>
  );
}
