"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const FREE_MESSAGE_LIMIT = 2;
const QUICK_PROMPTS = ["What's a switchword?", "Depression", "Financial stress"] as const;

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "I can help you understand switchwords, find the right word for what you're carrying, or explain how the practice works. What would be most helpful right now?",
  },
];

let messageSequence = 0;

function createMessageId(prefix: string) {
  messageSequence += 1;
  return `${prefix}-${messageSequence}`;
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="m5 5 10 10M15 5 5 15"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d="m3.8 9.2 10.96-4.46c.55-.22 1.08.31.87.87L11.17 16.6c-.25.63-1.15.64-1.43.01L8.02 11.9l-4.7-1.26c-.68-.18-.71-1.13-.04-1.44Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="switchwords-chatbot-dots" aria-label="Assistant is thinking">
      <span />
      <span />
      <span />
    </div>
  );
}

export function SwitchwordsChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isPending, setIsPending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const usedMessages = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  );
  const remainingMessages = Math.max(0, FREE_MESSAGE_LIMIT - usedMessages);
  const showUpsell = remainingMessages === 0;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      if (panelRef.current?.contains(target) || launcherRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
      launcherRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages, isPending]);

  const submitMessage = async (nextMessage: string) => {
    const message = nextMessage.trim();

    if (!message || isPending || remainingMessages === 0) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: message,
    };

    setIsOpen(true);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setDraft("");
    setIsPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as { error?: string; reply?: string };
      const reply = data.reply;

      if (!response.ok || !reply) {
        throw new Error(data.error ?? "The assistant did not return a reply.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("assistant-error"),
          role: "assistant",
          content:
            "I lost the thread for a moment. Try again and I'll pick it back up gently.",
        },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMessage(draft);
  };

  return (
    <div className="switchwords-chatbot">
      <button
        ref={launcherRef}
        className="chat-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="switchwords-chatbot-panel"
        aria-label={isOpen ? "Close Switchwords chatbot" : "Open Switchwords chatbot"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Image src="/icons/Group.svg" alt="" aria-hidden="true" width={42} height={42} />
      </button>

      {isOpen ? (
        <div
          id="switchwords-chatbot-panel"
          ref={panelRef}
          className="switchwords-chatbot-panel"
          role="dialog"
          aria-label="Switchwords guide"
        >
          <div className="switchwords-chatbot-head">
            <div className="switchwords-chatbot-brand">
              <span className="switchwords-chatbot-brand-mark" aria-hidden="true">
                <Image src="/icons/Group.svg" alt="" width={24} height={24} />
              </span>
              <div className="switchwords-chatbot-brand-copy">
                <strong>Switchwords guide</strong>
                <span>
                  {showUpsell
                    ? "Free messages used"
                    : `${remainingMessages} free message${remainingMessages === 1 ? "" : "s"} left`}
                </span>
              </div>
            </div>

            <button
              className="switchwords-chatbot-close"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="switchwords-chatbot-thread">
            {messages.map((message) => (
              <div
                className={`switchwords-chatbot-row${message.role === "user" ? " switchwords-chatbot-row-user" : ""}`}
                key={message.id}
              >
                <div
                  className={`switchwords-chatbot-bubble switchwords-chatbot-bubble-${message.role}`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && !isPending && !showUpsell ? (
              <div className="switchwords-chatbot-prompt-grid" aria-label="Suggested questions">
                {QUICK_PROMPTS.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => submitMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {isPending ? (
              <div className="switchwords-chatbot-row">
                <div className="switchwords-chatbot-bubble switchwords-chatbot-bubble-assistant">
                  <TypingDots />
                </div>
              </div>
            ) : null}

            {showUpsell ? (
              <div className="switchwords-chatbot-card">
                <h3>That&apos;s your 2 free messages</h3>
                <p>
                  Upgrade to Murmur or Presence for daily AI support as part of your
                  practice.
                </p>
                <Link href="/pricing">See plans</Link>
              </div>
            ) : null}

            <div ref={threadEndRef} />
          </div>

          <form className="switchwords-chatbot-compose" onSubmit={handleSubmit}>
            <label className="switchwords-chatbot-field" htmlFor="switchwords-chat-input">
              <input
                id="switchwords-chat-input"
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={
                  showUpsell
                    ? "Free chat limit reached for now"
                    : "Tell me what you're carrying right now"
                }
                disabled={isPending || showUpsell}
                maxLength={240}
              />
            </label>

            <button
              className="switchwords-chatbot-send"
              type="submit"
              aria-label="Send message"
              disabled={isPending || showUpsell || !draft.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
