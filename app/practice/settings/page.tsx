import { serverApiRequest } from "@/lib/server-backend";
import { requirePracticeFeature } from "@/lib/server-auth";
import type { SettingsPayload } from "@/lib/types";
import { PracticeDashboardShell } from "../../components/practice-dashboard-shell";
import { SettingsPanel } from "../components/settings-panel";

export default async function SettingsPage() {
  const viewer = await requirePracticeFeature("settings");
  const settings = await serverApiRequest<SettingsPayload>("/settings");

  return (
    <PracticeDashboardShell activeNav="settings" viewer={viewer}>
      <SettingsPanel initialSettings={settings} />
    </PracticeDashboardShell>
  );
}
