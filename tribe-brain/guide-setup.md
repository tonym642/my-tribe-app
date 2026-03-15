# Guide Setup

This file defines configuration for the Guide, BVM, and avatar generation.

---

## Guide Configuration

The Guide is the user's personal mentor — a custom-defined voice that speaks from a broader life perspective, not limited to a single pillar domain.

**What to configure:**
- **Guide Name / Identity**: Who the Guide represents (e.g., "My future self", "A Stoic mentor", "My father", "Marcus Aurelius").
- **Tone & Style**: The Guide inherits the wisdom, temperament, and values of the chosen persona.
- **Scope**: The Guide addresses the whole person — decisions, direction, character, and life.

**Where it is stored:**
- `localStorage` key: `tribe_guide_name`
- Configurable via Settings → Advisors

---

## BVM Profile Configuration

BVM (Best Version of Me) is not an external advisor. It is the user's ideal self — disciplined, principled, and clear.

**What to configure:**
- **Identity Statement**: How the user defines their best self (e.g., "A disciplined entrepreneur", "A present father", "Someone who leads with integrity").
- **Standards**: The non-negotiables the best version lives by.
- **Tone**: Direct, calm, identity-anchored. No motivational language. No softening.

**Behavioral contract:**
- BVM does not beg, reassure, or explain.
- BVM speaks from identity: *"What does the person I am becoming do?"*
- BVM answers are short, clear, and action-oriented.

**Where it is stored:**
- `localStorage` key: `tribe_bvm_identity` (future)
- Configurable via Settings → Profile (future)

---

## Avatar Generation from Selfie

Users can personalize their Guide avatar by uploading a selfie or reference image.

**Planned flow:**
1. User uploads a selfie from Settings → Profile.
2. The image is processed to generate a stylized avatar (illustration or portrait style).
3. The generated avatar replaces the default Guide avatar in the advisor chip row.

**Notes:**
- Avatar files are stored in `assets/avatars/`.
- Default fallback: `assets/avatars/guide.png`
- This feature requires image generation integration (future implementation).
