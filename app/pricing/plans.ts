import type { Plan, SubscriptionPlan } from "@/lib/types";

export type ComparisonRow = {
  label: string;
  values: Record<Plan, boolean | string>;
};

export type PricingDisplayPlan = {
  slug: Plan;
  eyebrow: string;
  description: string;
  monthlyLabel: string;
  yearlyLabel?: string;
  cardFeatures: string[];
  cardCta: string;
  badge?: string;
};

export type PricingAccordionItem = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  details: string;
};

export type PricingDetailSection = {
  title: string;
  body?: string;
  items?: string[];
  tone?: "default" | "muted" | "quote";
};

export type PricingTierBreakdown = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  sections: PricingDetailSection[];
};

export type PricingExtraCard = {
  badge: string;
  title: string;
  price: string;
  secondaryPrice?: string;
  description: string;
  features: string[];
  cta: string;
  note: string;
};

export type PricingSummaryRow = {
  tier: string;
  name: string;
  price: string;
  businessFunction: string;
  audienceSize: string;
  featured?: boolean;
};

export const plans: SubscriptionPlan[] = [
  {
    slug: "whisper",
    name: "Whisper",
    deck: "Start with the basics",
    price: 19,
    features: [
      "The 7-Day Whisper PDF",
      "Access to all switchwords",
      "Weekly email with one word",
      "Stress-to-word finder",
    ],
    checkoutFeatures: [],
    checkoutBillingNote: null,
    cta: "Choose Whisper",
    featured: false,
    sortOrder: 10,
    practiceFeatures: [],
  },
  {
    slug: "murmur",
    name: "Murmur",
    deck: "Personalized daily practice",
    price: 399,
    features: [
      "Everything in Whisper",
      "Personalized daily word via email",
      "Practice tracking dashboard",
      "AI chat support (2 messages/day)",
      "Monthly reflection prompts",
      "Cancel anytime",
    ],
    checkoutFeatures: [
      "Personalized daily word via email",
      "Practice tracking dashboard",
      "AI chat support (2 messages/day)",
      "Monthly reflection prompts",
    ],
    checkoutBillingNote:
      "Billed monthly. You'll be charged Rs 399 today, then every month on this date. Cancel anytime.",
    cta: "Choose Murmur",
    featured: true,
    sortOrder: 20,
    practiceFeatures: ["today-word", "practice-log", "settings"],
  },
  {
    slug: "presence",
    name: "Presence",
    deck: "Full guided practice",
    price: 999,
    features: [
      "Everything in Murmur",
      "Daily word via WhatsApp",
      "Unlimited AI chat support",
      "Personal practice plan",
      "Weekly 1-on-1 check-in (text)",
      "Priority email support",
    ],
    checkoutFeatures: [
      "Daily word via WhatsApp",
      "Unlimited AI chat support",
      "Personal practice plan",
      "Weekly 1-on-1 check-in (text)",
      "Priority email support",
    ],
    checkoutBillingNote:
      "Billed monthly. You'll be charged Rs 999 today, then every month on this date. Cancel anytime.",
    cta: "Choose Presence",
    featured: false,
    sortOrder: 30,
    practiceFeatures: [
      "today-word",
      "whatsapp-chat",
      "phone-support",
      "practice-log",
      "personal-plan",
      "weekly-check-ins",
      "settings",
    ],
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    label: "7-Day Whisper PDF",
    values: { whisper: true, murmur: true, presence: true },
  },
  {
    label: "Weekly email newsletter",
    values: { whisper: true, murmur: true, presence: true },
  },
  {
    label: "Access to Journal (blog)",
    values: { whisper: true, murmur: true, presence: true },
  },
  {
    label: "Choose a Word tool",
    values: { whisper: true, murmur: true, presence: true },
  },
  {
    label: "Full switchword library (50+ words)",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Personalized daily word (email/WhatsApp)",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Practice tracking dashboard",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Monthly ritual guide (themed PDF)",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Monthly reflection prompts",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Curated archive of past words",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Community access (Telegram/WhatsApp)",
    values: { whisper: false, murmur: true, presence: true },
  },
  {
    label: "Personal switchword prescription (monthly audio)",
    values: { whisper: false, murmur: false, presence: true },
  },
  {
    label: "Weekly 1-on-1 check-in (WhatsApp)",
    values: { whisper: false, murmur: false, presence: true },
  },
  {
    label: "Personal practice plan (quarterly)",
    values: { whisper: false, murmur: false, presence: true },
  },
  {
    label: "Priority response (24 hours)",
    values: { whisper: false, murmur: false, presence: true },
  },
  {
    label: "Early access to new content",
    values: { whisper: false, murmur: false, presence: true },
  },
  {
    label: "1 free consultation per quarter",
    values: { whisper: false, murmur: false, presence: true },
  },
];

