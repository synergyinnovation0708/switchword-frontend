"use client";

import Link from "next/link";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";

type SignUpResponse = {
  message: string;
};

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const payload = await browserApiRequest<SignUpResponse>("/auth/signup", {
        method: "POST",
        bodyJson: {
          fullName,
          email,
          phone,
          dateOfBirth,
          password,
          timeZone,
        },
      });

      setSuccessMessage(payload.message);
      setFullName("");
      setEmail("");
      setPhone("");
      setDateOfBirth("");
      setPassword("");
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not create your account right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="signup-card">
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Full Name</span>
            <input
              name="fullName"
              placeholder="Enter your full name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
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
            <span>Contact Number</span>
            <input
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label className="auth-field">
            <span>Date of Birth</span>
            <input
              aria-label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              name="password"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {formError ? <p className="auth-feedback auth-feedback-error">{formError}</p> : null}
          {successMessage ? (
            <p className="auth-feedback auth-feedback-success">{successMessage}</p>
          ) : null}
          <button className="auth-submit signup-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="signin-prompt">
          Already have an account? <Link href="/signin">Sign In</Link>
        </p>
        <Link className="business-login-link" href="/admin/login">
          Business / Admin Login &rarr;
        </Link>
      </div>

      <p className="signup-terms">
        By creating an account, you agree to our <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>
      </p>
    </>
  );
}
