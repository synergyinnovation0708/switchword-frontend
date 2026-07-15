"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import { getSignedInRoute } from "@/lib/plan-utils";
import type { PublicUser } from "@/lib/types";

type SignInResponse = {
  user: PublicUser;
};

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = await browserApiRequest<SignInResponse>("/auth/signin", {
        method: "POST",
        bodyJson: {
          email,
          password,
        },
      });

      router.replace(getSignedInRoute(payload.user));
      router.refresh();
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not sign you in right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-card">
      <form className="signin-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email Address</span>
          <input
            name="email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <div className="signin-options">
          <label className="remember-control">
            <input name="remember" type="checkbox" disabled />
            <span>Remember me</span>
          </label>
          <Link href="#">Forgot password?</Link>
        </div>
        {formError ? <p className="auth-feedback auth-feedback-error">{formError}</p> : null}
        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="signup-prompt">
        Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
      <Link className="business-login-link" href="/admin/login">
        Business / Admin Login &rarr;
      </Link>
    </div>
  );
}
