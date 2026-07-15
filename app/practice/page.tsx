import { serverApiRequest } from "@/lib/server-backend";
import { requirePracticeFeature } from "@/lib/server-auth";
import type { TodayWord } from "@/lib/types";
import { PracticeDashboardShell } from "../components/practice-dashboard-shell";
import { PracticeTodayPanel } from "./components/practice-today-panel";

export default async function PracticePage() {
  const viewer = await requirePracticeFeature("today-word");
  const todayWord = await serverApiRequest<TodayWord>("/practice/today");

  return (
    <PracticeDashboardShell activeNav="today-word" viewer={viewer}>
      <PracticeTodayPanel initialTodayWord={todayWord} />
    </PracticeDashboardShell>
  );
}
