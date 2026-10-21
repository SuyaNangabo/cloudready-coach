import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, Home, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/hooks/useQuiz";
import { percent } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "Results — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "See your AZ-900 practice quiz score and review every answer." },
      { property: "og:title", content: "Results — AZ-900 Prep Coach" },
      { property: "og:description", content: "See your AZ-900 practice quiz score and review every answer." },
    ],
  }),
  component: ResultsPage,
});

function encouragement(pct: number): string {
  if (pct >= 80) return "Excellent work — you're nearly exam-ready. Keep this up!";
  if (pct >= 60) return "Solid progress! A little more practice and you'll be there.";
  if (pct >= 40) return "Good effort. Review the explanations and try again — you'll improve fast.";
  return "Everyone starts somewhere. Read the explanations and give it another go!";
}

function ResultsPage() {
  const navigate = useNavigate();
  const quiz = useQuiz();
  const { started, answers, correctCount, total } = quiz;

  useEffect(() => {
    if (!started) void navigate({ to: "/practice", replace: true });
  }, [started, navigate]);

  if (!started || total === 0) return null;

  const pct = percent(correctCount, total);
  const wrongCount = total - correctCount;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border bg-card p-8 text-center shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Your score</p>
        <p className="mt-2 text-6xl font-bold text-primary sm:text-7xl">
          {correctCount}<span className="text-3xl text-muted-foreground">/{total}</span>
        </p>
        <p className="mt-1 text-2xl font-semibold">{pct}%</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{encouragement(pct)}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {wrongCount > 0 && (
            <Button
              className="rounded-full"
              onClick={() => {
                quiz.retryWrong();
                void navigate({ to: "/quiz" });
              }}
            >
              <RotateCcw className="h-4 w-4" /> Retry wrong questions ({wrongCount})
            </Button>
          )}
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/" onClick={() => quiz.reset()}>
              <Home className="h-4 w-4" /> Back to home
            </Link>
          </Button>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Review your answers</h2>
      <ul className="space-y-3">
        {answers.map((a, i) => {
          const correct = a.picked === a.question.correctIndex;
          return (
            <li key={`${a.question.id}-${i}`} className="flex gap-3 rounded-2xl border bg-card p-4">
              {correct ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              )}
              <div className="min-w-0">
                <p className="font-medium leading-snug">{a.question.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {correct ? (
                    <>Your answer: {a.question.options[a.picked ?? 0]}</>
                  ) : (
                    <>
                      You picked: {a.question.options[a.picked ?? 0]} · Correct:{" "}
                      {a.question.options[a.question.correctIndex]}
                    </>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
