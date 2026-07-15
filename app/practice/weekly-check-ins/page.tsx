import { requirePracticeFeature } from "@/lib/server-auth";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";

const previousCheckIns = [
  {
    date: "April 25, 2026",
    summary: "Discussed morning routine challenges. Agreed to focus on TOGETHER word.",
  },
  {
    date: "April 18, 2026",
    summary: "Reflected on first week. Noted improvement in morning clarity.",
  },
] as const;

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="practice-checkin-calendar" viewBox="0 0 20 20">
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

export default async function WeeklyCheckInsPage() {
  const viewer = await requirePracticeFeature("weekly-check-ins");

  return (
    <PracticeDashboardShell activeNav="weekly-check-ins" viewer={viewer}>
      <section className="practice-checkin-card" aria-labelledby="weekly-checkins-title">
        <h2 id="weekly-checkins-title">Weekly Check-ins</h2>

        <section className="practice-checkin-next" aria-label="Next weekly check-in">
          <div className="practice-checkin-next-header">
            <h3>Next Check-in</h3>
            <span className="practice-checkin-pill">This Friday</span>
          </div>

          <p className="practice-checkin-next-copy">
            Your coach will reach out via WhatsApp to reflect on your practice this week.
          </p>

          <div className="practice-checkin-schedule">
            <CalendarIcon />
            <div className="practice-checkin-schedule-copy">
              <p>
                Friday, May 2 &bull; 10:00 AM
              </p>
              <span>~15 minute conversation via WhatsApp text</span>
            </div>
          </div>
        </section>

        <section className="practice-checkin-history" aria-labelledby="previous-checkins-title">
          <h3 id="previous-checkins-title">Previous Check-ins</h3>

          <div className="practice-checkin-history-list">
            {previousCheckIns.map((checkIn) => (
              <article className="practice-checkin-history-item" key={checkIn.date}>
                <h4>{checkIn.date}</h4>
                <p>{checkIn.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PracticeDashboardShell>
  );
}
