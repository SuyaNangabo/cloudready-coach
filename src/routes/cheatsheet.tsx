import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { topics, questions } from "@/data/mock";

export const Route = createFileRoute("/cheatsheet")({
  head: () => ({
    meta: [
      { title: "Cheat sheet — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Browse every key point from the practice questions, grouped by AZ-900 topic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Cheat sheet — AZ-900 Prep Coach" },
      { property: "og:description", content: "Every key point from the practice questions, grouped by topic." },
    ],
  }),
  component: CheatSheetPage,
});

interface KeyPointEntry {
  point: string;
  question: string;
}

function CheatSheetPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return topics
      .map((topic) => {
        const entries: KeyPointEntry[] = questions
          .filter((question) => question.topicSlug === topic.id)
          .flatMap((question) => question.keyPoints.map((point) => ({ point, question: question.question })))
          .filter(
            (entry) =>
              !q || entry.point.toLowerCase().includes(q) || entry.question.toLowerCase().includes(q),
          );
        return { topic, entries };
      })
      .filter((group) => group.entries.length > 0);
  }, [q]);

  const total = groups.reduce((sum, g) => sum + g.entries.length, 0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">Cheat sheet</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every key point from the practice questions, grouped by topic — a quick revision list before the exam.
      </p>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search key points…"
          aria-label="Search key points"
          className="rounded-full pl-9"
        />
      </div>

      {groups.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No matches"
            message={`Nothing matches “${query.trim()}”. Try a shorter word, like “region” or “policy”.`}
          />
        </div>
      ) : (
        <>
          <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
            {total} key point{total === 1 ? "" : "s"}
          </p>
          <div className="mt-2 grid gap-4">
            {groups.map(({ topic, entries }) => (
              <article key={topic.id} className="rounded-2xl border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">{topic.title}</h2>
                  <Badge variant="secondary">{topic.examWeight} of the exam</Badge>
                </div>
                <ul className="mt-3 space-y-2">
                  {entries.map((entry, i) => (
                    <li key={`${topic.id}-${i}`} className="flex gap-2 text-sm leading-relaxed">
                      <span aria-hidden className="mt-0.5 shrink-0 text-highlight">•</span>
                      <span>
                        {entry.point}
                        {q && (
                          <span className="block text-xs text-muted-foreground">From: {entry.question}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
