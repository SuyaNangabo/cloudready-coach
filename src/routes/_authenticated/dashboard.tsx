import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchTopicStats } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useQuiz } from "@/hooks/useQuiz";
import { readinessLabel, readinessScore, topicAccuracy, weakestTopic, type TopicStats } from "@/lib/scoring";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Track your AZ-900 exam readiness, topic accuracy and what to study next." },
      { property: "og:title", content: "Dashboard — AZ-900 Prep Coach" },
      { property: "og:description", content: "Track your AZ-900 exam readiness, topic accuracy and what to study next." },
    ],
  }),
  component: DashboardPage,
});


function DashboardPage() {
  const navigate = useNavigate();
  const quiz = useQuiz();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["topic-stats", user?.id],
    queryFn: () => fetchTopicStats(user!.id),
    enabled: !!user,
  });
  const titles = new Map((data ?? []).map((s) => [s.topicId, s.title]));
  const topicTitle = (id: TopicStats["topicId"]) => titles.get(id) ?? id;

  if (isLoading || !user) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-5 text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </section>
    );
  }

  const stats = data ?? [];
  const hasAnyAttempts = stats.some((s) => s.attempts > 0);

  if (!hasAnyAttempts) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-5 text-2xl font-bold">Dashboard</h1>
        <EmptyState
          title="No activity yet"
          message="Finish a quiz to see your readiness score and topic breakdown here."
          action={
            <Button className="rounded-full" onClick={() => void navigate({ to: "/practice" })}>
              Start practising
            </Button>
          }
        />
      </section>
    );
  }

  const readiness = readinessScore(stats);
  const weakest = weakestTopic(stats);
  const chartData = stats.map((s) => ({
    name: topicTitle(s.topicId).replace(" & ", " & "),
    accuracy: topicAccuracy(s.correct, s.attempts) ?? 0,
  }));

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-5 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Readiness gauge */}
        <div className="flex flex-col items-center rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="self-start text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overall readiness</h2>
          {readiness === null ? (
            <p className="my-auto text-center text-sm text-muted-foreground">
              Answer at least 5 questions in a topic to see your readiness.
            </p>
          ) : (
            <>
              <ReadinessRing value={readiness} />
              <span
                className={
                  readiness >= 75
                    ? "rounded-full bg-green-600/10 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400"
                    : readiness >= 60
                      ? "rounded-full bg-highlight/15 px-3 py-1 text-sm font-semibold text-highlight"
                      : "rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"
                }
              >
                {readinessLabel(readiness)}
              </span>
            </>
          )}
        </div>

        {/* Study this next */}
        {weakest && (
          <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Study this next</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-xl bg-highlight/15 p-2.5 text-highlight"><Target className="h-5 w-5" /></span>
              <div>
                <p className="font-semibold">{topicTitle(weakest.topicId)}</p>
                <p className="text-sm text-muted-foreground">
                  {topicAccuracy(weakest.correct, weakest.attempts) !== null
                    ? `Your weakest topic at ${topicAccuracy(weakest.correct, weakest.attempts)}% accuracy.`
                    : `Only ${weakest.attempts} question${weakest.attempts === 1 ? "" : "s"} answered so far.`}
                </p>
              </div>
            </div>
            <Button
              className="mt-auto w-full rounded-full pt-0 sm:w-auto"
              onClick={() => {
                quiz.start(weakest.topicId, 10);
                void navigate({ to: "/quiz" });
              }}
            >
              Practise this topic <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Accuracy chart */}
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:row-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Accuracy by topic</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} className="text-xs" />
                <YAxis type="category" dataKey="name" width={110} className="text-xs" tick={{ fill: "currentColor" }} />
                <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
                <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} className="fill-primary" opacity={entry.accuracy === 0 ? 0.25 : 1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic cards */}
        {stats.map((s) => {
          const accuracy = topicAccuracy(s.correct, s.attempts);
          return (
            <div key={s.topicId} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{topicTitle(s.topicId)}</h3>
                <span className="text-sm text-muted-foreground">{s.attempts} attempt{s.attempts === 1 ? "" : "s"}</span>
              </div>
              {accuracy === null ? (
                <p className="text-sm text-muted-foreground">Answer at least 5 questions to see your score.</p>
              ) : (
                <>
                  <p className="text-3xl font-bold text-primary">{accuracy}%</p>
                  <Progress value={accuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground">{s.correct} of {s.attempts} correct</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Semicircle gauge showing readiness 0–100. */
function ReadinessRing({ value }: { value: number }) {
  const r = 80;
  const circumference = Math.PI * r; // half circle
  const filled = (value / 100) * circumference;
  return (
    <div className="relative my-4">
      <svg width="200" height="110" viewBox="0 0 200 110">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" className="stroke-muted" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          className="stroke-primary transition-all duration-700"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-x-0 bottom-0 text-center text-4xl font-bold">{value}%</span>
    </div>
  );
}
