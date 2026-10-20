import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicList } from "@/components/TopicList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AZ-900 Prep Coach (Unofficial) — Practise for Azure Fundamentals" },
      { name: "description", content: "Free practice quizzes, instant explanations and a readiness tracker for the AZ-900 exam." },
      { property: "og:title", content: "AZ-900 Prep Coach (Unofficial)" },
      { property: "og:description", content: "Practice quizzes and a readiness tracker for first-time cloud learners." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="bg-hero text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight/20 px-3 py-1 text-xs font-medium text-highlight">
            <Flame className="h-3.5 w-3.5" /> Built for first-time cloud learners
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">Pass Azure Fundamentals with confidence.</h1>
          <p className="mt-3 max-w-md opacity-80">Short quizzes, clear explanations, and a tracker that shows when you're ready.</p>
          <Button asChild size="lg" className="mt-7 rounded-full">
            <Link to="/practice">Start practising <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-5 text-xl font-semibold">Exam topics</h2>
        <TopicList />
      </section>
    </>
  );
}
