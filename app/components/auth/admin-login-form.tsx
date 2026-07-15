"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessCode, setBusinessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await browserApiRequest("/auth/admin/signin", {
        method: "POST",
        bodyJson: {
          email,
          password,
          businessCode,
        },
      });

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not access the admin portal right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-card">
      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <label className="admin-field">
          <span>Admin Email</span>
          <input
            autoComplete="username"
            name="email"
            placeholder="admin@business.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            autoComplete="current-password"
            name="password"
            placeholder="Enter admin password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className="admin-field admin-code-field">
          <span>Business Code</span>
          <input
            autoCapitalize="characters"
            autoComplete="off"
            name="businessCode"
            placeholder="XXXX-XXXX-XXXX"
            type="text"
            value={businessCode}
            onChange={(event) => setBusinessCode(event.target.value.toUpperCase())}
          />
          <small>Enter your unique business access code</small>
        </label>
        {formError ? (
          <p className="auth-feedback auth-feedback-error" aria-live="polite">
            {formError}
          </p>
        ) : null}
        <button className="admin-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Accessing..." : "Access Admin Portal"}
        </button>
      </form>

      <div className="admin-security">
        <div className="admin-security-inner">
          <svg aria-hidden="true" fill="none" height={20} viewBox="0 0 24 24" width={20}>
            <path
              d="M12 3.2 18 5.7v4.9c0 4.1-2.5 7.8-6 9.3-3.5-1.5-6-5.2-6-9.3V5.7l6-2.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          <p>
            <strong>Secure Access:</strong> This portal is for authorized business administrators
            only. All login attempts are monitored and logged.
          </p>
        </div>
      </div>

      <Link className="admin-back-link" href="/signin">
        &larr; Back to User Sign In
      </Link>
    </div>
  );
}
