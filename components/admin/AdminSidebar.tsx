"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./AdminSidebar.module.css";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users size={20} />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <FileText size={20} />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={20} />,
  },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Always open on desktop
      } else {
        setIsOpen(false); // Closed by default on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div className={styles.overlay} onClick={toggleSidebar} />
      )}

      {/* Mobile menu button */}
      <Button
        variant="outline"
        className={styles.menuButton}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${
          isMobile ? styles.mobile : ""
        }`}
      >
        <div className={styles.sidebarContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>A</div>
            {!isMobile && <span className={styles.logoText}>Admin</span>}
          </div>

          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {(!isMobile || isOpen) && (
                    <span className={styles.menuLabel}>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
