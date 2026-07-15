import { serverApiRequest } from "@/lib/server-backend";
import { requireAdminUser } from "@/lib/server-auth";
import type { AdminSubscriptionPlansPayload } from "@/lib/types";
import { AdminShell } from "../../components/admin-shell";
import { SubscriptionPlansAdminManager } from "./subscription-plans-admin-manager";

export default async function AdminSubscriptionsPage() {
  const viewer = await requireAdminUser();
  const { plans } =
    await serverApiRequest<AdminSubscriptionPlansPayload>("/admin/subscription-plans");

  return (
    <AdminShell active="subscriptions" viewer={viewer}>
      <section className="admin-stress-section" aria-labelledby="admin-subscriptions-title">
        <div className="admin-stress-shell">
          <div className="admin-stress-header">
            <div>
              <h1 id="admin-subscriptions-title">Subscription Plans</h1>
              <p className="admin-stress-subtitle">
                Manage the pricing cards, checkout summaries, and plan messaging shown on the
                public subscription pages.
              </p>
            </div>

            <span className="admin-users-page-chip">
              {plans.length.toLocaleString("en-US")} live plans
            </span>
          </div>

          <SubscriptionPlansAdminManager initialPlans={plans} />
        </div>
      </section>
    </AdminShell>
  );
}
