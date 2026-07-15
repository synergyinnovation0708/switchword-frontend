import { redirect } from "next/navigation";
import { BackendError } from "./backend";
import { getSignedInRoute } from "./plan-utils";
import type { Plan, PracticeFeature, PublicUser, SubscriptionPlansPayload } from "./types";
import { planMeetsMinimum } from "./plan-utils";
import { serverApiRequest } from "./server-backend";
import { getSubscriptionPlanDefaults } from "../app/pricing/plans";

type MeResponse = {
  user: PublicUser;
};

function getResolvedPracticeFeatures(plan: Plan | null | undefined, practiceFeatures?: PracticeFeature[]) {
  if (practiceFeatures && practiceFeatures.length > 0) {
    return practiceFeatures;
  }

  if (!plan) {
    return [];
  }

  return getSubscriptionPlanDefaults(plan)?.practiceFeatures ?? [];
}

export async function getOptionalAuthenticatedUser() {
  try {
    const payload = await serverApiRequest<MeResponse>("/auth/me");

    if (!payload?.user) {
      return null;
    }

    return payload.user;
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function redirectAuthenticatedUserHome() {
  const user = await getOptionalAuthenticatedUser();

  if (user) {
    redirect(getSignedInRoute(user));
  }
}

export async function redirectAdminUserHome() {
  const user = await getOptionalAuthenticatedUser();

  if (user?.role === "admin") {
    redirect("/admin/dashboard");
  }
}

export async function requireAuthenticatedUser() {
  const user = await getOptionalAuthenticatedUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}

export async function requireMinimumPlan(minimumPlan: Plan) {
  const user = await requireAuthenticatedUser();

  if (!planMeetsMinimum(user.plan, minimumPlan)) {
    redirect("/pricing");
  }

  return user;
}

export async function getPlanConfig(plan: Plan | null | undefined) {
  if (!plan) {
    return null;
  }

  const payload = await serverApiRequest<SubscriptionPlansPayload>("/subscriptions/plans");
  return payload.plans.find((entry) => entry.slug === plan) ?? null;
}

export async function requirePracticeFeature(feature: PracticeFeature) {
  const user = await requireAuthenticatedUser();
  const planConfig = await getPlanConfig(user.plan);
  const resolvedPracticeFeatures = getResolvedPracticeFeatures(
    planConfig?.slug ?? user.plan,
    planConfig?.practiceFeatures,
  );

  if (!planConfig || !resolvedPracticeFeatures.includes(feature)) {
    redirect("/pricing");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();

  if (user.role !== "admin") {
    redirect(getSignedInRoute(user));
  }

  return user;
}