export const pricingDisplayPlans: Record<Plan, PricingDisplayPlan> = {
  whisper: {
    slug: "whisper",
    eyebrow:
      "Acquisition: Convert Instagram followers and organic search visitors into email subscribers.",
    description: "A gentle place to begin and a clear entry point into the Switchwords method.",
    monthlyLabel: "\u20b90",
    yearlyLabel: "/forever free",
    cardFeatures: [
      "7-Day Whisper PDF",
      "Weekly email newsletter",
      "Full access to the Journal (blog)",
      '"Choose a Word" interactive tool',
      "Instagram content access",
    ],
    cardCta: "Get Started Free",
  },
  murmur: {
    slug: "murmur",
    eyebrow: "Daily personalised switchwords and practice tracking. The core business.",
    description: "The recurring tier for committed personal practice and habit-building.",
    monthlyLabel: "\u20b9399/mo",
    yearlyLabel: "or \u20b92,999/year (save 37%)",
    cardFeatures: [
      "Personalized daily switchword",
      "Full switchword library (50+ words)",
      "Practice tracking dashboard",
      "Monthly ritual guide (themed PDF)",
      "Monthly reflection prompts",
      "Community access",
      "Curated archive of past words",
    ],
    cardCta: "Start Your Practice",
    badge: "Most Popular",
  },
  presence: {
    slug: "presence",
    eyebrow: "High-value personalised practice with founder access. Limited to 50-100 subscribers.",
    description: "The highest-touch tier for deeper support, feedback, and accountability.",
    monthlyLabel: "\u20b9999/mo",
    yearlyLabel: "or \u20b97,999/year (save 33%)",
    cardFeatures: [
      "Personal switchword prescription (monthly audio)",
      "Weekly 1-on-1 WhatsApp check-in",
      "Personal practice plan (quarterly)",
      "Priority response (24 hours)",
      "Early access to new content",
      "1 free consultation per quarter",
    ],
    cardCta: "Join Waitlist",
  },
};

export const pricingSummaryRows: PricingSummaryRow[] = [
  {
    tier: "Free",
    name: "Whisper",
    price: "\u20b90",
    businessFunction: "Acquisition \u2014 Instagram to email list",
    audienceSize: "Unlimited",
  },
  {
    tier: "Subscription",
    name: "Murmur",
    price: "\u20b9399/month or \u20b92,999/year",
    businessFunction: "Recurring revenue \u2014 the core business",
    audienceSize: "500-2,000 subscribers at scale",
    featured: true,
  },
  {
    tier: "Premium",
    name: "Presence",
    price: "\u20b9999/month or \u20b97,999/year",
    businessFunction: "High-value personalised practice",
    audienceSize: "50-100 subscribers (capacity-limited)",
  },
  {
    tier: "Course",
    name: "The Whisper Course",
    price: "\u20b91,999 (one-time)",
    businessFunction: "First monetisation \u2014 converts email to buyer",
    audienceSize: "Unlimited (evergreen)",
  },
  {
    tier: "Consultation",
    name: "Personal Switchword Session",
    price: "\u20b91,500-2,500/session",
    businessFunction: "Ultra-premium, founder-delivered service",
    audienceSize: "5-10 sessions/month max",
  },
];

