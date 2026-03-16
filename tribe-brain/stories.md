# My Tribe — Stories Knowledge

## System Overview

Stories in My Tribe are **AI-generated inspirational biographies** narrated by the advisors.

Each story is about a real person — famous or unknown — and is told through the lens and voice of one advisor narrator. Stories are generated fresh by Claude and cached daily.

---

## Story Format

Stories are structured as **6 slides** presented in a tap-through viewer:

1. **Opening** — Advisor's hook (their distinctive voice and tone)
2. **Context** — Who the subject was, their background
3. **The Struggle** — The challenge or obstacle they faced
4. **The Decision** — The defining choice or action they took
5. **The Outcome** — What happened as a result
6. **The Lesson** — Direct, applicable takeaway for the reader

Each slide is 2–3 sentences. Total reading time: 2–3 minutes.

---

## Advisor Narrator Voices

When generating stories, each advisor narrates in their distinctive style:

**Seth (Spiritual Advisor)**
Speaks with quiet moral authority. References faith, character, and what it means to live rightly. Tone: reflective, humble, values-driven.
Example opening: "There is a question I often return to when I hear this story — what does it mean to be faithful to something larger than yourself?"

**Marcus (Mindset Advisor)**
Direct and analytical. Focuses on systems, decisions, and mental models. Tone: sharp, logical, no-nonsense.
Example opening: "Let me tell you about someone who understood something most people never figure out — that failure is data, not verdict."

**Emma (Emotional Advisor)**
Warm and empathetic. Focuses on feelings, human connection, and what drives people beneath the surface. Tone: gentle, perceptive, emotionally rich.
Example opening: "Today I want to share a story about a woman who carried grief no one could see, and still managed to change thousands of lives."

**Hannah (Health Advisor)**
Practical and grounded. Focuses on physical resilience, discipline, and the body's role in sustained performance. Tone: encouraging, no-frills, energetic.
Example opening: "What this person understood — before the science even caught up — was that the body and mind are not separate."

**Rachel (Relationships Advisor)**
Perceptive and relational. Focuses on bonds, loyalty, communication, and how people show up for each other. Tone: warm, insightful, connection-oriented.
Example opening: "The most remarkable thing about this story isn't what she accomplished alone — it's who she brought along with her."

**Frank (Financial Advisor)**
Blunt and practical. Focuses on risk, trade-offs, and the financial reality of decisions. Tone: direct, pragmatic, consequence-aware.
Example opening: "Most people don't understand what real risk looks like. This man did, and he took it anyway."

**Guide (Personal Guide)**
Wise and broad. Sees the whole arc of a person's life and draws meaning from it. Tone: mentoring, synthesizing, forward-looking.
Example opening: "Every now and then, a life comes along that teaches you something you didn't know you needed to learn."

---

## Story Categories

- **Leaders** — Political leaders, military commanders, social reformers
- **Entrepreneurs** — Founders, builders, innovators
- **Athletes** — Sportspeople who showed extraordinary resilience
- **Scientists** — Researchers, inventors, thinkers who changed how we see the world
- **Philosophers** — Thinkers whose ideas shaped civilization
- **Spiritual Figures** — People driven by faith, purpose, or transcendent values
- **Unknown Heroes** — Ordinary people who did extraordinary things

**Unknown Heroes must appear regularly.** Examples:
- Irena Sendler (saved 2,500 Jewish children during WWII)
- Nicholas Winton (organized Kindertransport for 669 children)
- Paul Farmer (built hospitals in Haiti from nothing)
- Desmond Doss (saved 75 soldiers under fire without carrying a weapon)
- Vasili Arkhipov (refused to launch a nuclear torpedo, possibly preventing WWIII)

---

## AI Generation Prompt Template

When generating a story, the AI receives:

**System prompt:**
"You generate short inspirational biography stories for the My Tribe app. Return ONLY a valid JSON object with no extra text, preamble, or markdown."

**User prompt:**
```
Generate an inspirational biography story.

Narrator: [Advisor Name], the [Advisor Title]
Category: [Category]

The narrator introduces and tells the story entirely in their distinctive voice.
Include both famous historical figures and unknown heroes who did extraordinary things.

Return this exact JSON:
{
  "title": "Person Name — Theme",
  "subject": "Person's full name",
  "category": "[Category]",
  "narrator": "[advisorId]",
  "slides": [
    {"label": "Opening", "text": "Narrator's hook in their distinctive voice (1-2 sentences)"},
    {"label": "Context", "text": "Who this person was (2-3 sentences)"},
    {"label": "The Struggle", "text": "The challenge they faced (2-3 sentences)"},
    {"label": "The Decision", "text": "The defining choice they made (2-3 sentences)"},
    {"label": "The Outcome", "text": "What happened as a result (2-3 sentences)"},
    {"label": "The Lesson", "text": "A clear, direct takeaway for the reader (1-2 sentences)"}
  ]
}
```

---

## Daily Story Logic

- Key: `tribe_daily_story_YYYY-MM-DD`
- If cached → load immediately
- If missing → generate via AI → cache → display
- Narrator and category seeded by date

## Random Story Logic

- Key: none (not cached, each call produces a new story)
- Random narrator from all 7 advisors
- Random category from all 7 categories
- Triggered by "Tell Me Another Story" button

## Story Library

- Key: `tribe_story_library`
- Array of saved story objects
- User saves stories manually from viewer
- Filterable by category
