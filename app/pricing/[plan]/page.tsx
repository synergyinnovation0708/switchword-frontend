import Link from "next/link";
import { BackendError } from "@/lib/backend";
import { serverApiRequest } from "@/lib/server-backend";
import { notFound } from "next/navigation";
import { getOptionalAuthenticatedUser } from "@/lib/server-auth";
import type { Plan, SubscriptionPlansPayload } from "@/lib/types";

import { SiteFooter, SiteNav } from "../../components/site-chrome";
import { getPlanBySlug, plans } from "../plans";
import { SubscriptionCheckoutForm } from "./subscription-checkout-form";

function CheckIcon() {
  return <span className="pricing-check" aria-hidden="true" />;
}

function RefundShieldIcon() {
  return (
    <svg aria-hidden="true" className="subscription-refund-icon" viewBox="0 0 20 20">
      <path
        d="M10 2.5 4.75 4.438v4.375c0 3.192 2.069 6.091 5.25 7.375 3.181-1.284 5.25-4.183 5.25-7.375V4.438L10 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

async function getPricingPlans(planSlug: string) {
  try {
    const payload = await serverApiRequest<SubscriptionPlansPayload>("/subscriptions/plans");
    return payload.plans;
  } catch (error) {
    if (error instanceof BackendError) {
      console.warn(
        `[pricing/${planSlug}] Falling back to local plan content because the backend returned ${error.status} ${error.code}.`,
      );
      return plans;
    }

    throw error;
  }
}

export default async function PlanCheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const viewer = await getOptionalAuthenticatedUser();
  const { plan } = await params;
  const availablePlans = await getPricingPlans(plan);
  const selectedPlan = getPlanBySlug(plan, availablePlans);

  if (!selectedPlan) {
    notFound();
  }

  const summaryFeatures =
    selectedPlan.checkoutFeatures.length > 0 ? selectedPlan.checkoutFeatures : selectedPlan.features;
  const billingNote =
    selectedPlan.checkoutBillingNote ??
    `Billed monthly. You'll be charged Rs ${selectedPlan.price.toLocaleString("en-IN")} today, then every month on this date. Cancel anytime.`;

  return (
    <main className="subscription-page">
      <SiteNav active="Pricing" />

      <div className="subscription-shell">
        <Link className="subscription-back-link" href="/pricing">
          &larr; Back to plans
        </Link>

        <h1 className="subscription-heading">Complete your subscription</h1>

        <section className="subscription-flow" aria-label={`${selectedPlan.name} checkout`}>
          <div className="subscription-card subscription-form-card">
            <SubscriptionCheckoutForm
              plan={selectedPlan.slug as Plan}
              price={selectedPlan.price}
              initialEmail={viewer?.role === "user" ? viewer.email : ""}
              initialFullName={viewer?.role === "user" ? viewer.fullName : ""}
            />
          </div>

          <aside className="subscription-card subscription-summary-card" aria-label="Order summary">
            <h2 className="subscription-summary-title">Order summary</h2>

            <div className="subscription-summary-header">
              <div className="subscription-summary-copy">
                <h3>{selectedPlan.name}</h3>
                <p>Monthly subscription</p>
              </div>
              <p className="subscription-summary-price">
                &#8377;{selectedPlan.price.toLocaleString("en-IN")}
              </p>
            </div>

            <section className="subscription-summary-section" aria-labelledby="included-heading">
              <h4 id="included-heading">What&apos;s included:</h4>
              <ul className="subscription-summary-list">
                {summaryFeatures.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="subscription-summary-section subscription-total-block">
              <div className="subscription-total-row">
                <span>Subtotal</span>
                <strong>&#8377;{selectedPlan.price.toLocaleString("en-IN")}</strong>
              </div>
              <div className="subscription-total-row">
                <span>Tax</span>
                <strong>&#8377;0</strong>
              </div>
              <div className="subscription-total-row subscription-total-row-highlight">
                <span>Total today</span>
                <strong>&#8377;{selectedPlan.price.toLocaleString("en-IN")}</strong>
              </div>
              <p className="subscription-billing-note">{billingNote}</p>
            </section>

            <div className="subscription-refund">
              <RefundShieldIcon />
              <p>
                <strong>14-day refund guarantee.</strong> If this doesn&apos;t fit your practice,
                email us within 14 days for a full refund.
              </p>
            </div>
          </aside>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
