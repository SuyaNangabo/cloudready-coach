import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { fetchQuestions, saveAttempt } from "@/lib/api";
import type { Question, TopicId } from "@/types";

export type TopicChoice = TopicId | "all";

export interface QuizAnswer {
  question: Question;
  /** Index the user picked, or null if unanswered. */
  picked: number | null;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  /** Consecutive correct answers across the whole session. */
  streak: number;
  started: boolean;
}

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: [],
  streak: 0,
  started: false,
};

// Module-level store so quiz state survives navigation between /quiz and /results.
let state: QuizState = initialState;
const listeners = new Set<() => void>();

function setState(patch: Partial<QuizState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Fisher–Yates shuffle of question order (option order is never changed). */
export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

async function pickQuestions(topic: TopicChoice, count: number): Promise<Question[]> {
  const pool = await fetchQuestions(topic === "all" ? undefined : topic);
  return shuffle(pool).slice(0, count);
}

export function useQuiz() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);

  const current = snapshot.questions[snapshot.currentIndex] ?? null;
  const currentAnswer = snapshot.answers[snapshot.currentIndex] ?? null;
  const correctCount = snapshot.answers.filter((a) => a.picked === a.question.correctIndex).length;
  const isLast = snapshot.currentIndex === snapshot.questions.length - 1;

  return {
    ...snapshot,
    current,
    currentAnswer,
    correctCount,
    isLast,
    total: snapshot.questions.length,
    showStreakBadge: snapshot.streak >= 5,

    /** Loads random questions from the database. Returns how many were loaded. */
    async start(topic: TopicChoice, count: number): Promise<number> {
      const questions = await pickQuestions(topic, count);
      if (questions.length === 0) return 0;
      setState({
        questions,
        currentIndex: 0,
        answers: questions.map((question) => ({ question, picked: null })),
        started: true,
      });
      return questions.length;
    },

    answer(optionIndex: number) {
      const { currentIndex, answers, streak } = state;
      const existing = answers[currentIndex];
      if (!existing || existing.picked !== null) return; // locked after answering
      const correct = optionIndex === existing.question.correctIndex;
      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = { ...existing, picked: optionIndex };
      setState({ answers: nextAnswers, streak: correct ? streak + 1 : 0 });
      saveAttempt(existing.question.id, optionIndex, correct).catch(() => {
        toast.error("We couldn't save that answer. Your quiz will carry on.");
      });
    },

    next() {
      if (state.currentIndex < state.questions.length - 1) {
        setState({ currentIndex: state.currentIndex + 1 });
      }
    },

    /** Start a new round containing only the questions answered incorrectly. */
    retryWrong() {
      const wrong = state.answers.filter((a) => a.picked !== a.question.correctIndex);
      if (wrong.length === 0) return;
      setState({
        questions: wrong.map((a) => a.question),
        currentIndex: 0,
        answers: wrong.map((a) => ({ question: a.question, picked: null })),
        started: true,
      });
    },

    reset() {
      setState({ ...initialState, streak: state.streak });
    },
  };
}
