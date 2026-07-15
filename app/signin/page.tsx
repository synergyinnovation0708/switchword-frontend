import { redirectAuthenticatedUserHome } from "@/lib/server-auth";
import { SignInForm } from "../components/auth/signin-form";
import { SiteFooter, SiteNav } from "../components/site-chrome";

export default async function SignInPage() {
  await redirectAuthenticatedUserHome();

  return (
    <main className="signin-page">
      <SiteNav />

      <section className="signin-section" aria-labelledby="signin-title">
        <div className="signin-shell">
          <div className="signin-heading">
            <h1 id="signin-title">Welcome back</h1>
            <p>Sign in to continue your practice</p>
          </div>

          <SignInForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
