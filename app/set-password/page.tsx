import { SetPasswordForm } from "../components/auth/set-password-form";
import { SiteFooter, SiteNav } from "../components/site-chrome";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="signin-page">
      <SiteNav />

      <section className="signin-section" aria-labelledby="set-password-title">
        <div className="signin-shell">
          <div className="signin-heading">
            <h1 id="set-password-title">Set your password</h1>
            <p>Finish your account setup to begin your practice</p>
          </div>

          {token ? (
            <SetPasswordForm token={token} />
          ) : (
            <div className="signin-card auth-message-card">
              <p className="auth-feedback auth-feedback-error">
                This password setup link is missing or invalid.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
