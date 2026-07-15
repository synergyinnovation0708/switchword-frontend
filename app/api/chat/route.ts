import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

const SWITCHWORDS_INSTRUCTIONS = `
You are the Switchwords guide for The Switchwords website.
Keep your tone warm, grounded, and calm.
Explain switchwords without sounding mystical or clinical.
When helpful, suggest exactly one switchword and briefly explain why it fits.
Keep answers to 2-4 short sentences.
Whenever you suggest a switchword, invite the user to whisper it three times and carry it into the moment that needs it.
Do not diagnose, promise healing, or replace professional mental-health care.
If the user mentions self-harm, suicide, or immediate danger, urge them to contact emergency services or a crisis line immediately.
`;

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type OpenAIResponse = {
  error?: {
    message?: string;
  };
  output?: Array<{
    type?: string;
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  output_text?: string;
};

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const maybeMessage = item as Partial<ChatMessage>;
      return (
        (maybeMessage.role === "assistant" || maybeMessage.role === "user") &&
        typeof maybeMessage.content === "string"
      );
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 1000),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-10);
}

function extractOutputText(response: OpenAIResponse) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const textParts: string[] = [];

  for (const item of response.output ?? []) {
    if (item.type !== "message") {
      continue;
    }

    for (const contentItem of item.content ?? []) {
      if (contentItem.type === "output_text" && contentItem.text) {
        textParts.push(contentItem.text.trim());
      }
    }
  }

  return textParts.join("\n\n").trim();
}

function fallbackReply(message: string) {
  const normalized = message.toLowerCase();

  if (
    /(suicid|kill myself|self harm|self-harm|hurt myself|end my life|can't go on|cannot go on)/i.test(
      normalized,
    )
  ) {
    return "I'm really glad you said that. If you're in immediate danger or might act on this, call or text 988 right now if you're in the U.S. or Canada, or contact your local emergency services immediately if you're elsewhere. Please also reach out to a trusted person near you right now and let them stay with you.";
  }

  if (/(what's a switchword|what is a switchword)/i.test(normalized)) {
    return "A switchword is a single word you lean on when a moment feels hard to hold. You whisper it three times, then carry it into the exact part of the day that feels tight, noisy, or heavy. It is less about magic and more about giving your mind one steady place to land.";
  }

  if (/(depress|sad|heavy|numb|low)/i.test(normalized)) {
    return "For a heavy, shut-down kind of feeling, I'd start with BE. It is a gentler word for the moments when life feels like too much to perform and you need to come back to simple presence. Whisper BE three times and carry it softly into the next ten minutes instead of the whole day.";
  }

  if (/(stress|overwhelm|anxious|scattered|panic|too much)/i.test(normalized)) {
    return "TOGETHER fits that scattered, too-many-things-at-once feeling. It helps gather your attention back into one place so the morning feels less fractured. Whisper TOGETHER three times and carry it into the very next task, not the whole list.";
  }

  if (/(money|financial|bill|debt|salary|rent)/i.test(normalized)) {
    return "COUNT is a strong word when money worry makes your body tighten before you've even opened the app or the spreadsheet. It can help the moment feel more workable and less catastrophic. Whisper COUNT three times before you look, then take only the first practical step.";
  }

  if (/(relationship|conversation|argument|partner|family|say something|talk to)/i.test(normalized)) {
    return "REACH would be a thoughtful place to start here. It supports the part of you that wants to move toward connection instead of bracing against it. Whisper REACH three times and carry it into the first honest sentence, not the entire conversation.";
  }

  if (/(resent|anger|bitter|frustrat)/i.test(normalized)) {
    return "GIVE can help when resentment has gone hard around the edges. Not to excuse what happened, but to loosen the grip just enough for you to choose your next move. Whisper GIVE three times and carry it into the next response you make.";
  }

  if (/(future|uncertain|confused|lost|direction|stuck)/i.test(normalized)) {
    return "FIND suits moments when the future feels foggy and your footing goes with it. It gives you a softer way back into clarity without forcing a full answer immediately. Whisper FIND three times and carry it into the next small decision.";
  }

  if (/(plan|pricing|murmur|presence|subscription)/i.test(normalized)) {
    return "Murmur and Presence are the plans built for more ongoing support, including daily AI guidance as part of the practice. If you want, I can still help you use your free messages to find the best switchword for today. Whisper the word three times, then carry it into the moment that feels most charged.";
  }

  return "A good switchword depends on the exact shape of what you're carrying. Tell me whether this feels more like overwhelm, heaviness, money worry, or relationship strain, and I'll suggest one clear word to try. Once you have it, whisper it three times and carry it into the next moment that needs steadiness.";
}

export async function POST(request: NextRequest) {
  let payload: { history?: unknown; message?: unknown };

  try {
    payload = (await request.json()) as { history?: unknown; message?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 240) : "";
  const history = normalizeHistory(payload.history);

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ mode: "fallback", reply: fallbackReply(message) });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        instructions: SWITCHWORDS_INSTRUCTIONS.trim(),
        input: [
          ...history.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          {
            role: "user",
            content: message,
          },
        ],
        max_output_tokens: 220,
      }),
      signal: AbortSignal.timeout(20000),
    });

    const data = (await response.json()) as OpenAIResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? "OpenAI request failed.");
    }

    const reply = extractOutputText(data);

    if (!reply) {
      throw new Error("Model returned no text.");
    }

    return NextResponse.json({ mode: "live", reply });
  } catch {
    return NextResponse.json({ mode: "fallback", reply: fallbackReply(message) });
  }
}
