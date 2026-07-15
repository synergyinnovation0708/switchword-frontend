import Link from "next/link";
import { formatPlanLabel } from "@/lib/plan-utils";
import { serverApiRequest } from "@/lib/server-backend";
import { requireAdminUser } from "@/lib/server-auth";
import type { AdminUsersPayload, PublicUser } from "@/lib/types";
import { AdminShell } from "../../components/admin-shell";

const PAGE_SIZE = 10;

function parsePageNumber(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function formatStatusLabel(status: PublicUser["accountStatus"]) {
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatDateLabel(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatDeliveryLabel(deliveryPrefs: PublicUser["deliveryPrefs"]) {
  if (deliveryPrefs.emailEnabled && deliveryPrefs.whatsappEnabled) {
    return "Email + WhatsApp";
  }

  if (deliveryPrefs.emailEnabled) {
    return "Email only";
  }

  if (deliveryPrefs.whatsappEnabled) {
    return "WhatsApp only";
  }

  return "Disabled";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - halfWindow);
  let end = Math.min(totalPages, start + windowSize - 1);

  start = Math.max(1, end - windowSize + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getPageHref(page: number) {
  return page <= 1 ? "/admin/users" : `/admin/users?page=${page}`;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const viewer = await requireAdminUser();
  const { page: rawPage } = await searchParams;
  const requestedPage = parsePageNumber(rawPage);
  const { users, pagination } = await serverApiRequest<AdminUsersPayload>(
    `/admin/users?page=${requestedPage}&limit=${PAGE_SIZE}`,
  );
  const rangeStart = users.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeEnd = users.length === 0 ? 0 : rangeStart + users.length - 1;
  const visiblePages = getVisiblePages(pagination.page, pagination.totalPages);

  return (
    <AdminShell active="users" viewer={viewer}>
      <section className="admin-users-section" aria-labelledby="admin-users-title">
        <div className="admin-users-shell">
          <div className="admin-users-header">
            <div>
              <h1 id="admin-users-title">User Directory</h1>
              <p className="admin-users-subtitle">
                Showing {rangeStart}-{rangeEnd} of {pagination.totalItems.toLocaleString("en-US")}{" "}
                registered users
              </p>
            </div>
          </div>

          <section className="admin-users-table-card" aria-labelledby="admin-users-table-title">
            <div className="admin-users-table-header">
              <div>
                <p className="admin-users-kicker">Members</p>
                <h2 id="admin-users-table-title">All user details</h2>
              </div>
              <span className="admin-users-page-chip">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>

            <div className="admin-users-table-wrap">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Plan</th>
                    <th scope="col">Status</th>
                    <th scope="col">Delivery</th>
                    <th scope="col">Time Zone</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td className="admin-users-empty" colSpan={7}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-users-primary-cell">
                            <strong>{user.fullName}</strong>
                            <span>DOB: {user.dateOfBirth}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-users-primary-cell">
                            <strong>{user.email}</strong>
                            <span>{user.phone}</span>
                          </div>
                        </td>
                        <td>{formatPlanLabel(user.plan)}</td>
                        <td>
                          <span className="admin-users-status-badge">
                            {formatStatusLabel(user.accountStatus)}
                          </span>
                        </td>
                        <td>{formatDeliveryLabel(user.deliveryPrefs)}</td>
                        <td>{user.timeZone}</td>
                        <td>{formatDateLabel(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-users-pagination">
              {pagination.hasPreviousPage ? (
                <Link
                  className="admin-users-pagination-button"
                  href={getPageHref(pagination.page - 1)}
                >
                  Previous
                </Link>
              ) : (
                <span className="admin-users-pagination-button admin-users-pagination-button-disabled">
                  Previous
                </span>
              )}

              <div className="admin-users-pagination-pages" aria-label="User list pages">
                {visiblePages.map((page) => (
                  <Link
                    aria-current={page === pagination.page ? "page" : undefined}
                    className={`admin-users-pagination-number${page === pagination.page ? " admin-users-pagination-number-active" : ""}`}
                    href={getPageHref(page)}
                    key={page}
                  >
                    {page}
                  </Link>
                ))}
              </div>

              {pagination.hasNextPage ? (
                <Link
                  className="admin-users-pagination-button"
                  href={getPageHref(pagination.page + 1)}
                >
                  Next
                </Link>
              ) : (
                <span className="admin-users-pagination-button admin-users-pagination-button-disabled">
                  Next
                </span>
              )}
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
