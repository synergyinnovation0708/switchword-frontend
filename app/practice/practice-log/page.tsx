import { serverApiRequest } from "@/lib/server-backend";
import { requirePracticeFeature } from "@/lib/server-auth";
import type { PracticeLogMonth } from "@/lib/types";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";

const monthDays = Array.from({ length: 31 }, (_, index) => index + 1);

function StreakLeafIcon() {
  return (
    <svg aria-hidden="true" className="practice-log-streak-icon" viewBox="0 0 16 16">
      <path
        d="M8.2 1.8c.72 1.82-.03 3.06-1.1 4.15-.82.82-1.29 1.65-1.29 2.67 0 1.49 1.06 3.06 2.95 3.06 1.7 0 3.03-1.23 3.03-3.01 0-1.58-.8-3.04-3.59-6.87Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function getCurrentMonthKey(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  if (!year || !month) {
    throw new Error(`Could not derive month key for timezone ${timeZone}`);
  }

  return `${year}-${month}`;
}

export default async function PracticeLogPage() {
  const viewer = await requirePracticeFeature("practice-log");
  const practiceLog = await serverApiRequest<PracticeLogMonth>(
    `/practice/logs?month=${getCurrentMonthKey(viewer.timeZone)}`,
  );
  const practicedDays = new Set(practiceLog.practicedDays);
  const practiceStats = [
    { value: String(practiceLog.monthCount), label: "Days practiced" },
    { value: String(practiceLog.currentStreak), label: "Current streak" },
    { value: String(practiceLog.longestStreak), label: "Longest streak" },
  ] as const;

  return (
    <PracticeDashboardShell activeNav="practice-log" viewer={viewer}>
      <section className="practice-log-card" aria-labelledby="practice-log-title">
        <div className="practice-log-header">
          <h2 id="practice-log-title">Your practice this month</h2>

          <div className="practice-log-streak-pill" aria-label="Current streak">
            <StreakLeafIcon />
            <span>{practiceLog.currentStreak} day streak</span>
          </div>
        </div>

        <div className="practice-log-grid" aria-label="Days practiced this month">
          {monthDays.map((day) => {
            const isPracticed = practicedDays.has(day);

            return (
              <div
                className={`practice-log-day${isPracticed ? " practice-log-day-active" : ""}`}
                key={day}
              >
                <span>{day}</span>
              </div>
            );
          })}
        </div>

        <div className="practice-log-stats" aria-label="Practice log summary">
          {practiceStats.map((stat) => (
            <article className="practice-log-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>
    </PracticeDashboardShell>
  );
}
