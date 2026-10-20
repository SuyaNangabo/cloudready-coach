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
