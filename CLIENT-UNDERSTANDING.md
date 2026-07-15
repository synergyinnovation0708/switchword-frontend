# Client Understanding

## What this frontend is

`client/` is a `Next.js 16` + `React 19` frontend for **The Switchwords**.

The product is not just a landing page. It is a calm wellness/practice platform with four layers:

- A public brand and storytelling website
- A pricing and checkout funnel
- Logged-in user practice dashboards
- An admin/business dashboard

The core idea is simple: the user gets one "switchword" for the emotional state they are carrying, then uses the **Three Whispers** method to ground themselves.

## Product intent

From the copy and page structure, this app is trying to sell a quiet, non-hype daily practice:

- one word for one problem
- a short daily ritual
- guided support that increases by subscription tier
- human + AI support for premium members

The tone is intentionally soft, grounded, and anti-guru. The UI style also matches that direction: warm paper colors, serif-heavy editorial typography, soft greens, gold accents, and a calm video-led hero section.

## Main user journeys

1. A visitor lands on the homepage, understands the method, and explores common concerns.
2. They read supporting trust pages like `About`, `Journal`, and `Contact`.
3. They compare plans on `Pricing` and move into a per-plan checkout page.
4. A basic user can access limited resources from `User Dashboard`.
5. A premium user enters the `Practice` area for daily words, logs, coaching, support, and settings.
6. A business/admin user signs into a separate admin portal and sees business metrics.

## Route map

### Public marketing

- `/`
- `/about`
- `/journal`
- `/pricing`
- `/pricing/[plan]`
- `/contact`

### Auth

- `/signin`
- `/signup`
- `/admin/login`

### User and practice

- `/user-dashboard`
- `/practice`
- `/practice/whatsapp-chat`
- `/practice/phone-support`
- `/practice/practice-log`
- `/practice/personal-plan`
- `/practice/weekly-check-ins`
- `/practice/settings`

### Admin

- `/admin/dashboard`

There are `18` page routes in total under `app/`.

## Subscription model

The plan structure is clear in `app/pricing/plans.ts`:

- `Whisper` (`Rs 19/month`): starter plan with PDF, switchword access, newsletter, and a stress-to-word finder
- `Murmur` (`Rs 399/month`): daily personalized word, tracking dashboard, AI chat guidance, monthly reflection prompts
- `Presence` (`Rs 999/month`): WhatsApp delivery, unlimited AI chat, personal practice plan, weekly check-ins, and priority support

So the business model is a **tiered subscription product**, where free or low-cost content leads into higher-touch guided support.

## What is already implemented

- Strong static frontend coverage for almost the whole product experience
- Shared brand system through `globals.css`, custom fonts, and recurring visual patterns
- Public storytelling pages with polished copy and layout
- Pricing comparison and plan-specific checkout UI
- User dashboard and premium practice dashboard UIs
- Admin login and admin metrics screens
- A floating chatbot component with quick prompts and an upsell after free messages
- An API route at `app/api/chat/route.ts` that calls the OpenAI Responses API when `OPENAI_API_KEY` is available

## What is still mostly mock or prototype

Most of the app is currently **frontend-only demo state**, not a connected product yet.

These areas still look static or placeholder-based:

- sign in, sign up, and admin login forms
- checkout form and payment processing
- user account creation and session handling
- dashboard data persistence
- practice streak updates and "mark as practiced"
- WhatsApp, phone, and weekly check-in workflows
- settings updates and subscription cancellation
- admin analytics and activity feeds

The chatbot is the only place with a real integration path, and even there:

- it depends on `OPENAI_API_KEY`
- it falls back to hardcoded replies if the key is missing
- the free-message limit is enforced in client state only

## Important implementation clues

- `app/components/site-chrome.tsx` contains the shared nav and footer, but some pages still duplicate those sections inline
- `app/components/practice-dashboard-shell.tsx` is the shared shell for premium practice pages
- many `.png` files in the root of `client/` look like design/reference screenshots rather than live app assets
- the homepage is the main brand entry point and includes the floating chatbot by default
- video and image assets used by the live site currently come mainly from `public/`

## Best short summary

If we say it in one line:

**This client app is a polished frontend prototype for a subscription-based emotional wellness practice product called The Switchwords, combining marketing pages, checkout, member dashboards, premium support flows, and an AI guide.**

## What likely needs to be built next

- real auth and role-based access
- real subscription and payment integration
- persisted user profile, plan, and practice data
- server-backed chat usage limits
- daily word delivery via email and WhatsApp
- coach/check-in workflow management
- admin APIs and real reporting
- cleanup of repeated layout code into shared components
