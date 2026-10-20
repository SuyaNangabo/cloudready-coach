import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Track your AZ-900 exam readiness and study streaks." },
      { property: "og:title", content: "Dashboard — AZ-900 Prep Coach" },
      { property: "og:description", content: "Track your AZ-900 exam readiness and study streaks." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-5 text-2xl font-bold">Dashboard</h1>
      <EmptyState title="No activity yet" message="Finish a quiz to see your readiness score and streak here." />
    </section>
  ),
});
