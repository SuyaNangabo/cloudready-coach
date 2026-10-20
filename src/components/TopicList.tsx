import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/data/mock";
import { EmptyState } from "./EmptyState";
import { TopicCard, TopicCardSkeleton } from "./TopicCard";

export function TopicList() {
  const { data, isLoading } = useQuery({ queryKey: ["topics"], queryFn: () => fetchTopics() });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <TopicCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <EmptyState title="No topics yet" message="Study topics will appear here once they're added." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((t) => <TopicCard key={t.id} topic={t} />)}
    </div>
  );
}
