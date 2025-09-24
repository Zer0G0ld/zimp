"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { LayoutDashboard, Printer, ScrollText, Settings2 } from "lucide-react";

const menuItems = [
  { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/devices/1", icon: <Printer size={20} />, label: "Dispositivo" },
  { href: "/logs", icon: <ScrollText size={20} />, label: "Logs" },
  { href: "/settings", icon: <Settings2 size={20} />, label: "Configurações" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar} aria-label="Sidebar">
      <Link href="/" className={styles.titleLink}>
        <h2 className={styles.title}>ZIMP</h2>
      </Link>
      <nav>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${pathname === item.href ? styles.active : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
