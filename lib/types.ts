export type Plan = "whisper" | "murmur" | "presence";
export type Role = "user" | "admin";
export type AccountStatus = "pending_password_setup" | "active";
export type PracticeFeature =
  | "today-word"
  | "whatsapp-chat"
  | "phone-support"
  | "practice-log"
  | "personal-plan"
  | "weekly-check-ins"
  | "settings";

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: Role;
  plan: Plan | null;
  accountStatus: AccountStatus;
  timeZone: string;
  deliveryPrefs: {
    emailEnabled: boolean;
    whatsappEnabled: boolean;
  };
};

export type AdminUserRow = PublicUser & {
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminUsersPayload = {
  users: AdminUserRow[];
  pagination: PaginationMeta;
};

export type SubscriptionPlan = {
  slug: Plan;
  name: string;
  deck: string;
  price: number;
  features: string[];
  checkoutFeatures: string[];
  checkoutBillingNote: string | null;
  cta: string;
  featured: boolean;
  sortOrder: number;
  practiceFeatures: PracticeFeature[];
};

export type AdminSubscriptionPlan = SubscriptionPlan & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionPlansPayload = {
  plans: SubscriptionPlan[];
};

export type AdminSubscriptionPlansPayload = {
  plans: AdminSubscriptionPlan[];
};

export type StressFinderEntry = {
  id: string;
  label: string;
  word: string;
  description: string;
  sortOrder: number;
};

export type AdminStressFinderEntry = StressFinderEntry & {
  createdAt: string;
  updatedAt: string;
};

export type StressFinderCatalogPayload = {
  entries: StressFinderEntry[];
};

export type AdminStressFinderCatalogPayload = {
  entries: AdminStressFinderEntry[];
};

export type TodayWord = {
  date: string;
  word: string;
  label: string;
  explanation: string;
  source: "starter-program";
  practiced: boolean;
  streak: number;
  monthCount: number;
  goal: number;
};

export type PracticeLogMonth = {
  month: string;
  practicedDays: number[];
  currentStreak: number;
  longestStreak: number;
  monthCount: number;
};

export type SettingsPayload = {
  email: string;
  phone: string;
  deliveryPrefs: {
    emailEnabled: boolean;
    whatsappEnabled: boolean;
  };
};

type ApiSuccess<T> = {
  data: T;
};

type ApiFailure = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
