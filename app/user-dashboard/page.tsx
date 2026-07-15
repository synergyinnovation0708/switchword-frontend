import Link from "next/link";
import { redirect } from "next/navigation";

import { formatPlanLabel, planMeetsMinimum } from "@/lib/plan-utils";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import { SiteFooter, SiteNav } from "../components/site-chrome";
import { SignOutButton } from "../components/sign-out-button";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="user-dashboard-resource-icon" viewBox="0 0 20 20">
      <path
        d="M10 3.8v8.2M6.8 8.8 10 12l3.2-3.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
      <path
        d="M4.2 14.3h11.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="user-dashboard-resource-icon" viewBox="0 0 20 20">
      <path
        d="M3.6 5.6A1.6 1.6 0 0 1 5.2 4h9.6a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6V5.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="m4.4 5 5.1 4.4a.8.8 0 0 0 1 0L15.6 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="user-dashboard-resource-icon" viewBox="0 0 20 20">
      <rect
        x="4.5"
        y="8.2"
        width="11"
        height="7.6"
        rx="1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M7 8.2V6.8A3 3 0 0 1 10 3.8a3 3 0 0 1 3 3v1.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="user-dashboard-upsell-icon" viewBox="0 0 40 40">
      <path
        d="m18.2 6.2-9.5 14.2h8.3l-2 13.4 16.4-18h-9.2l2-9.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="user-dashboard-check-icon" viewBox="0 0 16 16">
      <path
        d="m3 8.1 2.4 2.5 5.7-5.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default async function UserDashboardPage() {
  const viewer = await requireAuthenticatedUser();

  if (viewer.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (!viewer.plan) {
    redirect("/?subscription=inactive");
  }

  const hasPracticeAccess = planMeetsMinimum(viewer.plan, "murmur");
  const isPresence = viewer.plan === "presence";
  const resources = [
    {
      title: "The 7-Day Whisper PDF",
      description: "Seven switchwords for seven mornings. Your guide to the practice.",
      action: "Download PDF",
      kind: "download",
    },
    {
      title: "Weekly Newsletter",
      description: "You receive one word each week via email",
      note: "Next email: Monday, 7:00 AM",
      kind: "newsletter",
    },
    hasPracticeAccess
      ? {
          title: "Practice Tracking",
          description: "Track your daily practice and build streaks",
          action: "Open practice",
          href: "/practice",
          kind: "link",
        }
      : {
          title: "Practice Tracking",
          description: "Track your daily practice and build streaks",
          action: "Upgrade to unlock",
          badge: "Murmur",
          href: "/pricing",
          kind: "locked",
        },
  ] as const;
  const upgradeFeatures = isPresence
    ? ["Unlimited AI chat", "WhatsApp support", "Weekly personal check-ins"]
    : ["Daily personalized word", "Practice tracking & streaks", "AI chat guidance"];

  return (
    <main className="user-dashboard-page">
      <SiteNav viewer={viewer} />

      <section className="user-dashboard-shell" aria-labelledby="user-dashboard-title">
        <div className="user-dashboard-header">
          <div className="user-dashboard-heading">
            <h1 id="user-dashboard-title">Your practice</h1>
            <p>{formatPlanLabel(viewer.plan)} Plan</p>
          </div>

          <SignOutButton className="user-dashboard-logout">
            Logout
          </SignOutButton>
        </div>

        <div className="user-dashboard-layout">
          <section className="user-dashboard-card" aria-labelledby="resources-title">
            <h2 id="resources-title">Your resources</h2>

            <div className="user-dashboard-resource-list">
              {resources.map((resource) => (
                <article
                  className={`user-dashboard-resource${resource.kind === "locked" ? " user-dashboard-resource-locked" : ""}`}
                  key={resource.title}
                >
                  {resource.kind === "download" ? <DownloadIcon /> : null}
                  {resource.kind === "newsletter" ? <MailIcon /> : null}
                  {resource.kind === "locked" ? <LockIcon /> : null}

                  <div className="user-dashboard-resource-copy">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>

                    {"action" in resource ? (
                      "href" in resource ? (
                        <Link className="user-dashboard-resource-link" href={resource.href}>
                          {resource.action} &rarr;
                        </Link>
                      ) : (
                        <button className="user-dashboard-resource-link" type="button">
                          {resource.action} &rarr;
                        </button>
                      )
                    ) : null}

                    {"note" in resource ? <span>{resource.note}</span> : null}
                  </div>

                  {"badge" in resource ? (
                    <span className="user-dashboard-resource-badge">{resource.badge}</span>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="user-dashboard-upsell" aria-labelledby="upgrade-title">
            <SparkIcon />
            <h2 id="upgrade-title">
              {isPresence ? "Your full practice is active" : "Ready for more?"}
            </h2>
            <p>
              {isPresence
                ? "You already have access to the full guided practice experience."
                : "Get personalized daily words, practice tracking, AI support, and more."}
            </p>

            <ul className="user-dashboard-feature-list">
              {upgradeFeatures.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              className="user-dashboard-upsell-link"
              href={isPresence ? "/practice" : "/pricing"}
            >
              {isPresence ? "Open Practice" : "View Plans"}
            </Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
