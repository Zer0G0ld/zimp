"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import {
  Bell,
  LayoutDashboard,
  Printer,
  ScrollText,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const notifications = [
    { id: 1, text: "Novo dispositivo conectado", href: "/devices/1" },
    { id: 2, text: "Atualização disponível", href: "/updates" },
    { id: 3, text: "Erro no servidor", href: "/logs" },
  ];

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showNotifications && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (collapsed && rect.right > window.innerWidth) {
        setDropdownPosition('left');
      } else {
        setDropdownPosition('right');
      }
    }
  }, [showNotifications, collapsed]);



  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`} aria-label="Sidebar">
      {/* Toggle + Brand */}
      <div className={styles.toggleContainer}>
      <Link href="/" className={styles.brandLink} title="Página Inicial">
        {!collapsed && <Image src="/zimp.svg" alt="ZIMP" className={styles.brandSvg} width={90} height={90} />}
      </Link>

      <button onClick={toggleSidebar} className={styles.toggleButton} title={collapsed ? "Expandir" : "Recolher"}>
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>


      {/* Menu agrupado */}
      <nav>
        {menuGroups.map(group => (
          <div key={group.label} className={styles.menuGroup}>
            {!collapsed && <span className={styles.groupLabel}>{group.label}</span>}
            <ul className={styles.menu}>
              {group.items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.link} ${isActive ? styles.active : ""}`}
                      title={collapsed ? item.label : ""}
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

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <button 
          onClick={toggleNotifications} 
          className={styles.notifications} 
          title="Notificações"
          // ref={dropdownRef}  <- REMOVA ESSA LINHA
        >
          <Bell />
          <span className={styles.badge}>{notifications.length}</span>
          {!collapsed && <span className={styles.footerLabel}>Alertas</span>}
        </button>

        {showNotifications && (
          <div
            ref={dropdownRef} // ref agora só no dropdown
            className={`${styles.notificationsDropdown} ${dropdownPosition}`}
            style={{
              position: 'fixed',
              bottom: 70,
              right: dropdownPosition === 'right' ? 20 : undefined,
              left: dropdownPosition === 'left' ? 20 : undefined,
            }}
          >
            {notifications.map(n => (
              <div key={n.id} className={styles.notificationItem}>
                {n.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
