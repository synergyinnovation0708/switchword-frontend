import type { Plan, Role } from "./types";

const PLAN_ORDER: Record<Plan, number> = {
  whisper: 1,
  murmur: 2,
  presence: 3,
};

export function planMeetsMinimum(currentPlan: Plan | null | undefined, minimumPlan: Plan) {
  if (!currentPlan) {
    return false;
  }

  return PLAN_ORDER[currentPlan] >= PLAN_ORDER[minimumPlan];
}

export function getPrimaryAppRoute(plan: Plan | null | undefined) {
  if (!plan) {
    return "/?subscription=inactive";
  }

  return planMeetsMinimum(plan, "murmur") ? "/practice" : "/user-dashboard";
}

export function getSignedInRoute(user: { role: Role; plan: Plan | null }) {
  if (user.role === "admin") {
    return "/admin/dashboard";
  }

  return getPrimaryAppRoute(user.plan);
}

export function formatPlanLabel(plan: Plan | null | undefined) {
  if (!plan) {
    return "Unassigned";
  }

  if (plan === "whisper") {
    return "Whisper";
  }

  if (plan === "murmur") {
    return "Murmur";
  }

  return "Presence";
}
