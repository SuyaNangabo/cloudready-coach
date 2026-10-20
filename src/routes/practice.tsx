import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Practice AZ-900 questions with instant explanations." },
      { property: "og:title", content: "Practice — AZ-900 Prep Coach" },
      { property: "og:description", content: "Practice AZ-900 questions with instant explanations." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-5 text-2xl font-bold">Practice</h1>
      <EmptyState title="Quizzes coming soon" message="Practice quizzes with instant explanations will live here." />
    </section>
  ),
});
