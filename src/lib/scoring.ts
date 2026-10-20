import type { TopicId } from "@/types";

export const MIN_ATTEMPTS = 5;

export interface TopicStats {
  topicId: TopicId;
  correct: number;
  attempts: number;
  /** Numeric exam weight, e.g. 27.5 for "25–30%". */
  weight: number;
}

/** Accuracy as a 0–100 percentage. Returns null until the topic has enough attempts. */
export function topicAccuracy(correct: number, attempts: number): number | null {
  if (attempts < MIN_ATTEMPTS || attempts <= 0) return null;
  return Math.min(100, Math.round((correct / attempts) * 100));
}

/**
 * Overall readiness 0–100: weighted average of topic accuracies,
 * using only topics with at least MIN_ATTEMPTS attempts.
 * Returns null when no topic has enough data yet.
 */
export function readinessScore(topics: TopicStats[]): number | null {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const t of topics) {
    const accuracy = topicAccuracy(t.correct, t.attempts);
    if (accuracy === null) continue;
    weightedSum += t.weight * accuracy;
    weightTotal += t.weight;
  }
  if (weightTotal === 0) return null;
  return Math.round(weightedSum / weightTotal);
}

export function readinessLabel(score: number): string {
  if (score < 60) return "Keep studying";
  if (score < 75) return "Almost there";
  return "Exam ready";
}

/** The topic with the lowest accuracy among those with enough attempts; otherwise the least-attempted topic. */
export function weakestTopic(topics: TopicStats[]): TopicStats | null {
  if (topics.length === 0) return null;
  const scored = topics
    .map((t) => ({ t, accuracy: topicAccuracy(t.correct, t.attempts) }))
    .filter((x): x is { t: TopicStats; accuracy: number } => x.accuracy !== null);
  if (scored.length > 0) {
    return scored.reduce((a, b) => (a.accuracy <= b.accuracy ? a : b)).t;
  }
  return [...topics].sort((a, b) => a.attempts - b.attempts)[0];
}
