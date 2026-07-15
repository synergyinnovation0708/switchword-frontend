"use client";

import { useState } from "react";
import { BackendError, browserApiRequest } from "@/lib/backend";
import type { TodayWord } from "@/lib/types";

function StreakIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20">
      <path
        d="M10.4 2.5c.9 2.2-.1 3.7-1.7 5.3-1.2 1.2-1.9 2.4-1.9 3.9 0 2.1 1.5 4.3 4.1 4.3 2.3 0 4.1-1.7 4.1-4.2 0-2.2-1.1-4.2-4.6-9.3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20">
      <path
        d="M3 13.5 7.1 9.4l2.7 2.7 5.2-5.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M11.6 6.9h3.4v3.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GoalIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="0.95" fill="currentColor" />
    </svg>
  );
}

function StatIcon({ label, tone }: { label: string; tone: "gold" | "leaf" | "ink" }) {
  const className = `practice-stat-icon practice-stat-icon-${tone}`;

  if (label === "Streak") {
    return <StreakIcon className={className} />;
  }

  if (label === "This month") {
    return <TrendIcon className={className} />;
  }

  return <GoalIcon className={className} />;
}

export function PracticeTodayPanel({ initialTodayWord }: { initialTodayWord: TodayWord }) {
  const [todayWord, setTodayWord] = useState(initialTodayWord);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const practiceSteps = [
    "Whisper it softly, three times",
    "Carry it into the moment that needs it",
    "When the ache returns, whisper again",
  ];

  const handleMarkPracticed = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = await browserApiRequest<TodayWord>("/practice/today/complete", {
        method: "POST",
      });
      setTodayWord(payload);
    } catch (error) {
      if (error instanceof BackendError) {
        setFormError(error.message);
      } else {
        setFormError("We could not save today’s practice right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="practice-word-card" aria-labelledby="practice-word-title">
        <div className="practice-word-copy">
          <p>Your personalized word for today</p>
          <h2 id="practice-word-title">{todayWord.label}</h2>
        </div>

        <div className="practice-word-panel">
          <div className="practice-word-mark">
            <h3>{todayWord.word}</h3>
            <p>{todayWord.explanation}</p>
          </div>

          <p className="practice-method-label">The Three Whispers Method</p>

          <ol className="practice-steps">
            {practiceSteps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}.</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {formError ? <p className="auth-feedback auth-feedback-error">{formError}</p> : null}

        <button
          className="practice-mark-button"
          type="button"
          disabled={isSubmitting || todayWord.practiced}
          onClick={handleMarkPracticed}
        >
          {todayWord.practiced
            ? "Practiced today"
            : isSubmitting
              ? "Saving..."
              : "Mark as practiced"}
        </button>
      </section>

      <section className="practice-stats" aria-label="Practice metrics">
        <article className="practice-stat-card">
          <div className="practice-stat-header">
            <StatIcon label="Streak" tone="gold" />
            <p>Streak</p>
          </div>
          <strong>{todayWord.streak}</strong>
          <span>days</span>
        </article>
        <article className="practice-stat-card">
          <div className="practice-stat-header">
            <StatIcon label="This month" tone="leaf" />
            <p>This month</p>
          </div>
          <strong>{todayWord.monthCount}</strong>
          <span>days practiced</span>
        </article>
        <article className="practice-stat-card">
          <div className="practice-stat-header">
            <StatIcon label="Goal" tone="ink" />
            <p>Goal</p>
          </div>
          <strong>{todayWord.goal}</strong>
          <span>days/month</span>
        </article>
      </section>
    </>
  );
}
