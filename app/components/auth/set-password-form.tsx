"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import { getSignedInRoute } from "@/lib/plan-utils";
import type { PublicUser } from "@/lib/types";

type SetPasswordResponse = {
  user: PublicUser;
};

export function SetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = await browserApiRequest<SetPasswordResponse>("/auth/set-password", {
        method: "POST",
        bodyJson: {
          token,
          password,
        },
      });

      router.replace(getSignedInRoute(payload.user));
      router.refresh();
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not set your password right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-card">
      <form className="signin-form auth-compact-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            placeholder="Choose a password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>Confirm Password</span>
          <input
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        {formError ? <p className="auth-feedback auth-feedback-error">{formError}</p> : null}
        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving Password..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}
