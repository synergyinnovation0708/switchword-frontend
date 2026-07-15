import { SiteFooter, SiteNav } from "../components/site-chrome";

const articles = [
  {
    category: "The method",
    title: "What is a switchword, actually?",
    deck: "A short history of switchwords, stripped of the hype and cosmic codes.",
    body: 'Switchwords have been around since the 1960s, when a man named James T. Mangan wrote a small book called "The Secret of Perfect Living." He proposed that certain words - when spoken with intention - could shift a person\'s internal state. Not through magic. Not through frequency. But through something quieter. A word lands. A breath shifts. The moment feels different. Over the decades, switchwords became tangled up in manifestation culture, buried under layers of cosmic language and abundance codes. This practice strips all that away. What remains is simple: one word, said softly, said on purpose. That\'s it.',
  },
  {
    category: "Honest takes",
    title: 'Why I don\'t use the word "manifest."',
    deck: "On language, hype, and why this practice avoids the vocabulary of abundance culture.",
    body: 'The word "manifest" carries too much weight. It implies that if you say the right words in the right order, your life will rearrange itself to match your vision. That if it doesn\'t work, you didn\'t believe hard enough. I don\'t use that word here because this practice isn\'t about rearranging your life. It\'s about shifting a moment. One moment. One word. One breath. That\'s the scope. If the morning feels scattered, and you whisper TOGETHER, and the scattering softens - that\'s enough. You don\'t need to call it manifestation. You can just call it helpful.',
  },
];

export default function JournalPage() {
  return (
    <main className="journal-page">
      <SiteNav active="Journal" />

      <section className="journal-hero">
        <h1>The Journal</h1>
        <p>Longer notes on the practice. Read one when you need it.</p>
      </section>

      <section className="journal-list" aria-label="Journal articles">
        <div className="journal-stack">
          {articles.map((article, index) => (
            <article
              className={`journal-article${index > 0 ? " journal-article-divided" : ""}`}
              key={article.title}
            >
              <p className="journal-category">{article.category}</p>
              <h2>{article.title}</h2>
              <p className="journal-deck">{article.deck}</p>
              <p className="journal-body">{article.body}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
