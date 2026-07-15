import { redirectAdminUserHome } from "@/lib/server-auth";
import { AdminLoginForm } from "../../components/auth/admin-login-form";
import { SiteFooter, SiteNav } from "../../components/site-chrome";

function ShieldIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.2 18 5.7v4.9c0 4.1-2.5 7.8-6 9.3-3.5-1.5-6-5.2-6-9.3V5.7l6-2.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default async function AdminLoginPage() {
  await redirectAdminUserHome();

  return (
    <main className="admin-login-page">
      <SiteNav className="admin-page-nav" />

      <section className="admin-login-section" aria-labelledby="admin-login-title">
        <div className="admin-login-shell">
          <div className="admin-login-heading">
            <div className="admin-icon-badge">
              <ShieldIcon />
            </div>
            <h1 id="admin-login-title">Admin Portal</h1>
            <p>Business and administrator access</p>
          </div>

          <AdminLoginForm />

          <p className="admin-support">
            Need admin access? <a href="mailto:hello@theswitchwords.com">Contact Support</a>
          </p>
        </div>
      </section>

      <SiteFooter className="admin-page-footer" />
    </main>
  );
}
