import { useEffect, useSyncExternalStore } from "react";
import { questions as mockQuestions } from "@/data/mock";
import { supabase } from "@/integrations/supabase/client";
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
  /** Questions loaded from Supabase (empty until loaded). */
  bank: Question[];
  bankStatus: "idle" | "loading" | "ready" | "error";
}

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: [],
  streak: 0,
  started: false,
  bank: [],
  bankStatus: "idle",
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

// ---------- Loading questions from Supabase ----------

interface QuestionRow {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  option_explanations: string[] | null;
  key_points: string[] | null;
  difficulty: string | null;
  topics: { slug: string } | { slug: string }[] | null;
}

function toQuestion(row: QuestionRow): Question {
  const topic = Array.isArray(row.topics) ? row.topics[0] : row.topics;
  const topicSlug = (topic?.slug ?? "") as TopicId;
  return {
    id: row.id,
    topicSlug,
    question: row.question,
    options: row.options as Question["options"],
    correctIndex: row.correct_index,
    explanation: row.explanation,
    optionExplanations: (row.option_explanations ?? []) as Question["optionExplanations"],
    keyPoints: row.key_points ?? [],
    difficulty: (row.difficulty ?? "medium") as Question["difficulty"],
  };
}

let loadPromise: Promise<void> | null = null;

/** Loads all questions once and keeps them in memory. */
export function loadQuestionBank(): Promise<void> {
  if (state.bankStatus === "ready") return Promise.resolve();
  if (loadPromise) return loadPromise;
  setState({ bankStatus: "loading" });
  loadPromise = (async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, question, options, correct_index, explanation, option_explanations, key_points, difficulty, topics(slug)",
      );
    if (error || !data || data.length === 0) {
      console.error("Could not load questions from Supabase", error);
      setState({ bankStatus: "error" });
      loadPromise = null;
      return;
    }
    setState({ bank: (data as unknown as QuestionRow[]).map(toQuestion), bankStatus: "ready" });
  })();
  return loadPromise;
}

// ---------- Saving answers ----------

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function saveAttempt(questionId: string, selectedIndex: number, isCorrect: boolean) {
  if (!UUID.test(questionId)) return; // mock questions are not in the database
  const { data } = await supabase.auth.getSession();
  if (!data.session) return; // only signed-in users have their answers saved
  const { error } = await supabase
    .from("attempts")
    .insert({ question_id: questionId, selected_index: selectedIndex, is_correct: isCorrect });
  if (error) console.error("Could not save answer", error);
}

// ---------- Quiz logic ----------

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions(topic: TopicChoice, count: number): Question[] {
  const source = state.bank.length > 0 ? state.bank : mockQuestions;
  const pool = topic === "all" ? source : source.filter((q) => q.topicSlug === topic);
  return shuffle(pool).slice(0, count);
}

export function useQuiz() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );

  useEffect(() => {
    void loadQuestionBank();
  }, []);

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
      void saveAttempt(existing.question.id, optionIndex, correct);
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
      setState({ questions: [], currentIndex: 0, answers: [], started: false });
    },
  };
}
