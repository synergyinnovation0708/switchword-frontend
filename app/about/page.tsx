import { SiteFooter, SiteNav } from "../components/site-chrome";

const methodSteps = [
  {
    number: "1",
    title: "Choose your word",
    body: "Pick the switchword that matches the ache you're carrying. Scattered? TOGETHER. Money anxiety? COUNT. Too much to do? DIVINE-ORDER.",
  },
  {
    number: "2",
    title: "Whisper it three times",
    body: "Say it softly, out loud or in your head. Three times. Not seventeen. Not while standing on one foot. Just three whispers.",
  },
  {
    number: "3",
    title: "Carry it with you",
    body: "When the ache comes back - and it will - whisper the word again. In the elevator. Before the meeting. At the red light. Anywhere.",
  },
];

const forYou = [
  "You wake up already thinking about what needs fixing",
  "You've tried the long routines and they didn't stick",
  "You want a practice that fits in the margins",
  "You're skeptical, but curious enough to try",
  "You prefer understatement to hype",
];

const notForYou = [
  "You're looking for a cosmic code or secret frequency",
  "You want a guru, not a practice",
  "You prefer the language of abundance manifestation",
  "You need someone to believe for you",
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <SiteNav active="About" />

      <section className="about-intro">
        <div className="about-narrow">
          <h1>
            <span>This isn&apos;t a brand.</span>
            <span>It&apos;s a practice.</span>
          </h1>
          <div className="about-copy">
            <p>
              The Switchwords exists to give you one word when you need it. Not ten
              affirmations. Not a seventeen-step morning ritual. Just one word that shifts the
              way a moment feels.
            </p>
            <p>
              It&apos;s for the morning you wake up already scattered. The flinch before you
              check your balance. The conversation you&apos;ve been avoiding. The grief that sits
              in your chest. The day you&apos;re trying too hard to earn.
            </p>
            <p>
              This practice doesn&apos;t ask you to believe anything. It asks you to try one word,
              three times, and see what shifts. That&apos;s it.
            </p>
          </div>
        </div>
      </section>

      <section className="about-definition">
        <div className="about-wide">
          <h2>A switchword is a single word that changes a mood.</h2>
          <div className="about-definition-copy">
            <p>
              Not through affirmation. Not through repetition for the sake of repetition. But
              through something quieter. A word lands. A breath shifts. The moment feels
              different.
            </p>
            <p>
              Switchwords have been used for decades, mostly in corners of the internet that
              smell like essential oils and cosmic codes. I&apos;m not interested in that version.
            </p>
            <p>
              This version is quieter. More honest. And built for people who want a practice
              that fits inside their actual life - not the life they&apos;re supposed to be living.
            </p>
            <p className="about-soft">One word. Three whispers. That&apos;s the method.</p>
          </div>
        </div>
      </section>

      <section className="about-method">
        <p className="eyebrow">The method</p>
        <h2>The Three Whispers</h2>
        <div className="method-grid">
          {methodSteps.map((step, index) => (
            <article className="method-step" key={step.number}>
              <p className="method-number">{step.number}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {index < methodSteps.length - 1 ? <span aria-hidden="true" /> : null}
            </article>
          ))}
        </div>
        <p className="method-note">That&apos;s it. That&apos;s the whole method.</p>
      </section>

      <section className="about-fit">
        <div className="fit-column fit-positive">
          <h2>This is for you if -</h2>
          <ul>
            {forYou.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="fit-column fit-muted">
          <h2>This is not for you if -</h2>
          <ul>
            {notForYou.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-note">
        <div className="about-wide">
          <h2>A note on who&apos;s behind this.</h2>
          <div className="about-note-copy">
            <p>
              This practice was built by someone who tried all the long rituals and none of them
              stuck. Someone who wanted a practice that fit inside three minutes, not three
              hours.
            </p>
            <p>
              I&apos;m not a guru. I&apos;m not certified in anything cosmic. I&apos;m just someone who
              found switchwords years ago, stripped away the hype, and built a practice that
              actually fit inside my life.
            </p>
            <p>
              If you have questions, or if something here doesn&apos;t land right, you can reach me
              at <a href="mailto:hello@theswitchwords.com">hello@theswitchwords.com</a>. I read
              every message.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
