"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { LayoutDashboard, Printer, ScrollText, Settings2, ChevronLeft, ChevronRight } from "lucide-react";

const menuGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
      { href: "/devices/1", icon: <Printer size={20} />, label: "Dispositivo" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/logs", icon: <ScrollText size={20} />, label: "Logs" },
      { href: "/settings", icon: <Settings2 size={20} />, label: "Configurações" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Sidebar"
    >
      {/* Toggle botão */}
      <div className={styles.toggleContainer}>
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu agrupado */}
      <nav>
        {menuGroups.map((group) => (
          <div key={group.label} className={styles.menuGroup}>
            {!collapsed && <span className={styles.groupLabel}>{group.label}</span>}
            <ul className={styles.menu}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.link} ${isActive ? styles.active : ""}`}
                      title={item.label}
                    >
                      <div className={styles.iconWrapper}>{item.icon}</div>
                      {!collapsed && <span className={styles.label}>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
