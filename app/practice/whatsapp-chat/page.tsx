import { requirePracticeFeature } from "@/lib/server-auth";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";

const chatMessages = [
  {
    from: "coach",
    text: "Good morning! Your word for today is TOGETHER. How are you feeling this morning?",
    time: "7:00 AM",
  },
  {
    from: "user",
    text: "Morning feels scattered already. So much to do before 9am.",
    time: "7:15 AM",
  },
  {
    from: "coach",
    text: "Perfect time for TOGETHER. Try whispering it three times right now, even before you get out of bed. Let me know how it feels.",
    time: "7:16 AM",
  },
  {
    from: "user",
    text: "That actually helped. The scattered feeling softened a bit.",
    time: "7:20 AM",
  },
] as const;

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-action-icon" viewBox="0 0 20 20">
      <path
        d="M6.15 3.85c.35-.34.92-.34 1.27 0l1.65 1.66c.31.31.35.79.11 1.15l-.93 1.33c-.15.22-.17.51-.04.75.78 1.43 1.95 2.6 3.38 3.38.24.13.53.11.75-.04l1.33-.93a.9.9 0 0 1 1.15.11l1.66 1.65c.34.35.34.92 0 1.27l-1.06 1.06c-.63.63-1.57.9-2.44.7-2.33-.54-4.78-2.32-6.82-4.36-2.04-2.04-3.82-4.49-4.36-6.82-.2-.87.07-1.81.7-2.44l1.06-1.06Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-action-icon" viewBox="0 0 20 20">
      <rect
        x="3.5"
        y="5.5"
        width="9"
        height="9"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="m12.5 8.1 3.2-1.7a.55.55 0 0 1 .8.48v6.18a.55.55 0 0 1-.8.48l-3.2-1.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-action-icon" viewBox="0 0 20 20">
      <circle cx="10" cy="4.5" r="1.3" fill="currentColor" />
      <circle cx="10" cy="10" r="1.3" fill="currentColor" />
      <circle cx="10" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function DoubleCheckIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-status-icon" viewBox="0 0 16 16">
      <path
        d="m2.2 8.2 2.05 2.05 4.7-4.85"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <path
        d="m6 8.2 2.05 2.05 4.7-4.85"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-send-icon" viewBox="0 0 20 20">
      <path
        d="m4 9.2 10.7-4.3c.58-.23 1.14.33.91.91L11.3 16.5c-.26.66-1.2.66-1.46 0L8.2 11.8 3.5 10.16c-.66-.26-.66-1.2 0-1.46l10.55-4.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="practice-chat-note-icon" viewBox="0 0 16 16">
      <rect
        x="3.5"
        y="7"
        width="9"
        height="5.5"
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5.5 7V5.6A2.5 2.5 0 0 1 8 3.1a2.5 2.5 0 0 1 2.5 2.5V7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default async function WhatsAppChatPage() {
  const viewer = await requirePracticeFeature("whatsapp-chat");

  return (
    <PracticeDashboardShell activeNav="whatsapp-chat" viewer={viewer}>
      <section className="practice-panel-intro" aria-labelledby="whatsapp-title">
        <h2 id="whatsapp-title">WhatsApp Support</h2>
        <p>
          Chat directly with your practice coach. Responses within 2 hours during business
          hours.
        </p>
      </section>

      <section className="practice-chat-card" aria-label="Chat with Switchwords Coach">
        <div className="practice-chat-header">
          <div className="practice-chat-profile">
            <div className="practice-chat-avatar">
              <span>SW</span>
            </div>
            <div className="practice-chat-profile-copy">
              <h3>Switchwords Coach</h3>
              <p>Online &bull; Personal Support</p>
            </div>
          </div>

          <div className="practice-chat-actions" aria-label="Conversation actions">
            <button className="practice-chat-icon-button" type="button" aria-label="Call coach">
              <PhoneIcon />
            </button>
            <button className="practice-chat-icon-button" type="button" aria-label="Video call coach">
              <VideoIcon />
            </button>
            <button className="practice-chat-icon-button" type="button" aria-label="More options">
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className="practice-chat-thread">
          {chatMessages.map((message, index) => (
            <div
              className={`practice-chat-row${message.from === "user" ? " practice-chat-row-user" : ""}`}
              key={`${message.time}-${index}`}
            >
              <div
                className={`practice-chat-bubble${message.from === "user" ? " practice-chat-bubble-user" : " practice-chat-bubble-coach"}`}
              >
                <p>{message.text}</p>
                <div className="practice-chat-meta">
                  <span>{message.time}</span>
                  {message.from === "user" ? <DoubleCheckIcon /> : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="practice-chat-input-row">
          <div className="practice-chat-input">Type a message...</div>
          <button className="practice-chat-send" type="button" aria-label="Send message">
            <SendIcon />
          </button>
        </div>

        <div className="practice-chat-note">
          <LockIcon />
          <p>Messages are encrypted. Your coach responds within 2 hours during business hours.</p>
        </div>
      </section>
    </PracticeDashboardShell>
  );
}