export const pricingTierBreakdowns: PricingTierBreakdown[] = [
  {
    id: "tier-1",
    eyebrow: "Tier 1",
    title: "Whisper (Free)",
    summary: "\u20b90 \u2014 forever free",
    sections: [
      {
        title: "Purpose",
        body: "Acquisition. Convert Instagram followers and organic search visitors into email subscribers. Build the relationship that makes paid conversion possible.",
      },
      {
        title: "What's Included",
        items: [
          "The 7-Day Whisper PDF \u2014 instant download on signup",
          "Weekly email \u2014 one switchword + a short reflection, every Sunday morning",
          "Full access to the Journal (blog) \u2014 all SEO content, always free",
          "The 'Choose a Word' interactive tool on the website \u2014 select your ache, receive a switchword",
          "Instagram content \u2014 all reels, carousels, and stories",
        ],
      },
      {
        title: "What's Not Included",
        tone: "muted",
        items: [
          "Personalised daily words (Murmur and above)",
          "Practice tracking dashboard",
          "Community access",
          "Monthly rituals and reflection prompts",
          "Personal consultations",
        ],
      },
      {
        title: "Conversion Target",
        tone: "quote",
        items: [
          "5-8% of Whisper subscribers convert to the course (Month 4+)",
          "3-5% of Whisper subscribers convert directly to Murmur (Month 6+)",
        ],
      },
      {
        title: "Why This Tier Is Generous",
        tone: "quote",
        items: [
          "The free tier must deliver real value \u2014 not a teaser. Someone who never pays should still have a genuine switchword practice from the free content alone.",
          "This generosity is the brand's trust engine. Every testimonial, every word-of-mouth recommendation, every Instagram share comes from Whisper-tier users who got enough value to tell someone else.",
        ],
      },
    ],
  },
  {
    id: "tier-2",
    eyebrow: "Tier 2",
    title: "Murmur (\u20b9399/month)",
    summary: "\u20b9399/month - or \u20b92,999/year (save 37%)",
    sections: [
      {
        title: "Price Psychology",
        body: "\u20b9399 sits below the \u20b9500 psychological threshold where Indian professional women (28-45, metro, working) begin to deliberate on discretionary spending. It's the price of two Starbucks coffees, one-third of a therapy session, and one-fifth of an astrology consultation. For daily value delivery, this is an impulse-accessible price point. The annual option at \u20b92,999 (effectively \u20b9249/month) rewards commitment, improves cash flow, and signals that this is a long-term practice \u2014 not a one-month experiment. Target: 30-40% of subscribers should choose annual.",
      },
      {
        title: "What's Included",
        items: [
          "Everything in Whisper, plus:",
          "Personalised daily switchword \u2014 delivered via email and/or WhatsApp each morning before 7 AM, selected based on themes the subscriber identifies during onboarding (money, relationships, anxiety, career, health, etc.)",
          "The full switchword library \u2014 50+ words with detailed guides, usage instructions, and origin context for each",
          "Practice tracking dashboard \u2014 the 'Your Practice' page on the website where subscribers see their daily word, track their practice streak, and review past words",
          "Monthly ritual guide \u2014 a themed PDF delivered on the 1st of each month (January: Money & Abundance with FOUNTAIN, February: Love & Relationships with BREAKTHROUGH-LOVE-VENUS, and so on)",
          "Monthly reflection prompts \u2014 4 journal prompts aligned with the month's theme",
          "Curated archive \u2014 searchable database of all past daily words with context and usage notes",
          "Community access \u2014 private Telegram or WhatsApp group for Murmur subscribers. Moderated, quiet, supportive. No spam. No self-promotion. Just the practice.",
        ],
      },
      {
        title: "What's Not Included",
        tone: "muted",
        items: [
          "Personal audio prescriptions (Presence only)",
          "Weekly 1-on-1 check-ins (Presence only)",
          "Personal practice plan (Presence only)",
          "1-on-1 consultations (separate purchase)",
        ],
      },
      {
        title: "Operational Load",
        tone: "quote",
        items: [
          "Daily word selection and delivery: 15-20 minutes/day once the system is set up (can be batched weekly)",
          "Monthly ritual guide: 2-3 hours to create, once per month",
          "Community moderation: 15 minutes/day",
          "Total: 6-7 hours/week \u2014 sustainable alongside your professional role",
        ],
      },
      {
        title: "Retention Strategy",
        tone: "quote",
        items: [
          "The daily delivery creates a daily habit \u2014 and daily habits are the hardest to cancel",
          "Monthly themes create anticipation and a sense of progression",
          "The community creates social accountability \u2014 people don't cancel things their friends use too",
          "The practice tracking dashboard creates a streak effect \u2014 missing a day feels like breaking a chain",
        ],
      },
    ],
  },
  {
    id: "tier-3",
    eyebrow: "Tier 3",
    title: "Presence (\u20b9999/month)",
    summary: "\u20b9999/month - or \u20b97,999/year (save 33%)",
    sections: [
      {
        title: "Price Psychology",
        body: "\u20b9999 is the price of one therapy session but delivers daily value for a month. It's below the \u20b91,000 round-number threshold \u2014 psychologically, \u20b9999 feels like 'under a thousand' even though it's one rupee short. The annual option at \u20b97,999 (effectively \u20b9667/month) is a meaningful commitment that filters for serious practitioners \u2014 exactly the people you want in this tier.",
      },
      {
        title: "What's Included",
        items: [
          "Everything in Murmur, plus:",
          "Personal switchword prescription \u2014 a monthly 15-minute audio note from you, prescribing 5-7 specific switchwords based on what the subscriber shares about their current life situation. Delivered on the 1st of each month.",
          "Weekly 1-on-1 text check-in \u2014 every Monday, you send a short WhatsApp voice note asking how their practice is going. They respond. You reply with a word or a thought. This takes 2-3 minutes per subscriber.",
          "Personal practice plan \u2014 quarterly (every 3 months), you write a one-page practice plan specifically for this subscriber: Which words, which rituals, which journal prompts \u2014 based on their progress and current life situation.",
          "Priority response \u2014 questions answered within 24 hours. (vs. 72 hours for Murmur community questions)",
          "Early access \u2014 first to see new courses, content, and features before they go public",
        ],
      },
      {
        title: "Capacity Constraint",
        tone: "quote",
        items: [
          "This tier is capacity-limited by design. You can serve a maximum of 50-100 Presence subscribers before the personal attention becomes unsustainable.",
          "At 50 subscribers + weekly 3-minute check-ins = 2.5 hours/week",
          "At 50 subscribers + monthly 15-minute audio prescriptions = 12.5 hours/month",
          "At 50 subscribers + quarterly 1-page practice plans = ~2.5 hours/quarter",
          "Total operational load at 50 subscribers = 5-6 hours/week \u2014 manageable but meaningful",
          "When the tier is full, create a waitlist. Scarcity is genuine (you literally cannot serve more people at this quality level) and it creates demand that sustains the tier's pricing power.",
        ],
      },
    ],
  },
];

