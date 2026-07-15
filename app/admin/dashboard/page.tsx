import Link from "next/link";
import { serverApiRequest } from "@/lib/server-backend";
import { requireAdminUser } from "@/lib/server-auth";
import type {
  AdminStressFinderCatalogPayload,
  AdminSubscriptionPlansPayload,
  AdminUsersPayload,
} from "@/lib/types";
import { AdminShell } from "../../components/admin-shell";

const recentActivity = [
  {
    name: "Priya Sharma",
    event: "Upgraded to Presence plan",
    time: "2 hours ago",
  },
  {
    name: "Rahul Verma",
    event: "Completed 30-day streak",
    time: "5 hours ago",
  },
  {
    name: "Ananya Gupta",
    event: "New sign up - Murmur plan",
    time: "1 day ago",
  },
  {
    name: "Arjun Patel",
    event: "Practiced TOGETHER word",
    time: "1 day ago",
  },
] as const;

function UsersIcon() {
  return (
    <svg aria-hidden="true" className="admin-dashboard-metric-icon" viewBox="0 0 20 20">
      <circle cx="7" cy="7" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13.5" cy="6.6" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.9 14.9a3.5 3.5 0 0 1 6.2-2.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M11.1 13.9a2.8 2.8 0 0 1 4.2-1.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg aria-hidden="true" className="admin-dashboard-metric-icon" viewBox="0 0 20 20">
      <path
        d="M4 15.4V8.6M8.6 15.4V4.8M13.2 15.4V10.3M16 15.4H3.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const viewer = await requireAdminUser();
  const [{ pagination }, { entries }, { plans }] = await Promise.all([
    serverApiRequest<AdminUsersPayload>("/admin/users?page=1&limit=1"),
    serverApiRequest<AdminStressFinderCatalogPayload>("/admin/stress-finder"),
    serverApiRequest<AdminSubscriptionPlansPayload>("/admin/subscription-plans"),
  ]);
  const adminMetrics = [
    {
      label: "Total Users",
      value: pagination.totalItems.toLocaleString("en-US"),
      detail: "Open full user directory",
      icon: "users",
      href: "/admin/users",
    },
    {
      label: "Stress Finder Entries",
      value: entries.length.toLocaleString("en-US"),
      detail: "Manage homepage prompt cards",
      icon: "bars",
      href: "/admin/stress-finder",
    },
    {
      label: "Subscription Plans",
      value: plans.length.toLocaleString("en-US"),
      detail: "Manage pricing and checkout copy",
      icon: "bars",
      href: "/admin/subscriptions",
    },
    {
      label: "Active Subscriptions",
      value: "892",
      detail: "71% conversion rate",
      icon: "bars",
    },
    {
      label: "Monthly Revenue",
      value: "Rs 4.2L",
      detail: "+8% from last month",
      icon: "bars",
    },
  ] as const;

  return (
    <AdminShell active="dashboard" viewer={viewer}>
      <section className="admin-dashboard-section" aria-labelledby="admin-dashboard-title">
        <div className="admin-dashboard-shell">
          <div className="admin-dashboard-header">
            <div>
              <h1 id="admin-dashboard-title">Admin Dashboard</h1>
              <p className="admin-dashboard-subtitle">{viewer.email}</p>
            </div>
          </div>

          <section className="admin-dashboard-metrics" aria-label="Admin metrics">
            {adminMetrics.map((metric) => {
              const cardContent = (
                <>
                  <div className="admin-dashboard-metric-header">
                    <p>{metric.label}</p>
                    {metric.icon === "users" ? <UsersIcon /> : <BarsIcon />}
                  </div>
                  <strong>{metric.value}</strong>
                  <span>{metric.detail}</span>
                </>
              );

              return "href" in metric ? (
                <Link
                  className="admin-dashboard-metric-card admin-dashboard-metric-card-link"
                  href={metric.href}
                  key={metric.label}
                >
                  {cardContent}
                </Link>
              ) : (
                <article className="admin-dashboard-metric-card" key={metric.label}>
                  {cardContent}
                </article>
              );
            })}
          </section>

          <section className="admin-dashboard-activity-card" aria-labelledby="recent-activity-title">
            <h2 id="recent-activity-title">Recent User Activity</h2>

            <div className="admin-dashboard-activity-list">
              {recentActivity.map((activity, index) => (
                <article
                  className={`admin-dashboard-activity-row${index < recentActivity.length - 1 ? " admin-dashboard-activity-row-bordered" : ""}`}
                  key={`${activity.name}-${activity.time}`}
                >
                  <div className="admin-dashboard-activity-copy">
                    <h3>{activity.name}</h3>
                    <p>{activity.event}</p>
                  </div>
                  <span className="admin-dashboard-activity-time">{activity.time}</span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
