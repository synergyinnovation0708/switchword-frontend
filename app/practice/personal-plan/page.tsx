import { requirePracticeFeature } from "@/lib/server-auth";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";

const personalGoals = [
  { label: "Maintain 7-day streak (achieved)", complete: true },
  { label: "Reach 30-day streak by month end", complete: false },
  { label: "Explore 3 new words this week", complete: false },
] as const;

function FocusIcon() {
  return (
    <svg aria-hidden="true" className="practice-plan-section-icon practice-plan-section-icon-gold" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function GoalsIcon() {
  return (
    <svg aria-hidden="true" className="practice-plan-section-icon practice-plan-section-icon-leaf" viewBox="0 0 20 20">
      <rect
        x="3.5"
        y="4.2"
        width="13"
        height="12"
        rx="1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M6.6 2.8v3M13.4 2.8v3M3.9 8h12.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg aria-hidden="true" className="practice-plan-section-icon practice-plan-section-icon-blush" viewBox="0 0 20 20">
      <path
        d="M4 13.2 8.1 9.1l2.4 2.4 5-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.4 6.5h3.1v3.1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GoalCheckIcon() {
  return (
    <svg aria-hidden="true" className="practice-plan-goal-check" viewBox="0 0 16 16">
      <path
        d="m3.2 8 2.8 2.9 6.8-6.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default async function PersonalPlanPage() {
  const viewer = await requirePracticeFeature("personal-plan");

  return (
    <PracticeDashboardShell activeNav="personal-plan" viewer={viewer}>
      <section className="practice-plan-card" aria-labelledby="personal-plan-title">
        <h2 id="personal-plan-title">Your Personal Practice Plan</h2>

        <article className="practice-plan-panel practice-plan-panel-gold">
          <div className="practice-plan-panel-title">
            <FocusIcon />
            <h3>Current Focus</h3>
          </div>
          <p className="practice-plan-emphasis">
            Morning grounding &amp; scattered energy management
          </p>
          <p className="practice-plan-copy">
            Based on your practice patterns over the last 30 days, mornings are when you need the
            most support. TOGETHER and DIVINE-ORDER appear most frequently.
          </p>
        </article>

        <article className="practice-plan-panel practice-plan-panel-leaf">
          <div className="practice-plan-panel-title">
            <GoalsIcon />
            <h3>Practice Goals</h3>
          </div>

          <ul className="practice-plan-goals">
            {personalGoals.map((goal) => (
              <li key={goal.label}>
                {goal.complete ? (
                  <span className="practice-plan-goal-box practice-plan-goal-box-complete">
                    <GoalCheckIcon />
                  </span>
                ) : (
                  <span className="practice-plan-goal-box" />
                )}
                <span>{goal.label}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="practice-plan-panel practice-plan-panel-blush">
          <div className="practice-plan-panel-title">
            <InsightsIcon />
            <h3>Progress Insights</h3>
          </div>
          <p className="practice-plan-copy">
            Your practice consistency has improved 45% this month. The words you reach for most
            often are aligned with morning routines, suggesting a strong anchor practice.
          </p>
        </article>
      </section>
    </PracticeDashboardShell>
  );
}
