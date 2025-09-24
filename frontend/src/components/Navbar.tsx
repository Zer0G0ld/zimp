"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleThemeToggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", next);
      return next;
    });
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo / Brand */}
      <Link href="/" className={styles.brandLink}>
        <Image src="/zimp.png" alt="ZIMP" width={40} height={40} />
      </Link>

      {/* Hamburger menu (mobile) */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu />
      </button>

      {/* Links */}
      <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        <Link href="/" className={styles.link}>
          Sobre
        </Link>
        
      </div>

      {/* Actions: theme, notifications */}
      <div className={styles.actions}>
        {/* Tema */}
        <button className={styles.themeToggle} onClick={handleThemeToggle}>
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        {/* Notificações */}
        <button className={styles.notifications}>
          <Bell />
          <span className={styles.badge}></span>
        </button>
      </div>
    </nav>
  );
}
