# Question generation prompt

Used with Claude (claude.ai) to draft the 60 practice questions. Every
question was then verified manually against Microsoft Learn before it
was inserted into the database.

## Process

1. Pick a topic and subtopic from the public AZ-900 skills outline.
2. Run the prompt below to draft scenario-based questions as SQL.
3. Check each answer, each wrong-option explanation and each key point
   against Microsoft Learn. Fix or remove anything doubtful.
4. Run the SQL in the Supabase SQL Editor.

## Prompt

```
You are an Azure trainer writing practice questions for the AZ-900
(Microsoft Azure Fundamentals) exam. Use ONLY the public AZ-900 skills
outline on Microsoft Learn as your scope. Write ORIGINAL questions;
never reproduce real exam questions or content from exam dump sites.
Use current service names (for example Microsoft Entra ID).

Topic: [Cloud Concepts | Azure Architecture and Services | Management
and Governance] - focus on: [subtopic]

Write 10 scenario-based, hard multiple-choice questions. Each question
describes a realistic business situation and has four plausible options.
Output ONLY valid PostgreSQL INSERT statements for this table:

questions (topic_id, question, options, correct_index, explanation,
option_explanations, key_points, difficulty)

Rules:
- topic_id = (select id from topics where slug = '[topic-slug]')
- options = a jsonb array of exactly 4 strings
- correct_index = 0 to 3 (0 means the first option); vary the position
- explanation = 2 to 3 plain sentences a beginner can follow
- option_explanations = a jsonb array of 4 strings: why each option is
  right or wrong
- key_points = a jsonb array of 3 to 5 short revision bullets (cheat sheet)
- difficulty = 'easy', 'medium' or 'hard'
- Do not use apostrophes or double quotes inside the text, so the SQL
  runs without escaping errors
```

## Why the prompt is written this way

- Scope is limited to the public skills outline, so content stays
  accurate and original.
- Asking for SQL directly removes a manual conversion step.
- Per-option explanations teach why wrong answers are wrong.
- Key points double as a revision cheat sheet in the app.
- Human verification step: AI drafts, a person checks.
