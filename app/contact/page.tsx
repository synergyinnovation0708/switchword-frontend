import { SiteFooter, SiteNav } from "../components/site-chrome";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <SiteNav active="Contact" />

      <section className="contact-panel" aria-labelledby="contact-title">
        <div className="contact-copy">
          <h1 id="contact-title">A quiet inbox.</h1>
          <p className="contact-intro">
            If you have a question about the practice, or if something here doesn&apos;t sit
            right, or if you just want to say hello &mdash; you can reach me here.
          </p>
          <a className="contact-email" href="mailto:hello@theswitchwords.com">
            hello@theswitchwords.com
          </a>
          <p className="contact-response">I read every message. I answer most within a few days.</p>
          <p className="contact-favorite">
            If you&apos;re writing to share how a word landed for you, or to ask about a specific
            ache you&apos;re carrying &mdash; I&apos;d love to hear it. Those messages are my favorite.
          </p>
          <p className="contact-press">
            For press, podcasts, or collaboration inquiries &mdash; same address. I&apos;ll get back
            to you as soon as I can.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
