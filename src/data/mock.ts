import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    id: "cloud-concepts",
    title: "Cloud Concepts",
    description: "What the cloud is, its benefits, and service types like IaaS, PaaS and SaaS.",
    questionCount: 60,
    answeredCount: 38,
    examWeight: "25–30%",
  },
  {
    id: "architecture-services",
    title: "Azure Architecture & Services",
    description: "Regions, compute, networking, storage, and identity basics.",
    questionCount: 90,
    answeredCount: 21,
    examWeight: "35–40%",
  },
  {
    id: "management-governance",
    title: "Management & Governance",
    description: "Cost management, policies, compliance tools, and monitoring.",
    questionCount: 70,
    answeredCount: 0,
    examWeight: "30–35%",
  },
];

/** Simulates a network fetch so loading states can be seen. */
export function fetchTopics(delayMs = 600): Promise<Topic[]> {
  return new Promise((resolve) => setTimeout(() => resolve(topics), delayMs));
}
