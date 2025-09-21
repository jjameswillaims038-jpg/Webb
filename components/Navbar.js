"use client";
import Link from "next/link";
import { useState } from "react";
import { FaHome, FaTools, FaRocket, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <div className="brand">
          <div className="logo">👹 NightForge</div>
          <div className="tag">Forge the dark web & bots — Mr Dev</div>
        </div>

        {/* nav links — add 'active' when mobile open */}
        <nav className={`nav-links ${open ? "active" : ""}`} aria-label="Main navigation">
          <Link href="/"><a><FaHome style={{verticalAlign:'middle'}} /> Home</a></Link>
          <Link href="/builder"><a><FaRocket style={{verticalAlign:'middle'}} /> Builder</a></Link>
          <Link href="/copier"><a><FaTools style={{verticalAlign:'middle'}} /> Copier</a></Link>
          <Link href="/devtools"><a><FaTools style={{verticalAlign:'middle'}} /> Dev Tools</a></Link>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}
