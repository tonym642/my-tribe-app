// ── Help System ────────────────────────────────────────────────────────────
// Maps feature keys to markdown file paths (relative to ui/)
// Add new features here as they are built.

const HELP_MAP = {
  'advice':            '../help/advice.md',
  'book-lessons':      '../help/book-lessons.md',
  'campfire':          '../help/campfire.md',
  'core-lessons':      '../help/core-lessons.md',
  'debate':            '../help/debate.md',
  'life-stories':      '../help/life-stories.md',
  'polls':             '../help/polls.md',
  'spiritual-lessons': '../help/spiritual-lessons.md',
};

// Returns rendered HTML string for a feature key, or null on failure.
async function loadHelpContent(key) {
  const path = HELP_MAP[key];
  if (!path) return null;
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const raw = await res.text();
    if (!raw || !raw.trim()) return null;
    marked.use({ breaks: true, gfm: true });
    return marked.parse(raw);
  } catch {
    return null;
  }
}

// Renders help content into a container element.
async function renderHelpContent(key, containerEl) {
  if (!containerEl) return;
  containerEl.innerHTML = '<p class="help-loading">Loading…</p>';
  const html = await loadHelpContent(key);
  if (!html) {
    containerEl.innerHTML = '<p class="help-unavailable">Help content not available.</p>';
    return;
  }
  containerEl.innerHTML = html;
}

// Returns the help key for the currently visible feature page,
// by reading data-help-key from the first visible page element.
// Useful when a single Help button needs to know which page is active.
function getActiveHelpKey() {
  const pages = document.querySelectorAll('[data-help-key]');
  for (const el of pages) {
    if (el.style.display !== 'none' && !el.classList.contains('hidden')) {
      return el.dataset.helpKey;
    }
  }
  return null;
}
