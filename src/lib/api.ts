import { supabase } from "@/integrations/supabase/client";
import type { Difficulty, Question, Topic } from "@/types";
import { topicAccuracy, type TopicStats } from "@/lib/scoring";

/** Short descriptions per topic slug (the topics table has no description column). */
const descriptions: Record<string, string> = {
  "cloud-concepts": "What the cloud is, its benefits, and service types like IaaS, PaaS and SaaS.",
  "azure-architecture-services": "Regions, compute, networking, storage, and identity basics.",
  "management-governance": "Cost management, policies, compliance tools, and monitoring.",
};

const toStrings = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : []);
const four = (v: unknown): [string, string, string, string] => {
  const a = toStrings(v);
  return [a[0] ?? "", a[1] ?? "", a[2] ?? "", a[3] ?? ""];
};

/** exam_weight may be stored as a fraction (0.275) or a percentage (27.5). */
const weightPct = (w: number) => (w <= 1 ? w * 100 : w);

interface TopicRow {
  id: string;
  slug: string;
  name: string;
  exam_weight: number;
}

async function fetchTopicRows(): Promise<TopicRow[]> {
  const { data, error } = await supabase.from("topics").select("id, slug, name, exam_weight").order("name");
  if (error) throw error;
  return (data ?? []).map((t) => ({ ...t, exam_weight: Number(t.exam_weight) }));
}

/** Per-topic stats for the given user; topics with no rows count as 0 attempts. */
export async function fetchTopicStats(userId: string): Promise<(TopicStats & { title: string })[]> {
  const [topics, statsRes] = await Promise.all([
    fetchTopicRows(),
    supabase.from("topic_stats").select("topic_id, attempts, correct").eq("user_id", userId),
  ]);
  if (statsRes.error) throw statsRes.error;
  return topics.map((t) => {
    const row = statsRes.data?.find((s) => s.topic_id === t.id);
    return {
      topicId: t.slug,
      title: t.name,
      attempts: Number(row?.attempts ?? 0),
      correct: Number(row?.correct ?? 0),
      weight: weightPct(t.exam_weight),
    };
  });
}

export async function fetchTopics(userId?: string | null): Promise<Topic[]> {
  const [rows, countsRes, stats] = await Promise.all([
    fetchTopicRows(),
    supabase.from("questions").select("topic_id"),
    userId ? fetchTopicStats(userId) : Promise.resolve(null),
  ]);
  if (countsRes.error) throw countsRes.error;
  return rows.map((t) => {
    const s = stats?.find((x) => x.topicId === t.slug);
    const w = weightPct(t.exam_weight);
    return {
      id: t.slug,
      dbId: t.id,
      title: t.name,
      description: descriptions[t.slug] ?? "",
      questionCount: (countsRes.data ?? []).filter((q) => q.topic_id === t.id).length,
      answeredCount: s?.attempts ?? 0,
      examWeight: `${Math.round(w * 10) / 10}%`,
      weight: w,
      accuracy: s ? topicAccuracy(s.correct, s.attempts) : undefined,
    };
  });
}

/** All questions (optionally for one topic slug), mapped to the app's Question shape. */
export async function fetchQuestions(topicSlug?: string): Promise<Question[]> {
  const topics = await fetchTopicRows();
  const slugById = new Map(topics.map((t) => [t.id, t.slug]));
  let query = supabase
    .from("questions")
    .select("id, topic_id, question, options, correct_index, explanation, option_explanations, key_points, difficulty");
  if (topicSlug) {
    const t = topics.find((x) => x.slug === topicSlug);
    if (!t) return [];
    query = query.eq("topic_id", t.id);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((q) => ({
    id: q.id,
    topicSlug: slugById.get(q.topic_id ?? "") ?? "",
    question: q.question,
    options: four(q.options),
    correctIndex: q.correct_index,
    explanation: q.explanation,
    optionExplanations: four(q.option_explanations),
    keyPoints: toStrings(q.key_points),
    difficulty: (q.difficulty ?? "medium") as Difficulty,
  }));
}

export async function saveAttempt(questionId: string, selectedIndex: number, isCorrect: boolean) {
  const { error } = await supabase
    .from("attempts")
    .insert({ question_id: questionId, selected_index: selectedIndex, is_correct: isCorrect });
  if (error) throw error;
}
