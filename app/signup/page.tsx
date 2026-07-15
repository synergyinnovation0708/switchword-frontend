import { redirectAuthenticatedUserHome } from "@/lib/server-auth";
import { SignUpForm } from "../components/auth/signup-form";
import { SiteFooter, SiteNav } from "../components/site-chrome";

export default async function SignUpPage() {
  await redirectAuthenticatedUserHome();

  return (
    <main className="signup-page">
      <SiteNav />

      <section className="signup-section" aria-labelledby="signup-title">
        <div className="signup-shell">
          <div className="signup-heading">
            <h1 id="signup-title">Join the practice</h1>
            <p>Create your account to start your switchwords journey</p>
          </div>

          <SignUpForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
