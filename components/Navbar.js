import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="logo">👹 NightForge</Link>
        <div className="links">
          <Link href="/builder">Builder</Link>
          <Link href="/copier">Copier</Link>
          <Link href="/devtools">Dev Tools</Link>
          <Link href="/tools">All Tools</Link>
        </div>
      </div>
    </nav>
  );
}
