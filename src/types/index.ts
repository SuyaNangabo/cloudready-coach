export type TopicId = "cloud-concepts" | "architecture-services" | "management-governance";

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  questionCount: number;
  answeredCount: number;
  /** Approximate share of the exam, e.g. "25–30%" */
  examWeight: string;
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