export const pricingAdditionalOfferings: PricingAccordionItem[] = [
  {
    id: "course",
    eyebrow: "Course",
    title: "The Whisper Course (6-day one-time)",
    summary: "\u20b91,999 (one-time purchase, lifetime access)",
    details:
      "A self-paced course that teaches the core switchwords, the True Whispers method, and how to build personal rituals around them.",
  },
  {
    id: "consultation",
    eyebrow: "Consultation",
    title: "Personal Switchword Session",
    summary: "\u20b91,500 per 30-minute session - \u20b92,500 per 60-minute session",
    details:
      "A direct consultation with the founder for assessment, prescription, and practical next-step guidance.",
  },
];

export const pricingExtraCards: PricingExtraCard[] = [
  {
    badge: "One-time Purchase",
    title: "The Whisper Course",
    price: "\u20b91,999",
    description:
      "A structured video course teaching the 25 switchwords you need and The Three Whispers method.",
    features: [
      "8 comprehensive modules",
      "25 switchwords organized by life area",
      "The Three Whispers method in depth",
      "Downloadable PDF workbook",
      "Lifetime access to all content",
    ],
    cta: "Enroll Now",
    note: "Bundle: Course + 3 months of Murmur for \u20b92,999 (save \u20b91,196)",
  },
  {
    badge: "Founder Access",
    title: "Personal Switchword Session",
    price: "\u20b91,500",
    secondaryPrice: "\u20b92,500 / 60 min session",
    description:
      "One-on-one consultation with the founder for personal switchword assessment and prescription.",
    features: [
      "Video/audio call with founder",
      "Personal assessment of your needs",
      "Written prescription (5-7 words)",
      "Usage instructions and timing",
      "Follow-up after 2 weeks",
    ],
    cta: "Book Session",
    note: "Limited to 5-10 sessions per month",
  },
];

export function getPlanBySlug(slug: string, availablePlans: SubscriptionPlan[] = plans) {
  return availablePlans.find((plan) => plan.slug === slug);
}

export function getSubscriptionPlanDefaults(slug: Plan) {
  return plans.find((plan) => plan.slug === slug) ?? null;
}
