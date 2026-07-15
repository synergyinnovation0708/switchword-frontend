export const PRACTICE_FEATURES = [
  "today-word",
  "whatsapp-chat",
  "phone-support",
  "practice-log",
  "personal-plan",
  "weekly-check-ins",
  "settings",
] as const;

export type PracticeFeature = (typeof PRACTICE_FEATURES)[number];

export const PRACTICE_FEATURE_LABELS: Record<PracticeFeature, string> = {
  "today-word": "Today's Word",
  "whatsapp-chat": "WhatsApp Chat",
  "phone-support": "Phone Support",
  "practice-log": "Practice Log",
  "personal-plan": "Personal Plan",
  "weekly-check-ins": "Weekly Check-ins",
  settings: "Settings",
};
