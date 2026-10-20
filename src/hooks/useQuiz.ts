import { useSyncExternalStore } from "react";
import { questions as allQuestions } from "@/data/mock";
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

function pickQuestions(topic: TopicChoice, count: number): Question[] {
  const pool = topic === "all" ? allQuestions : allQuestions.filter((q) => q.topicSlug === topic);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // Repeat the pool if the user asks for more questions than exist in the mock data.
  const result: Question[] = [];
  while (result.length < count && shuffled.length > 0) {
    result.push(...shuffled);
  }
  return result.slice(0, count);
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

    start(topic: TopicChoice, count: number) {
      const questions = pickQuestions(topic, count);
      setState({
        questions,
        currentIndex: 0,
        answers: questions.map((question) => ({ question, picked: null })),
        started: true,
      });
    },

    answer(optionIndex: number) {
      const { currentIndex, answers, streak } = state;
      const existing = answers[currentIndex];
      if (!existing || existing.picked !== null) return; // locked after answering
      const correct = optionIndex === existing.question.correctIndex;
      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = { ...existing, picked: optionIndex };
      setState({ answers: nextAnswers, streak: correct ? streak + 1 : 0 });
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
