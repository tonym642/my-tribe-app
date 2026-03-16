# My Tribe Context Loader

## Purpose

This file defines the knowledge sources the My Tribe AI system must load when generating responses.

The goal is to ensure consistent behavior across all interaction modes, advisors, and coaching features.

All system intelligence should reference the files listed in this document.

---

# Core System Knowledge

The following documents define the philosophy and structure of the My Tribe system.

Load these files first.

tribe-brain/constitution.md
tribe-brain/guide-setup.md
tribe-brain/advisor-registry.md

These files define:

• the purpose of the system
• the structure of the tribe
• the role of advisors
• advisor names, types, domains, and file paths
• which advisors belong in the main advisor row
• the guide configuration
• the BVM concept
• onboarding principles

---

# Coaching Knowledge

The following files define coaching tools and reflection systems.

coaching/daily-alignment.md

These documents define:

• alignment questions  
• coaching structure  
• personal awareness exercises  

---

# Advisor Definitions

Load all advisor identity files located in:

advisors/

These include:

seth.md  
marcus.md  
emma.md  
hannah.md  
rachel.md  
frank.md  
guide.md  
bvm.md  

These files define:

• advisor personalities  
• communication tone  
• domain expertise  
• identity perspectives  

---

# Prompt Modes

Prompt templates are located in:

prompts/

Load these files when the corresponding interaction mode is activated.

master-system-prompt.md
member-mode.md
guide-mode.md
bvm-mode.md
tribe-mode.md
debate-mode.md
vote-mode.md
parable-mode.md
campfire-mode.md

These prompts define how the system behaves during different interaction modes.

---

# Interaction Modes

The system routes conversations based on the interaction pill selected by the user.

Ask a Member → member-mode  
Ask Your Guide → guide-mode  
Ask BVM → bvm-mode  
Ask My Tribe → tribe-mode  
Show Parable → parable-mode  

Sessions use the following prompts:

Debate → debate-mode  
Voting → vote-mode  
Campfire → parable-mode  

---

# Loading Priority

The system should load knowledge in the following order:

1. tribe-brain/constitution.md
2. tribe-brain/guide-setup.md
3. tribe-brain/advisor-registry.md
4. coaching/daily-alignment.md
5. Advisor definitions from advisors/
6. Prompt mode selected for the interaction

This ensures the AI always operates with the correct philosophy, advisor personalities, and interaction behavior.

---

# Goal

This context loader exists to ensure:

• consistent advisor personalities  
• stable system philosophy  
• predictable prompt behavior  
• scalable architecture as the app grows


# Mode Router

The system must activate the correct prompt mode based on the action selected by the user.

Only ONE mode should control the response at a time.

## Primary Chat Modes

Ask a Member  
→ Load: prompts/member-mode.md  
→ Activate: selected advisor personality

Ask Your Guide  
→ Load: prompts/guide-mode.md  
→ Activate: guide persona

Ask BVM  
→ Load: prompts/bvm-mode.md  
→ Activate: brutal honesty and direct challenge

Ask My Tribe  
→ Load: prompts/tribe-mode.md  
→ Activate: multiple advisors responding

Show Parable  
→ Load: prompts/parable-mode.md  
→ Activate: short story or historical analogy


---

## Session Modes

Sessions run outside normal chat.

Debate  
→ Load: prompts/debate-mode.md  
→ Multiple advisors argue opposing perspectives

Voting  
→ Load: prompts/vote-mode.md  
→ Advisors present positions then vote

Campfire
→ Load: prompts/campfire-mode.md
→ Storytelling experience: one storyteller, one pillar, moderator-led session
→ Story structure: What happened → The struggle → The turning point → The lesson
→ Session formats: Fireside (~5m), Campfire (~10m), Bonfire (~15m)
→ Advisors discuss in right panel; Moderator opens and closes naturally


---

## Coaching Modes

Coaching tools are structured guidance systems.

Lessons  
→ Load lessons content and display according to selected lesson mode

Daily Alignment  
→ Load: coaching/daily-alignment.md

Daily Reflections  
→ Load reflection prompts defined in coaching configuration files


---

## System Rule

The system must:

• load the context-loader  
• determine the active mode  
• activate the correct prompt  
• generate the responseAll AI responses should operate within the context defined by these knowledge sources.