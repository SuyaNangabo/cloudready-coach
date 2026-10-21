/** Topic slug from the "topics" table, e.g. "cloud-concepts". */
export type TopicId = string;

export interface Topic {
  /** Topic slug (used in URLs and quiz selection). */
  id: TopicId;
  /** Database uuid of the topic. */
  dbId: string;
  title: string;
  description: string;
  questionCount: number;
  answeredCount: number;
  /** Share of the exam, e.g. "27.5%" */
  examWeight: string;
  /** Exam weight as a 0–100 number, used for scoring. */
  weight: number;
  /** Signed-in user's accuracy (0–100) or null when not enough attempts / signed out. */
  accuracy?: number | null;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  topicSlug: TopicId;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  /** Why each option is right or wrong, aligned with `options`. */
  optionExplanations: [string, string, string, string];
  /** Short revision bullets for the cheat sheet and quiz feedback. */
  keyPoints: string[];
  difficulty: Difficulty;
}
