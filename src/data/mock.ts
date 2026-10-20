import type { Question, Topic } from "@/types";

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

export const questions: Question[] = [
  {
    id: "cc-1",
    topicSlug: "cloud-concepts",
    question: "Which cloud service model gives you ready-to-use software over the internet, such as email or a CRM app?",
    options: [
      "Infrastructure as a Service (IaaS)",
      "Platform as a Service (PaaS)",
      "Software as a Service (SaaS)",
      "Functions as a Service (FaaS)",
    ],
    correctIndex: 2,
    explanation:
      "SaaS delivers complete, ready-to-use applications over the internet. You simply sign in and use the software — the provider manages everything underneath, from servers to the app itself.",
    optionExplanations: [
      "IaaS rents raw infrastructure like virtual machines and networks — you still manage the operating system and apps.",
      "PaaS gives developers a platform to build and deploy apps, but you still write and manage the application code.",
      "Correct — SaaS is finished software you use directly, like Microsoft 365 or Gmail.",
      "FaaS (serverless) runs small pieces of your own code on demand — it is not a ready-made application.",
    ],
    difficulty: "easy",
  },
  {
    id: "cc-2",
    topicSlug: "cloud-concepts",
    question: "What is the main financial difference between the CapEx and OpEx spending models in cloud computing?",
    options: [
      "CapEx is pay-as-you-go; OpEx is a large upfront purchase",
      "CapEx is a large upfront purchase; OpEx is pay-as-you-go",
      "CapEx only applies to software licences; OpEx only to hardware",
      "There is no difference — they are two names for the same model",
    ],
    correctIndex: 1,
    explanation:
      "Capital expenditure (CapEx) means buying hardware upfront and owning it. Operational expenditure (OpEx) means paying for services as you use them — the cloud's pay-as-you-go model, which lowers the entry cost for small teams.",
    optionExplanations: [
      "This is the wrong way round — pay-as-you-go describes OpEx, not CapEx.",
      "Correct — CapEx is upfront spending on owned equipment; OpEx is ongoing pay-as-you-go spending.",
      "Both models can cover hardware or software; the difference is when and how you pay, not what you buy.",
      "They are distinct models: one is upfront ownership, the other is ongoing consumption-based payment.",
    ],
    difficulty: "medium",
  },
  {
    id: "as-1",
    topicSlug: "architecture-services",
    question: "What is an Azure region?",
    options: [
      "A single data centre building in one city",
      "A set of data centres deployed within a defined geographic area",
      "A billing boundary for your subscription",
      "A folder that groups your resources together",
    ],
    correctIndex: 1,
    explanation:
      "An Azure region is a geographic area (like West Europe or South Africa North) containing one or more data centres connected by a low-latency network. Choosing a region near your users reduces latency and can help meet data-residency rules.",
    optionExplanations: [
      "A region usually contains multiple data centres, not just one building.",
      "Correct — a region is a geographic area with one or more networked data centres.",
      "Billing is handled by subscriptions, not regions.",
      "That describes a resource group, which organises resources logically.",
    ],
    difficulty: "easy",
  },
  {
    id: "as-2",
    topicSlug: "architecture-services",
    question: "Which Azure service should you use to sign in users and manage their identities and access?",
    options: [
      "Azure Blob Storage",
      "Microsoft Entra ID",
      "Azure Virtual Network",
      "Azure Monitor",
    ],
    correctIndex: 1,
    explanation:
      "Microsoft Entra ID (formerly Azure Active Directory) is Azure's cloud identity service. It handles sign-ins, single sign-on, multi-factor authentication, and controlling who can access which resources.",
    optionExplanations: [
      "Blob Storage stores files and unstructured data — it does not manage user identities.",
      "Correct — Entra ID is Azure's identity and access management service.",
      "Virtual Network connects resources privately; it handles networking, not user sign-in.",
      "Azure Monitor collects logs and metrics about your resources — it watches, it doesn't authenticate.",
    ],
    difficulty: "medium",
  },
  {
    id: "mg-1",
    topicSlug: "management-governance",
    question: "Which Azure tool lets you estimate the cost of services before you deploy them?",
    options: [
      "Azure Advisor",
      "The Pricing calculator",
      "Azure Policy",
      "Microsoft Defender for Cloud",
    ],
    correctIndex: 1,
    explanation:
      "The Azure Pricing calculator is a free web tool where you pick services and configurations to estimate monthly costs before spending anything. It helps learners and small businesses plan budgets with confidence.",
    optionExplanations: [
      "Azure Advisor recommends improvements for resources you already run — it doesn't estimate future deployments.",
      "Correct — the Pricing calculator estimates costs for services you haven't deployed yet.",
      "Azure Policy enforces rules on resources (like allowed regions), not cost estimates.",
      "Defender for Cloud is a security tool; it assesses threats, not prices.",
    ],
    difficulty: "easy",
  },
  {
    id: "mg-2",
    topicSlug: "management-governance",
    question: "What does Azure Policy help you do?",
    options: [
      "Detect viruses on virtual machines",
      "Enforce rules so resources stay compliant, such as allowing only certain regions",
      "Back up your databases automatically",
      "Increase the speed of your network",
    ],
    correctIndex: 1,
    explanation:
      "Azure Policy creates and enforces rules across your resources — for example, only allowing deployments in specific regions or requiring tags. It keeps your environment compliant with company or regulatory standards automatically.",
    optionExplanations: [
      "Threat and virus detection is the job of Microsoft Defender for Cloud, not Azure Policy.",
      "Correct — Azure Policy enforces governance rules and audits compliance across resources.",
      "Backups are handled by Azure Backup; Policy can require backups but doesn't perform them.",
      "Policy governs configuration and compliance — it has no effect on network speed.",
    ],
    difficulty: "medium",
  },
];
