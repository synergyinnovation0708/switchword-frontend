"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicUser } from "@/lib/types";
import { SignOutButton } from "./sign-out-button";

const adminNavItems = [
  { key: "dashboard", label: "Dashboard", href: "/admin/dashboard" },
  { key: "users", label: "Users", href: "/admin/users" },
  { key: "stress-finder", label: "Stress Finder", href: "/admin/stress-finder" },
  { key: "subscriptions", label: "Subscription Plans", href: "/admin/subscriptions" },
] as const;

function AdminHomeIcon() {
  return (
    <svg aria-hidden="true" className="admin-sidebar-icon" viewBox="0 0 20 20">
      <path
        d="M3.9 8.2 10 3.6l6.1 4.6v7a1 1 0 0 1-1 1h-3.2v-4.3H8.1v4.3H4.9a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function AdminListIcon() {
  return (
    <svg aria-hidden="true" className="admin-sidebar-icon" viewBox="0 0 20 20">
      <path
        d="M5.2 5.4h9.2M5.2 10h9.2M5.2 14.6h9.2M3.4 5.4h.01M3.4 10h.01M3.4 14.6h.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function AdminSparkIcon() {
  return (
    <svg aria-hidden="true" className="admin-sidebar-icon" viewBox="0 0 20 20">
      <path
        d="M10 2.9v4.2M10 12.9v4.2M17.1 10h-4.2M7.1 10H2.9M14.9 5.1l-3 3M8.1 11.9l-3 3M14.9 14.9l-3-3M8.1 8.1l-3-3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function AdminPriceIcon() {
  return (
    <svg aria-hidden="true" className="admin-sidebar-icon" viewBox="0 0 20 20">
      <path
        d="M6.2 5.3h5.5a2.3 2.3 0 1 1 0 4.6H8.3a2.3 2.3 0 1 0 0 4.6h5.5M10 3.6v12.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function AdminMenuIcon() {
  return (
    <svg aria-hidden="true" className="admin-sidebar-toggle-icon" viewBox="0 0 20 20">
      <path
        d="M4 6h12M4 10h12M4 14h12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AdminCollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg aria-hidden="true" className="admin-sidebar-toggle-icon" viewBox="0 0 20 20">
      <path
        d={collapsed ? "M8 5.5 12.5 10 8 14.5" : "M12 5.5 7.5 10 12 14.5"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getItemIcon(key: (typeof adminNavItems)[number]["key"]) {
  switch (key) {
    case "dashboard":
      return <AdminHomeIcon />;
    case "users":
      return <AdminListIcon />;
    case "stress-finder":
      return <AdminSparkIcon />;
    case "subscriptions":
      return <AdminPriceIcon />;
    default:
      return null;
  }
}

export function AdminShell({
  viewer,
  active,
  children,
}: {
  viewer: PublicUser;
  active: (typeof adminNavItems)[number]["key"];
  children: React.ReactNode;
}) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const syncSidebarState = () => {
      const mobileViewport = window.innerWidth < 960;
      const compactViewport = window.innerWidth < 1280;

      setIsMobileViewport(mobileViewport);

      if (mobileViewport) {
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
        return;
      }

      setIsSidebarOpen(true);
      setIsSidebarCollapsed(compactViewport);
    };

    syncSidebarState();
    window.addEventListener("resize", syncSidebarState);
    return () => window.removeEventListener("resize", syncSidebarState);
  }, []);

  const shellClassName = [
    "admin-app-shell",
    isSidebarCollapsed && !isMobileViewport ? "admin-app-shell-collapsed" : "",
    isMobileViewport ? "admin-app-shell-mobile" : "",
    isMobileViewport && isSidebarOpen ? "admin-app-shell-mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const sidebarClassName = [
    "admin-sidebar",
    isSidebarCollapsed ? "admin-sidebar-collapsed" : "",
    isSidebarOpen ? "admin-sidebar-open" : "",
    isMobileViewport ? "admin-sidebar-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleNavClick = () => {
    if (isMobileViewport) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <main className="admin-app">
      <div className={shellClassName}>
        <button
          aria-label={isMobileViewport ? "Open navigation" : isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          className="admin-sidebar-toggle"
          type="button"
          onClick={() =>
            isMobileViewport
              ? setIsSidebarOpen((currentValue) => !currentValue)
              : setIsSidebarCollapsed((currentValue) => !currentValue)
          }
        >
          {isMobileViewport ? <AdminMenuIcon /> : <AdminCollapseIcon collapsed={isSidebarCollapsed} />}
        </button>

        {isMobileViewport && isSidebarOpen ? (
          <button
            aria-label="Close navigation"
            className="admin-sidebar-overlay"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside className={sidebarClassName} aria-hidden={isMobileViewport && !isSidebarOpen} aria-label="Admin navigation">
          <div className="admin-sidebar-top">
            <Link className="admin-sidebar-brand" href="/admin/dashboard">
              <span className="admin-sidebar-brand-mark" aria-hidden="true">
                SW
              </span>
              <span className="admin-sidebar-brand-copy">
                <strong>Switchwords</strong>
                <span>Admin Panel</span>
              </span>
            </Link>

            <div className="admin-sidebar-user">
              <p>{viewer.fullName}</p>
              <span>{viewer.email}</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            {adminNavItems.map((item) => (
              <Link
                aria-current={active === item.key ? "page" : undefined}
                className={`admin-sidebar-link${active === item.key ? " admin-sidebar-link-active" : ""}`}
                href={item.href}
                key={item.key}
                onClick={handleNavClick}
                title={isSidebarCollapsed && !isMobileViewport ? item.label : undefined}
              >
                {getItemIcon(item.key)}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-bottom">
            <Link
              className="admin-sidebar-secondary-link"
              href="/"
              onClick={handleNavClick}
              title={isSidebarCollapsed && !isMobileViewport ? "View website" : undefined}
            >
              View website
            </Link>
            <SignOutButton
              className="admin-sidebar-signout"
            >
              <span>Logout</span>
            </SignOutButton>
          </div>
        </aside>

        <div className="admin-app-main">{children}</div>
      </div>
    </main>
  );
}
