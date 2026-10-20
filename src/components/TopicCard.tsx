import { BookOpen, Cloud, Server, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { percent } from "@/lib/progress";
import type { Topic, TopicId } from "@/types";

const icons: Record<TopicId, typeof Cloud> = {
  "cloud-concepts": Cloud,
  "architecture-services": Server,
  "management-governance": ShieldCheck,
};

export function TopicCard({ topic }: { topic: Topic }) {
  const Icon = icons[topic.id] ?? BookOpen;
  const pct = percent(topic.answeredCount, topic.questionCount);
  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl bg-accent p-2.5 text-primary"><Icon className="h-5 w-5" /></div>
        <span className="rounded-full bg-highlight/15 px-2.5 py-0.5 text-xs font-medium text-highlight">{topic.examWeight} of exam</span>
      </div>
      <div>
        <h3 className="font-semibold">{topic.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{topic.questionCount} questions</span>
          <span>{pct === 0 ? "Not started" : `${pct}% done`}</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
    </article>
  );
}

export function TopicCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
