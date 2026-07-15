import Link from "next/link";

import { requirePracticeFeature } from "@/lib/server-auth";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";

const supportOptions = [
  {
    title: "Voice Call",
    description: "Speak directly with your practice coach for personalized guidance.",
    cta: "Request Voice Call",
    kind: "voice",
  },
  {
    title: "Video Call",
    description: "Face-to-face session to dive deeper into your practice journey.",
    cta: "Schedule Video Call",
    kind: "video",
  },
] as const;

function VoiceCallIcon() {
  return (
    <svg aria-hidden="true" className="practice-support-option-icon" viewBox="0 0 40 40">
      <path
        d="M12.3 7.75c.7-.7 1.83-.7 2.52 0l3.28 3.29c.62.61.72 1.57.24 2.3l-1.85 2.65c-.31.44-.34 1.02-.08 1.49 1.55 2.86 3.9 5.21 6.76 6.76.47.26 1.05.23 1.49-.08l2.65-1.85a1.78 1.78 0 0 1 2.3.24l3.29 3.28c.69.69.69 1.82 0 2.52l-2.11 2.11c-1.26 1.26-3.14 1.8-4.89 1.4-4.66-1.09-9.56-4.65-13.64-8.73-4.08-4.08-7.64-8.98-8.73-13.64-.4-1.75.14-3.63 1.4-4.89l2.11-2.11Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function VideoCallIcon() {
  return (
    <svg aria-hidden="true" className="practice-support-option-icon" viewBox="0 0 40 40">
      <rect
        x="8"
        y="11"
        width="18"
        height="18"
        rx="2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m26 16.2 6.4-3.4c1-.55 2.1.18 2.1 1.31v11.8c0 1.13-1.11 1.86-2.1 1.31L26 23.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CallButtonIcon() {
  return (
    <svg aria-hidden="true" className="practice-support-call-icon" viewBox="0 0 20 20">
      <path
        d="M6.15 3.85c.35-.34.92-.34 1.27 0l1.65 1.66c.31.31.35.79.11 1.15l-.93 1.33c-.15.22-.17.51-.04.75.78 1.43 1.95 2.6 3.38 3.38.24.13.53.11.75-.04l1.33-.93a.9.9 0 0 1 1.15.11l1.66 1.65c.34.35.34.92 0 1.27l-1.06 1.06c-.63.63-1.57.9-2.44.7-2.33-.54-4.78-2.32-6.82-4.36-2.04-2.04-3.82-4.49-4.36-6.82-.2-.87.07-1.81.7-2.44l1.06-1.06Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="practice-support-slot-icon" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.2v4.1l2.8 1.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default async function PhoneSupportPage() {
  const viewer = await requirePracticeFeature("phone-support");

  return (
    <PracticeDashboardShell activeNav="phone-support" viewer={viewer}>
      <section className="practice-support-card" aria-labelledby="phone-support-title">
        <h2 id="phone-support-title">Phone &amp; Video Support</h2>

        <div className="practice-support-options">
          {supportOptions.map((option) => (
            <article className="practice-support-option" key={option.title}>
              {option.kind === "voice" ? <VoiceCallIcon /> : <VideoCallIcon />}
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <button className="practice-support-option-button" type="button">
                {option.cta}
              </button>
            </article>
          ))}
        </div>

        <section className="practice-support-number-card" aria-label="Support phone number">
          <div className="practice-support-number-top">
            <div className="practice-support-number-copy">
              <p className="practice-support-number-label">Your Support Number</p>
              <strong>+91 98765 43210</strong>
              <span>Available Mon-Fri, 9 AM - 6 PM IST</span>
            </div>

            <Link
              aria-label="Call support"
              className="practice-support-call-button"
              href="tel:+919876543210"
            >
              <CallButtonIcon />
            </Link>
          </div>

          <div className="practice-support-slot">
            <ClockIcon />
            <div>
              <p>Next Available Slot</p>
              <span>Today, 3:00 PM - 3:30 PM</span>
            </div>
          </div>
        </section>
      </section>
    </PracticeDashboardShell>
  );
}
