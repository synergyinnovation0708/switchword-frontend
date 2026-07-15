import Link from "next/link";

import { PRACTICE_FEATURE_LABELS, type PracticeFeature } from "@/lib/practice-features";
import { formatPlanLabel } from "@/lib/plan-utils";
import { getPlanConfig } from "@/lib/server-auth";
import type { PublicUser } from "@/lib/types";
import { SiteFooter, SiteNav } from "./site-chrome";
import { SignOutButton } from "./sign-out-button";
import { getSubscriptionPlanDefaults } from "../pricing/plans";

const practiceNavItems = [
  { key: "today-word", label: "Today's Word", href: "/practice" },
  { key: "whatsapp-chat", label: "WhatsApp Chat", href: "/practice/whatsapp-chat" },
  { key: "phone-support", label: "Phone Support", href: "/practice/phone-support" },
  { key: "practice-log", label: "Practice Log", href: "/practice/practice-log" },
  { key: "personal-plan", label: "Personal Plan", href: "/practice/personal-plan" },
  { key: "weekly-check-ins", label: "Weekly Check-ins", href: "/practice/weekly-check-ins" },
  { key: "settings", label: "Settings", href: "/practice/settings" },
] as const;

const planPrices = {
  murmur: 399,
  presence: 999,
} as const;

function BadgeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <path
        d="M12 3.25a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m9.6 14.7-1 5.55L12 18.3l3.4 1.95-1-5.55"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MiniCheckIcon() {
  return (
    <svg aria-hidden="true" className="practice-mini-check" viewBox="0 0 12 12">
      <path
        d="m2.25 6.25 2.2 2.2 5.3-5.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export async function PracticeDashboardShell({
  activeNav,
  viewer,
  children,
}: {
  activeNav: (typeof practiceNavItems)[number]["key"];
  viewer: PublicUser;
  children: React.ReactNode;
}) {
  const isPresence = viewer.plan === "presence";
  const planConfig = await getPlanConfig(viewer.plan);
  const practiceFeatures =
    planConfig?.practiceFeatures?.length
      ? planConfig.practiceFeatures
      : viewer.plan
        ? (getSubscriptionPlanDefaults(viewer.plan)?.practiceFeatures ?? [])
        : [];
  const visibleNavItems = practiceNavItems.filter((item) =>
    practiceFeatures.includes(item.key as PracticeFeature),
  );
  const memberBenefits = isPresence
    ? ["Unlimited AI Chat", "WhatsApp Support", "Phone/Video Calls"]
    : ["Daily personalized word", "Practice tracking", "AI chat guidance"];

  return (
    <main className="practice-page">
      <SiteNav viewer={viewer} />

      <section className="practice-shell" aria-labelledby="practice-title">
        <div className="practice-header">
          <div className="practice-header-copy">
            <div className="practice-title-row">
              <h1 id="practice-title">Your practice</h1>
              <BadgeIcon className="practice-title-icon" />
            </div>
            <p>
              {formatPlanLabel(viewer.plan)} Plan &mdash; &#8377;
              {planPrices[viewer.plan as keyof typeof planPrices]}/month &bull;{" "}
              {isPresence ? "Premium Member" : "Guided Member"}
            </p>
          </div>
          <SignOutButton className="practice-logout">
            Logout
          </SignOutButton>
        </div>

        <div className="practice-layout">
          <aside className="practice-sidebar">
            <nav className="practice-nav-card" aria-label="Practice sections">
              {visibleNavItems.map((item) => (
                <Link
                  aria-current={item.key === activeNav ? "page" : undefined}
                  className={`practice-nav-button${item.key === activeNav ? " practice-nav-button-active" : ""}`}
                  href={item.href}
                  key={item.key}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <section className="practice-member-card" aria-label="Membership details">
              <BadgeIcon className="practice-member-icon" />
              <h2>{isPresence ? "Presence Member" : "Murmur Member"}</h2>
              <p>
                {isPresence
                  ? "Full access to all premium features including personal support."
                  : "Guided practice access with daily words, tracking, and AI support."}
              </p>
              <ul className="practice-member-list">
                {memberBenefits.map((benefit) => (
                  <li key={benefit}>
                    <MiniCheckIcon />
                    <span>{benefit}</span>
                  </li>
                ))}
                {practiceFeatures.map((feature) => (
                  <li key={feature}>
                    <MiniCheckIcon />
                    <span>{PRACTICE_FEATURE_LABELS[feature]}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className="practice-main">{children}</div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
