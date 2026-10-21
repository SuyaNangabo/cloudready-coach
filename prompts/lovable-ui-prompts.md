# Lovable prompts used for the user interface

The three screens were scaffolded with Lovable using mock data first.
Sign in, the Supabase connection and the dashboard data were then wired
up and debugged in VS Code with help from Claude.

## Prompt 1: Foundation and Home page

```
Build the foundation of a web app called "AZ-900 Prep Coach (Unofficial)".
Purpose: help beginners prepare for the Microsoft Azure Fundamentals
(AZ-900) exam with practice quizzes, instant explanations, and a
readiness tracker. Show this footer on every page: "Unofficial community
study tool. Not affiliated with or endorsed by Microsoft." Do not use any
Microsoft logos.

Audience: first-time cloud learners in Africa, mostly on phones.
Mobile-first, lightweight, fast.

Design: clean, friendly, modern. Deep navy for headers and dark surfaces,
electric blue as the primary colour, warm amber as the accent. Rounded
cards, soft shadows, Inter font, light and dark mode toggle.

Build now: a top navigation bar, a Home page with a hero and three topic
cards (Cloud Concepts, Azure Architecture and Services, Management and
Governance) with progress bars, and a footer. Tech: TypeScript, Tailwind,
shadcn/ui, lucide-react. Use typed mock data. No backend yet. Include
loading and empty states.
```

## Prompt 2: Practice, Quiz and Results

```
Add the Practice flow using mock data only: a topic and question-count
picker, a quiz page showing one question at a time with a progress bar,
four options and keyboard shortcuts 1-4, instant feedback with an
explanation and why each other option is wrong, a streak badge with
light confetti after 5 correct answers in a row, and a results page with
the score, a per-question review and a "Retry wrong questions" button.
Keep quiz state in a custom hook.
```

## Prompt 3: Dashboard

```
Add a Dashboard page using mock data: a readiness gauge with a label
(below 60 "Keep studying", 60 to 75 "Almost there", 75 and above "Exam
ready"), a card per topic with accuracy and attempts (shown only after 5
answers), a "Study this next" card for the weakest topic, and a bar
chart of accuracy by topic. Put the scoring maths in src/lib/scoring.ts
as pure, typed functions. Readiness = sum of (exam weight x topic
accuracy) divided by the sum of the weights of topics with enough data.
```
