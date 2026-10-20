# CloudReady Coach

Build the foundation of a web app called "AZ-900 Prep Coach (Unofficial)".

Purpose: help beginners prepare for the Microsoft Azure Fundamentals

(AZ-900) exam with practice quizzes, instant explanations, and a

readiness tracker. Show this footer on every page: "Unofficial community

study tool. Not affiliated with or endorsed by Microsoft." Do not use any

Microsoft logos.

Audience: first-time cloud learners in Africa, mostly on phones.

Mobile-first, lightweight, fast.

Design: clean, friendly, modern. Deep navy (#0B1F3A) for headers and

dark surfaces, electric blue (#2563EB) as the primary colour, warm amber

(#F59E0B) as the accent for highlights and streaks. Rounded-2xl cards,

soft shadows, Inter font, generous spacing. Include a light/dark mode

toggle.

Build now:

- A top navigation bar: logo text, links (Home, Practice, Dashboard),

  theme toggle, and a Sign in button (not functional yet).

- A Home page with a hero (headline, one-line subtitle, "Start

  practising" button) and three topic cards: "Cloud Concepts", "Azure

  Architecture & Services", "Management & Governance". Each card shows a

  short description, a question count, and a progress bar (use mock data).

- A footer with the disclaimer.

Tech: TypeScript, Tailwind, shadcn/ui, lucide-react icons. Organise code

into components/, pages (or routes, whichever fits the project), lib/,

types/. Put mock data in src/data/mock.ts. No backend yet. Include

loading and empty states.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e39524ad-0028-4994-8610-ffee9022b684).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
