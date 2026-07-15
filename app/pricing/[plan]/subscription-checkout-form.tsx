"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import { getSignedInRoute } from "@/lib/plan-utils";
import type { Plan, PublicUser } from "@/lib/types";

type ActivateSubscriptionResponse = {
  user: PublicUser;
  message: string;
};

type SubscriptionCheckoutFormProps = {
  plan: Plan;
  price: number;
  initialEmail?: string;
  initialFullName?: string;
};

export function SubscriptionCheckoutForm({
  plan,
  price,
  initialEmail = "",
  initialFullName = "",
}: SubscriptionCheckoutFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      setFormError("Please complete your details and payment information.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = await browserApiRequest<ActivateSubscriptionResponse>(
        "/subscriptions/activate",
        {
          method: "POST",
          bodyJson: {
            plan,
          },
        },
      );

      router.replace(getSignedInRoute(payload.user));
      router.refresh();
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(
          error.status === 401
            ? "Sign in first, then complete your subscription payment."
            : error.message,
        );
      } else {
        setFormError("We could not start your subscription right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="subscription-form" onSubmit={handleSubmit}>
      <section className="subscription-block" aria-labelledby="details-heading">
        <h2 id="details-heading">Your details</h2>
        <div className="subscription-fields">
          <label className="subscription-field">
            <span>Full name</span>
            <input
              autoComplete="name"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label className="subscription-field">
            <span>Email address</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section
        className="subscription-block subscription-divider-block"
        aria-labelledby="payment-heading"
      >
        <h2 id="payment-heading">Payment details</h2>
        <div className="subscription-fields">
          <label className="subscription-field">
            <span>Card number</span>
            <input
              autoComplete="cc-number"
              inputMode="numeric"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              type="text"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
            />
          </label>
          <div className="subscription-card-row">
            <label className="subscription-field">
              <span>Expiry</span>
              <input
                autoComplete="cc-exp"
                inputMode="numeric"
                name="expiry"
                placeholder="MM/YY"
                type="text"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
              />
            </label>
            <label className="subscription-field">
              <span>CVV</span>
              <input
                autoComplete="cc-csc"
                inputMode="numeric"
                name="cvv"
                placeholder="123"
                type="text"
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>

      {formError ? <p className="auth-feedback auth-feedback-error subscription-feedback">{formError}</p> : null}

      <button className="subscription-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : `Start subscription - Rs ${price.toLocaleString("en-IN")}/month`}
      </button>

      <p className="subscription-terms">
        By subscribing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}
