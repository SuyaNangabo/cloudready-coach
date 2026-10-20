import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, Flame, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "@/components/Confetti";
import { useQuiz } from "@/hooks/useQuiz";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — AZ-900 Prep Coach (Unofficial)" },
      { name: "description", content: "Answer AZ-900 practice questions one at a time with instant feedback." },
      { property: "og:title", content: "Quiz — AZ-900 Prep Coach" },
      { property: "og:description", content: "Answer AZ-900 practice questions with instant feedback." },
    ],
  }),
  component: QuizPage,
});

const LETTERS = ["A", "B", "C", "D"] as const;

function QuizPage() {
  const navigate = useNavigate();
  const quiz = useQuiz();
  const { current, currentAnswer, currentIndex, total, isLast, started } = quiz;
  const answered = currentAnswer?.picked !== null && currentAnswer?.picked !== undefined;

  // Keyboard shortcuts: 1-4 select an answer, Enter advances.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        quiz.answer(Number(e.key) - 1);
      } else if (e.key === "Enter" && answered) {
        if (isLast) void navigate({ to: "/results" });
        else quiz.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, answered, isLast, currentIndex, quiz, navigate]);

  // No active quiz (e.g. direct visit or refresh) — send back to setup.
  useEffect(() => {
    if (!started) void navigate({ to: "/practice", replace: true });
  }, [started, navigate]);

  if (!started || !current) return null;

  const progressValue = Math.round(((currentIndex + (answered ? 1 : 0)) / total) * 100);
  const isCorrect = answered && currentAnswer.picked === current.correctIndex;

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      {quiz.showStreakBadge && <Confetti />}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Question {currentIndex + 1} of {total}</span>
          {quiz.showStreakBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-highlight/15 px-2.5 py-0.5 text-xs font-semibold text-highlight">
              <Flame className="h-3.5 w-3.5" /> {quiz.streak} in a row!
            </span>
          )}
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <h1 className="text-xl font-semibold leading-snug sm:text-2xl">{current.question}</h1>

      <div className="mt-6 grid gap-3">
        {current.options.map((option, i) => {
          const isPicked = currentAnswer?.picked === i;
          const isCorrectOption = i === current.correctIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => quiz.answer(i)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition",
                !answered && "hover:border-primary/60 hover:bg-accent/50",
                answered && isCorrectOption && "border-green-600 bg-green-600/10",
                answered && isPicked && !isCorrectOption && "border-red-600 bg-red-600/10",
                answered && !isPicked && !isCorrectOption && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  answered && isCorrectOption && "border-green-600 bg-green-600 text-white",
                  answered && isPicked && !isCorrectOption && "border-red-600 bg-red-600 text-white",
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1">{option}</span>
              {answered && isCorrectOption && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />}
              {answered && isPicked && !isCorrectOption && <XCircle className="h-5 w-5 shrink-0 text-red-600" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={cn(
            "mt-6 rounded-2xl border p-5",
            isCorrect ? "border-green-600/40 bg-green-600/5" : "border-red-600/40 bg-red-600/5",
          )}
        >
          <p className={cn("flex items-center gap-2 font-semibold", isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
            {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{current.explanation}</p>
          <ul className="mt-4 space-y-2">
            {current.options.map((option, i) => {
              if (i === current.correctIndex) return null;
              return (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{LETTERS[i]}.</span>
                  <span>{current.optionExplanations[i]}</span>
                </li>
              );
            })}
          </ul>
          <Button
            className="mt-5 w-full rounded-full sm:w-auto"
            onClick={() => (isLast ? void navigate({ to: "/results" }) : quiz.next())}
          >
            {isLast ? "See results" : "Next"}
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tip: press 1–4 to answer, Enter for the next question.
      </p>
    </section>
  );
}
