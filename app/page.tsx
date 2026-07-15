import Link from "next/link";
import { BackendError } from "@/lib/backend";
import { stressFinderFallbackEntries } from "@/lib/stress-finder-fallback";
import { serverApiRequest } from "@/lib/server-backend";
import { getOptionalAuthenticatedUser } from "@/lib/server-auth";
import type { StressFinderCatalogPayload, StressFinderEntry } from "@/lib/types";
import { SiteFooter, SiteNav } from "./components/site-chrome";
import { StressFinder } from "./components/stress-finder";
import { SwitchwordsChatbot } from "./components/switchwords-chatbot";

const pillars = [
  {
    title: "A word, every morning",
    body: "One switchword for the specific ache you're carrying. Delivered when you need it, not when it's convenient for a content calendar.",
  },
  {
    title: "A method that fits your actual life",
    body: "Three whispers. Three minutes. No candles required. No special cushion. No app subscription. Just a word you can carry with you.",
  },
  {
    title: "A practice, not a belief",
    body: "You don't have to believe switchwords work. You just have to try them. If they help, keep going. If they don't, move on. No cosmic commitment required.",
  },
];

const words = [
  ["TOGETHER", "For the mornings that feel scattered"],
  ["DIVINE-ORDER", "For when the day is too much"],
  ["COUNT", "For the flinch before checking money"],
  ["REACH", "For the conversation you've been avoiding"],
  ["BE", "For the day you've been trying to earn"],
  ["GIVE", "For the tight resentment you carry"],
  ["FIND", "For the uncertainty you've been hiding"],
];

async function getStressFinderEntries(): Promise<StressFinderEntry[]> {
  try {
    const { entries } = await serverApiRequest<StressFinderCatalogPayload>("/stress-finder");
    return entries;
  } catch (error) {
    if (error instanceof BackendError) {
      console.warn(
        `[home] Falling back to local stress finder entries because the backend returned ${error.status} ${error.code}.`,
      );
      return stressFinderFallbackEntries;
    }

    throw error;
  }
}

export default async function Home() {
  const [viewer, { entries: stressFinderEntries }] = await Promise.all([
    getOptionalAuthenticatedUser(),
    getStressFinderEntries().then((entries) => ({ entries })),
  ]);
  const showInactiveSubscriptionNotice = viewer?.role === "user" && !viewer.plan;

  return (
    <main>
      <SiteNav active="Home" viewer={viewer} />

      <section className="media-band" aria-label="Yosemite river at morning">
        <video
          className="media-band-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/forest-river.jpg"
        >
          <source src="/video/2442793_Yosemite_National_1920x1080.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="hero">
        <div className="hero-copy">
          <h1>
            <span>One word.</span>
            <span>Said softly.</span>
            <span>Said on purpose.</span>
          </h1>
          <p>
            The Switchwords is a quiet practice for loud mornings. One switchword each day,
            carried into the moments that need it. No hype. No chanting marathons. Just a
            practice that fits inside three minutes.
          </p>
        </div>
        {showInactiveSubscriptionNotice ? (
          <div className="inactive-subscription-banner" aria-live="polite">
            <p className="inactive-subscription-kicker">Subscription status</p>
            <h2>Currently you do not have an active subscription.</h2>
            <p>
              Choose a word below for the moment you are carrying. After that, select a
              subscription and complete payment to continue your practice.
            </p>
            <div className="inactive-subscription-actions">
              <a className="inactive-subscription-primary" href="#word-picker">
                Choose Your Word
              </a>
              <Link className="inactive-subscription-secondary" href="/pricing">
                View Subscriptions
              </Link>
            </div>
          </div>
        ) : null}
        <StressFinder entries={stressFinderEntries} />
      </section>

      <section className="morning-section" id="about">
        <h2>{"If your mornings feel scattered before they've even begun - this is for you."}</h2>
        <p>
          {
            "You open your eyes. Before you've sat up, the list starts. The emails. The money. The conversation you're avoiding. The thing you forgot yesterday. The role you're trying to fill. All of it, landing on you before you've even touched the floor."
          }
        </p>
        <p>
          {
            "You've tried the long morning routines. The journals with seventeen prompts. The affirmations that don't quite land. The meditations that ask for twenty minutes you don't have."
          }
        </p>
        <p>
          {
            "None of it stuck, because none of it fit inside your actual life. This does. One word. Three minutes. That's the whole practice."
          }
        </p>
        <p className="soft-line">{"One word. Three minutes. That's the whole practice."}</p>
      </section>

      <section className="pillars-section">
        <p className="eyebrow">What you get here</p>
        <div className="pillars">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <span aria-hidden="true" />
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="words-section">
        <p className="eyebrow">Seven words. Seven aches. Seven mornings.</p>
        <div className="word-grid">
          {words.map(([word, line]) => (
            <article key={word} className="word-card">
              <h3>{word}</h3>
              <p>{line}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />

      <SwitchwordsChatbot />
    </main>
  );
}
