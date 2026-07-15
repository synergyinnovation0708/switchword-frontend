import Image from "next/image";
import Link from "next/link";
import { getSignedInRoute } from "@/lib/plan-utils";
import { getOptionalAuthenticatedUser } from "@/lib/server-auth";
import type { PublicUser } from "@/lib/types";
import { SignOutButton } from "./sign-out-button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`logo${light ? " logo-light" : ""}`} href="/" aria-label="The Switchwords home">
      <Image
        className="logo-symbol"
        src="/icons/Group.svg"
        alt=""
        aria-hidden="true"
        width={38}
        height={38}
        priority
      />
      <Image
        className="logo-separator"
        src="/icons/Vector.svg"
        alt=""
        aria-hidden="true"
        width={1}
        height={23}
        priority
      />
      <span className="logo-word">theswitchwords</span>
    </Link>
  );
}

function AccountMenu({ viewer }: { viewer: PublicUser | null }) {
  return (
    <details className="account-menu">
      <summary
        className="user-link"
        aria-label={viewer ? `${viewer.fullName} account menu` : "Account menu"}
      >
        <Image src="/icons/Icon.svg" alt="" aria-hidden="true" width={20} height={20} />
      </summary>

      <div className="account-menu-panel">
        {viewer ? (
          <>
            <Link className="account-menu-item account-menu-item-primary" href={getSignedInRoute(viewer)}>
              {viewer.role === "admin" ? "Admin Dashboard" : "Dashboard"}
            </Link>
            <SignOutButton className="account-menu-item account-menu-item-secondary">
              Logout
            </SignOutButton>
          </>
        ) : (
          <>
            <Link className="account-menu-item account-menu-item-secondary" href="/signin">
              Sign In
            </Link>
            <Link className="account-menu-item account-menu-item-primary" href="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </details>
  );
}

export async function SiteNav({
  active,
  className,
  viewer,
}: {
  active?: string;
  className?: string;
  viewer?: PublicUser | null;
}) {
  const resolvedViewer = viewer === undefined ? await getOptionalAuthenticatedUser() : viewer;

  return (
    <header className={className ? `site-nav ${className}` : "site-nav"} aria-label="Main navigation">
      <Logo />
      <nav className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className={item.label === active ? "active" : undefined}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
        <AccountMenu viewer={resolvedViewer} />
      </nav>
    </header>
  );
}

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={className ? `site-footer ${className}` : "site-footer"}>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo light />
            <p>One word. Said softly. Said on purpose.</p>
            <div className="socials footer-socials" aria-label="Social links">
              <a href="#" aria-label="YouTube" className="social-link">
                <Image
                  src="/icons/youtube-circle 1.svg"
                  alt=""
                  aria-hidden="true"
                  width={46}
                  height={46}
                />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <Image
                  src="/icons/instagram-circle 1.svg"
                  alt=""
                  aria-hidden="true"
                  width={46}
                  height={46}
                />
              </a>
            </div>
          </div>
          <nav aria-label="Footer navigation" className="footer-nav">
            {navItems.slice(1).map((item) => (
              <Link href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </nav>
          <address className="footer-contact">
            <a href="#">@theswitchwords</a>
            <a href="mailto:hello@theswitchwords.com">hello@theswitchwords.com</a>
          </address>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 The Switchwords</p>
          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
