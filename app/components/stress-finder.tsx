"use client";

import Link from "next/link";
import { useState } from "react";
import type { StressFinderEntry } from "@/lib/types";

export function StressFinder({ entries }: { entries: StressFinderEntry[] }) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const selectedEntry =
    selectedEntryId ? entries.find((entry) => entry.id === selectedEntryId) ?? null : null;

  return (
    <div className="word-picker" id="word-picker">
      {selectedEntry ? (
        <article className="stress-finder-card" aria-live="polite">
          <p className="stress-finder-kicker">Your word for:</p>
          <h3 className="stress-finder-title">{selectedEntry.label}</h3>

          <div className="stress-finder-panel">
            <p className="stress-finder-word">{selectedEntry.word}</p>
            <p className="stress-finder-description">{selectedEntry.description}</p>
            <p className="stress-finder-whisper">Whisper it three times</p>
          </div>

          <div className="stress-finder-actions">
            <Link className="stress-finder-primary" href="/pricing">
              Know More &mdash; See Plans
            </Link>
            <button
              className="stress-finder-secondary"
              type="button"
              onClick={() => setSelectedEntryId(null)}
            >
              &larr; Choose a different stress
            </button>
          </div>
        </article>
      ) : (
        <>
          <h2>Choose a word</h2>
          <p>What are you carrying right now?</p>
          {entries.length > 0 ? (
            <div className="chips" aria-label="Common worries">
              {entries.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  aria-pressed={selectedEntryId === entry.id}
                  className={selectedEntryId === entry.id ? "chip-selected" : undefined}
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="stress-finder-empty">
              No switchword prompts are available right now. Please check back shortly.
            </p>
          )}
          <a className="text-button" href="#about">
            What is a switchword?
          </a>
        </>
      )}
    </div>
  );
}
