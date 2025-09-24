"use client";

import styles from "./Navbar.module.css";
import { useState } from "react";
import Link from "next/link";
import {
    UserCircle,
    Bell,
    Menu,
    Moon,
    Sun,
    ChevronDown
} from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleThemeToggle = () => {
        setTheme(prev => {
            const next = prev === "light" ? "dark" : "light";
            document.body.setAttribute("data-theme", next);
            return next;
        });

    };

    return (
        <nav className={`${styles.navbar} ${styles[theme]}`}>
            <h1 className={styles.brand}>ZIMP</h1>
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                <Menu />
            </button>
            <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/about" className={styles.link}>Sobre</Link>
                <Link href="/contact" className={styles.link}>Contato</Link>
            </div>
            <div className={styles.actions}>
                <button className={styles.themeToggle} onClick={handleThemeToggle}>
                    {theme === "light" ? <Moon /> : <Sun />}
                </button>
                <button className={styles.notifications}>
                    <Bell />
                    <span className={styles.badge}>3</span>
                </button>
                <div className={styles.userMenu}>
                    <button className={styles.user} onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <UserCircle className={styles.avatar} />
                        Usuário
                        <ChevronDown />
                    </button>
                    {dropdownOpen && (
                        <div className={styles.dropdown}>
                            <a href="/profile" className={styles.dropdownItem}>Perfil</a>
                            <a href="/settings" className={styles.dropdownItem}>Configurações</a>
                            <button className={styles.logout}>Sair</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}