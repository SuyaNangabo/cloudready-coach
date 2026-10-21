import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Cloud, Layers, Server, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { fetchTopics } from "@/lib/api";
import { useQuiz, type TopicChoice } from "@/hooks/useQuiz";
import { cn } from "@/lib/utils";
import type { TopicId } from "@/types";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Pick a topic and question count, then practise AZ-900 questions with instant explanations." },
      { property: "og:title", content: "Practice — AZ-900 Prep Coach" },
      { property: "og:description", content: "Pick a topic and practise AZ-900 questions with instant explanations." },
    ],
  }),
  component: PracticeSetup,
});

const topicIcons: Record<TopicId, typeof Cloud> = {
  "cloud-concepts": Cloud,
  "azure-architecture-services": Server,
  "management-governance": ShieldCheck,
};

const counts = [5, 10, 20] as const;

function PracticeSetup() {
  const navigate = useNavigate();
  const quiz = useQuiz();
  const [topic, setTopic] = useState<TopicChoice>("all");
  const [count, setCount] = useState<number>(10);
  const [starting, setStarting] = useState(false);
  const { data: topics = [] } = useQuery({ queryKey: ["topics", "list"], queryFn: () => fetchTopics() });

  const startQuiz = async () => {
    setStarting(true);
    try {
      const n = await quiz.start(topic, count);
      if (n === 0) toast.error("No questions found for this topic yet.");
      else void navigate({ to: "/quiz" });
    } catch {
      toast.error("We couldn't load questions. Check your connection and try again.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Practice</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a topic and how many questions you want.</p>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Pick a topic</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <TopicOption
          active={topic === "all"}
          onClick={() => setTopic("all")}
          icon={<Layers className="h-5 w-5" />}
          title="All topics"
          description="A mix from every part of the exam."
        />
        {topics.map((t) => {
          const Icon = topicIcons[t.id] ?? BookOpen;
          return (
            <TopicOption
              key={t.id}
              active={topic === t.id}
              onClick={() => setTopic(t.id)}
              icon={<Icon className="h-5 w-5" />}
              title={t.title}
              description={t.description}
            />
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">2. How many questions?</h2>
      <div className="flex gap-2">
        {counts.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCount(c)}
            className={cn(
              "flex-1 rounded-xl border px-4 py-3 text-center font-semibold transition sm:flex-none sm:px-8",
              count === c
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-primary/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Button size="lg" className="mt-8 w-full rounded-full sm:w-auto" onClick={() => void startQuiz()} disabled={starting}>
        {starting && <Loader2 className="h-4 w-4 animate-spin" />} Start quiz
      </Button>
    </section>
  );
}

function TopicOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition",
        active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50",
      )}
    >
      <span className={cn("rounded-xl p-2", active ? "bg-primary text-primary-foreground" : "bg-accent text-primary")}>
        {icon}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}
