import Link from "next/link";
import { BackendError } from "@/lib/backend";
import { serverApiRequest } from "@/lib/server-backend";
import type { Plan, SubscriptionPlansPayload } from "@/lib/types";
import { SiteFooter, SiteNav } from "../components/site-chrome";
import {
  comparisonRows,
  plans,
  pricingAdditionalOfferings,
  pricingDisplayPlans,
  pricingExtraCards,
  pricingTierBreakdowns,
} from "./plans";

function CheckIcon() {
  return <span className="pricing-check" aria-hidden="true" />;
}

function CompareValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <CheckIcon />;
  }

  if (value === false) {
    return (
      <span className="pricing-cross" aria-label="Not included">
        &times;
      </span>
    );
  }

  return <span>{value}</span>;
}

async function getPricingPlans() {
  try {
    const payload = await serverApiRequest<SubscriptionPlansPayload>("/subscriptions/plans");
    return payload.plans;
  } catch (error) {
    if (error instanceof BackendError) {
      console.warn(
        `[pricing] Falling back to local plan content because the backend returned ${error.status} ${error.code}.`,
      );
      return plans;
    }

    throw error;
  }
}

export default async function PricingPage() {
  const availablePlans = await getPricingPlans();
  const orderedPlans = (["whisper", "murmur", "presence"] as Plan[])
    .map((slug) => availablePlans.find((plan) => plan.slug === slug))
    .filter((plan): plan is NonNullable<(typeof availablePlans)[number]> => Boolean(plan));

  return (
    <main className="pricing-page pricing-v2-page">
      <SiteNav active="Pricing" />

      <section className="pricing-v2-hero pricing-v2-shell">
        <h1>The Switchwords Pricing Architecture</h1>
        <p>
          The pricing follows a classic value ladder with five tiers. Each tier serves a specific
          business function and targets a specific conversion event.
        </p>
      </section>

      <section className="pricing-v2-overview" aria-label="Pricing plans">
        <div className="pricing-v2-shell pricing-v2-card-grid">
          {orderedPlans.map((plan) => {
            const displayPlan = pricingDisplayPlans[plan.slug];
            const isFeatured = Boolean(plan.featured);

            return (
              <article
                className={`pricing-v2-card${isFeatured ? " pricing-v2-card-featured" : ""}`}
                key={plan.slug}
              >
                {displayPlan.badge ? <p className="pricing-v2-badge">{displayPlan.badge}</p> : null}
                <div className="pricing-v2-card-copy">
                  <h2>{plan.name}</h2>
                  <p className="pricing-v2-card-kicker">{displayPlan.eyebrow}</p>
                  <p className="pricing-v2-card-price">
                    <strong>{displayPlan.monthlyLabel}</strong>
                    {displayPlan.yearlyLabel ? <span>{displayPlan.yearlyLabel}</span> : null}
                  </p>
                  <p className="pricing-v2-card-description">{displayPlan.description}</p>
                </div>

                <ul className="pricing-v2-feature-list">
                  {displayPlan.cardFeatures.map((feature) => (
                    <li key={feature}>
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className={`pricing-v2-button${isFeatured ? " pricing-v2-button-featured" : ""}`}
                  href={`/pricing/${plan.slug}`}
                >
                  {displayPlan.cardCta}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pricing-v2-section pricing-v2-shell" aria-label="Detailed tier breakdown">
        <p className="pricing-v2-section-label">Detailed Tier Breakdown</p>
        <div className="pricing-v2-stack">
          {pricingTierBreakdowns.map((item) => (
            <details className="pricing-v2-accordion" key={item.id} name="pricing-tier-breakdown">
              <summary>
                <span className="pricing-v2-accordion-copy">
                  <span className="pricing-v2-accordion-eyebrow">{item.eyebrow}</span>
                  <span className="pricing-v2-accordion-title">{item.title}</span>
                  <span className="pricing-v2-accordion-summary">{item.summary}</span>
                </span>
                <span className="pricing-v2-accordion-icon" aria-hidden="true" />
              </summary>

              <div className="pricing-v2-accordion-panel">
                <div className="pricing-v2-detail-sections">
                  {item.sections.map((section) => (
                    <section
                      className={`pricing-v2-detail-section${
                        section.tone ? ` pricing-v2-detail-section-${section.tone}` : ""
                      }`}
                      key={`${item.id}-${section.title}`}
                    >
                      <h3>{section.title}</h3>
                      {section.body ? <p>{section.body}</p> : null}
                      {section.items ? (
                        <ul>
                          {section.items.map((detail) => (
                            <li key={detail}>
                              <span className="pricing-v2-detail-marker" aria-hidden="true" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="pricing-v2-compare pricing-v2-shell" aria-label="Feature comparison">
        <h2>Compare all features</h2>
        <div className="pricing-v2-table-wrap">
          <table className="pricing-v2-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {orderedPlans.map((plan) => (
                  <th key={plan.slug} scope="col">
                    {plan.name} {plan.price > 0 ? `(\u20b9${plan.price.toLocaleString("en-IN")}/mo)` : "(Free)"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {orderedPlans.map((plan) => (
                    <td key={`${row.label}-${plan.slug}`}>
                      <CompareValue value={row.values[plan.slug]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pricing-v2-section pricing-v2-shell" aria-label="Additional offerings">
        <p className="pricing-v2-section-label">Additional Offerings</p>
        <div className="pricing-v2-stack">
          {pricingAdditionalOfferings.map((item) => (
            <details className="pricing-v2-accordion pricing-v2-accordion-compact" key={item.id}>
              <summary>
                <span className="pricing-v2-accordion-copy">
                  <span className="pricing-v2-accordion-eyebrow">{item.eyebrow}</span>
                  <span className="pricing-v2-accordion-title">{item.title}</span>
                  <span className="pricing-v2-accordion-summary">{item.summary}</span>
                </span>
                <span className="pricing-v2-accordion-icon" aria-hidden="true" />
              </summary>
              <div className="pricing-v2-accordion-panel">
                <p>{item.details}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="pricing-v2-extras pricing-v2-shell" aria-label="Course and consultation offers">
        <div className="pricing-v2-extra-grid">
          {pricingExtraCards.map((card) => {
            const isCourse = card.title === "The Whisper Course";

            return (
              <article
                className={`pricing-v2-extra-card${
                  isCourse ? " pricing-v2-extra-card-course" : " pricing-v2-extra-card-session"
                }`}
                key={card.title}
              >
                <p className="pricing-v2-extra-badge">{card.badge}</p>
                <h3>{card.title}</h3>
                <p className="pricing-v2-extra-price">
                  <strong>{card.price}</strong>
                  <span>{isCourse ? "lifetime access" : "/ 30 min session"}</span>
                </p>
                {card.secondaryPrice ? (
                  <p className="pricing-v2-extra-secondary-price">
                    <strong>₹2,500</strong>
                    <span>/ 60 min session</span>
                  </p>
                ) : null}
                <p className="pricing-v2-extra-description">{card.description}</p>

                <ul className="pricing-v2-feature-list pricing-v2-feature-list-compact">
                  {card.features.map((feature) => (
                    <li key={feature}>
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className={`pricing-v2-button pricing-v2-extra-button${
                    isCourse
                      ? " pricing-v2-extra-button-course"
                      : " pricing-v2-extra-button-session"
                  }`}
                  href={isCourse ? "/pricing/murmur" : "/contact"}
                >
                  {card.cta}
                </Link>

                <p className="pricing-v2-extra-note">{card.note}</p>
              </article>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
