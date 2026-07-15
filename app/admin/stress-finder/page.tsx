import { serverApiRequest } from "@/lib/server-backend";
import { requireAdminUser } from "@/lib/server-auth";
import type { AdminStressFinderCatalogPayload } from "@/lib/types";
import { AdminShell } from "../../components/admin-shell";
import { StressFinderAdminManager } from "./stress-finder-admin-manager";

export default async function AdminStressFinderPage() {
  const viewer = await requireAdminUser();
  const { entries } =
    await serverApiRequest<AdminStressFinderCatalogPayload>("/admin/stress-finder");

  return (
    <AdminShell active="stress-finder" viewer={viewer}>
      <section className="admin-stress-section" aria-labelledby="admin-stress-title">
        <div className="admin-stress-shell">
          <div className="admin-stress-header">
            <div>
              <h1 id="admin-stress-title">Stress Finder Manager</h1>
              <p className="admin-stress-subtitle">
                Update the homepage &quot;Choose a word&quot; concerns, switchwords, and support
                copy.
              </p>
            </div>

            <span className="admin-users-page-chip">
              {entries.length.toLocaleString("en-US")} live entries
            </span>
          </div>

          <StressFinderAdminManager initialEntries={entries} />
        </div>
      </section>
    </AdminShell>
  );
}
