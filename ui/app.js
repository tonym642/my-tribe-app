// ================================================================
// MY TRIBE — app.js
// ================================================================

const API_URL = '/api/claude';
const MODEL   = 'claude-sonnet-4-6';

// ── Advisor definitions ──────────────────────────────────────────

const ADVISORS = {
  seth: {
    id: 'seth',
    name: 'Seth',
    title: 'Spiritual Advisor',
    desc: 'Faith, values & moral character',
    initial: 'S',
    color: '#7C3AED',
    system: `You are Seth, the Spiritual Advisor in the My Tribe app.

Your role is to help people evaluate decisions through the lens of faith, moral principles, humility, empathy, and character. You focus on alignment with deeper values, integrity, and becoming a good person rather than simply achieving external success.

Speak calmly, thoughtfully, and with quiet wisdom. Your tone is reflective, not forceful. You invite the user to pause and consider what truly matters. You often ask whether a decision reflects good character, whether ego may be influencing the choice, and whether the user is treating others as they would want to be treated.

Keep your response to 3–5 sentences. Stay in character.`
  },

  marcus: {
    id: 'marcus',
    name: 'Marcus',
    title: 'Mindset Advisor',
    desc: 'Strategic thinking, mental models & clarity',
    initial: 'M',
    color: '#2563EB',
    system: `You are Marcus, the Mindset Advisor in the My Tribe app.

Your role is to help people think with greater clarity, reason more strategically, and develop the mental discipline to make strong decisions and break limiting patterns. You operate from logic, structure, and intellectual rigor — not emotion or spirituality.

Speak analytically and directly. Stay calm and structured. Identify the thinking pattern at play, offer a cleaner frame, and help the user reason through the situation step by step. Avoid spiritual or emotional language — you are the thinking advisor.

Keep your response to 3–5 sentences. Stay in character.`
  },

  emma: {
    id: 'emma',
    name: 'Emma',
    title: 'Emotional Advisor',
    desc: 'Feelings, needs & emotional patterns',
    initial: 'E',
    color: '#DB2777',
    system: `You are Emma, the Emotional Advisor in the My Tribe app.

Your role is to help people understand the emotional forces driving their thoughts, behaviors, and decisions. You focus on feelings, unmet needs, fears, emotional patterns, and what lies beneath the surface of a situation.

Speak gently, empathetically, and with emotional awareness. Be compassionate and reflective. Help the user acknowledge what they are actually feeling. You often ask which human needs are at play, whether fear is distorting perception, and whether past experiences are influencing current reactions.

Keep your response to 3–5 sentences. Stay in character.`
  },

  hannah: {
    id: 'hannah',
    name: 'Hannah',
    title: 'Health Advisor',
    desc: 'Energy, sleep & physical wellbeing',
    initial: 'H',
    color: '#059669',
    system: `You are Hannah, the Health Advisor in the My Tribe app.

Your role is to help people maintain energy, resilience, and long-term wellbeing through healthy physical habits. You focus on sleep, nutrition, movement, rest, and the physical foundation that supports clear thinking, emotional stability, and sustained performance.

Speak calmly and practically. Be supportive and grounded. Focus on simple, realistic habits that improve energy and resilience. You often consider whether fatigue or poor physical habits may be affecting how the user is seeing a situation.

Keep your response to 3–5 sentences. Stay in character.`
  },

  rachel: {
    id: 'rachel',
    name: 'Rachel',
    title: 'Relationships Advisor',
    desc: 'Bonds, communication & connection',
    initial: 'R',
    color: '#D97706',
    system: `You are Rachel, the Relationships Advisor in the My Tribe app.

Your role is to help people understand the quality of their relationships and how they affect decisions. You focus on friendships, romantic relationships, family dynamics, boundaries, communication styles, love languages, and the role of loneliness or connection in behavior.

Speak warmly, perceptively, and with emotional intelligence. Focus on empathy and understanding the perspectives of others. You often ask whether the people around the user are helping them grow, whether boundaries are clear, and what the other person might be feeling.

Keep your response to 3–5 sentences. Stay in character.`
  },

  frank: {
    id: 'frank',
    name: 'Frank',
    title: 'Financial Advisor',
    desc: 'Money, risk & long-term wealth',
    initial: 'F',
    color: '#4F46E5',
    system: `You are Frank, the Financial Advisor in the My Tribe app.

Your role is to help people make smart financial decisions and think clearly about the monetary implications of their choices. You focus on budgeting, investing, financial planning, risk, and building long-term wealth and security.

Speak practically, clearly, and with financial insight. Be direct about trade-offs, numbers, and consequences. You often consider whether a decision makes financial sense in the short and long term, and whether the user is thinking clearly about money.

Keep your response to 3–5 sentences. Stay in character.`
  },

  guide: {
    id: 'guide',
    name: 'Guide',
    title: 'Your Personal Guide',
    desc: 'Your chosen mentor or future self',
    initial: 'G',
    color: '#0D9488',
    system: null // built dynamically from guideName
  },

  bvm: {
    id: 'bvm',
    name: 'BVM',
    title: 'Best Version of Me',
    desc: 'Your ideal self speaking',
    initial: 'B',
    color: '#0EA5E9',
    system: `You are BVM — the Best Version of Me. You are not an external advisor. You represent the user's ideal self: disciplined, principled, responsible, and clear.

Speak as the user's strongest inner voice. Be direct, calm, and identity-focused. Do not motivate, reassure, or explain at length — state what the best version of this person would do.

Response format:
1. Reference the user's identity or standard.
2. Highlight the decision or situation.
3. State what the best version would do.

Keep responses short and clear. Never beg, soften standards, offer excuses, or speak like an outside advisor. The user makes the final call — you only reflect who they are becoming.`
  }
};

// Tribe advisors (excluding Guide)
const TRIBE = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];

// Placeholder text per mode
const MODE_PLACEHOLDERS = {
  tribe:   'Ask your tribe something...',
  guide:   'Ask your guide...',
  bvm:     'Ask your best self...',
  member:  'Ask your selected advisors...',
  parable: 'Ask for a parable about...'
};

// ── Mode → prompt file routing ───────────────────────────────────

const MODE_TO_PROMPT = {
  member:  'member-mode',
  guide:   'guide-mode',
  bvm:     'bvm-mode',
  tribe:   'tribe-mode',
  parable: 'parable-mode',
  debate:  'debate-mode',
  voting:  'vote-mode',
  campfire:'parable-mode'
};

// ── Knowledge store ───────────────────────────────────────────────

const knowledge = {
  contextLoader:   null,
  constitution:    null,
  guideSetup:      null,
  advisorRegistry: null,
  dailyAlignment:  null,
  bookLessons:     null,
  stories:         null,
  about:           null,
  advisors:        {},
  prompts:         {}
};

const ADVISOR_FILES = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank', 'guide', 'bvm'];
const PROMPT_FILES  = ['master-system-prompt', 'member-mode', 'guide-mode', 'bvm-mode',
                       'tribe-mode', 'debate-mode', 'vote-mode', 'parable-mode'];

async function fetchText(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function loadKnowledge() {
  [knowledge.contextLoader, knowledge.constitution, knowledge.guideSetup,
   knowledge.advisorRegistry, knowledge.dailyAlignment, knowledge.bookLessons,
   knowledge.about, knowledge.stories] = await Promise.all([
    fetchText('../tribe-brain/context-loader.md'),
    fetchText('../tribe-brain/constitution.md'),
    fetchText('../tribe-brain/guide-setup.md'),
    fetchText('../tribe-brain/advisor-registry.md'),
    fetchText('../coaching/daily-alignment.md'),
    fetchText('../coaching/book-lessons.md'),
    fetchText('../tribe-brain/about.md'),
    fetchText('../tribe-brain/stories.md')
  ]);

  await Promise.all([
    ...ADVISOR_FILES.map(async id => {
      knowledge.advisors[id] = await fetchText(`../advisors/${id}.md`);
    }),
    ...PROMPT_FILES.map(async id => {
      knowledge.prompts[id] = await fetchText(`../prompts/${id}.md`);
    })
  ]);

  applyDailyAlignmentConfig();
  initStories();
}

function buildSystemPrompt(advisor) {
  const parts = [];

  // 1. Core knowledge layer — always included
  if (knowledge.contextLoader)   parts.push(knowledge.contextLoader);
  if (knowledge.constitution)    parts.push(knowledge.constitution);
  if (knowledge.guideSetup)      parts.push(knowledge.guideSetup);
  if (knowledge.advisorRegistry) parts.push(knowledge.advisorRegistry);

  // 2. Mode-specific prompt
  const promptKey  = MODE_TO_PROMPT[state.mode] || 'master-system-prompt';
  const modePrompt = knowledge.prompts[promptKey] || knowledge.prompts['master-system-prompt'];
  if (modePrompt) parts.push(modePrompt);

  // 3. Advisor definition
  if (advisor.id === 'guide') {
    const name     = state.guideName;
    const guideDef = knowledge.advisors['guide'];
    if (guideDef) {
      parts.push(guideDef);
      parts.push(`The user has configured their Guide to represent: ${name}. Speak from the perspective of ${name} with their wisdom, tone, values, and experience. Keep responses to 3–5 sentences. Stay in character as ${name}.`);
    } else {
      // fallback to hard-coded
      parts.push(`You are the Guide, a personal advisor in the My Tribe app. You represent ${name}. Speak from their perspective with their wisdom, tone, values, and experience. Keep responses to 3–5 sentences. Stay in character as ${name}.`);
    }
  } else {
    const advisorDef = knowledge.advisors[advisor.id];
    if (advisorDef) {
      parts.push(advisorDef);
    } else if (advisor.system) {
      // fallback to hard-coded system prompt
      parts.push(advisor.system);
    }
  }

  // Book context — injected when continuing from a Book Lesson
  if (state.bookContext) {
    parts.push(`The user has been studying the book: "${state.bookContext}". The conversation may reference ideas, principles, or lessons from this book. Respond with that context in mind.`);
  }

  return parts.filter(Boolean).join('\n\n---\n\n');
}

// ── State ────────────────────────────────────────────────────────

const state = {
  mode: 'member',
  selectedAdvisors: new Set(TRIBE),
  isLoading: false,
  stopped: false,
  currentConvId: null,
  bookContext: null,   // set when continuing from a Book Lesson
  lastSpeakers: [],    // tracks who last responded for mention routing
  streamController: null
  get guideName() { return localStorage.getItem('tribe_guide_name') || 'a wise mentor and trusted advisor'; },
  set guideName(v){ localStorage.setItem('tribe_guide_name', v); }
};

// ── DOM refs ─────────────────────────────────────────────────────

let $stream, $inner, $input, $sendBtn, $welcome;

// ── Init ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await loadKnowledge();
  $stream  = document.getElementById('stream');
  $inner   = document.getElementById('messages-container');
  $input   = document.getElementById('input-field');
  $sendBtn = document.getElementById('send-btn');
  $welcome = document.getElementById('welcome');

  // Input
  $input.addEventListener('input', onInputChange);
  $input.addEventListener('keydown', onKeydown);
  $input.addEventListener('blur', () => setTimeout(hideMentionDropdown, 150));
  $sendBtn.addEventListener('click', () => state.isLoading ? handleStop() : handleSend());

  // Mention autocomplete dropdown
  document.getElementById('mention-dropdown').addEventListener('mousedown', e => {
    const item = e.target.closest('.mention-item');
    if (!item) return;
    e.preventDefault();
    insertMention(item.dataset.name);
  });

  // Mode pills
  document.querySelectorAll('.mode-pill').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  // Advisor chips + tooltips
  const $tooltip = document.createElement('div');
  $tooltip.id = 'advisor-tooltip';
  document.body.appendChild($tooltip);

  document.querySelectorAll('.advisor-chip').forEach(btn => {
    btn.addEventListener('click', () => toggleAdvisor(btn.dataset.advisor));

    btn.addEventListener('mouseenter', () => {
      const a = ADVISORS[btn.dataset.advisor];
      if (!a) return;
      $tooltip.innerHTML = `<span class="tt-title">${a.title}</span><span class="tt-desc">${a.desc}</span>`;
      $tooltip.classList.add('visible');
      const r = btn.getBoundingClientRect();
      const tw = $tooltip.offsetWidth;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      $tooltip.style.left = left + 'px';
      $tooltip.style.top  = (r.top - $tooltip.offsetHeight - 8 + window.scrollY) + 'px';
    });

    btn.addEventListener('mouseleave', () => $tooltip.classList.remove('visible'));
  });

  // Mode pill tooltips (BVM and any future pills with data-tip-* attributes)
  document.querySelectorAll('.mode-pill[data-tip-title]').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      $tooltip.innerHTML = `<span class="tt-title">${btn.dataset.tipTitle}</span><span class="tt-desc">${btn.dataset.tipDesc}</span>`;
      $tooltip.classList.add('visible');
      const r = btn.getBoundingClientRect();
      const tw = $tooltip.offsetWidth;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      $tooltip.style.left = left + 'px';
      $tooltip.style.top  = (r.top - $tooltip.offsetHeight - 8 + window.scrollY) + 'px';
    });
    btn.addEventListener('mouseleave', () => $tooltip.classList.remove('visible'));
  });

  // Onboarding guide pills
  document.getElementById('btn-guide-chat').addEventListener('click', () => openGuide('chat-guide-overlay'));
  document.getElementById('btn-guide-sessions').addEventListener('click', () => openGuide('sessions-guide-overlay'));
  document.getElementById('btn-guide-stories').addEventListener('click', () => openGuide('stories-guide-overlay'));
  document.getElementById('chat-guide-close').addEventListener('click', () => closeGuide('chat-guide-overlay'));
  document.getElementById('sessions-guide-close').addEventListener('click', () => closeGuide('sessions-guide-overlay'));
  document.getElementById('stories-guide-close').addEventListener('click', () => closeGuide('stories-guide-overlay'));
  ['chat-guide-overlay','sessions-guide-overlay','stories-guide-overlay'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => { if (e.target.id === id) closeGuide(id); });
  });

  // Conversations — New Chat
  ['btn-new-chat', 'm-btn-new-chat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { closeMobileNav(); startNewChat(); });
  });

  // Conversations — Chat History
  ['btn-chat-history', 'm-btn-chat-history'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { closeMobileNav(); openHistoryPanel(); });
  });

  // History panel close
  document.getElementById('history-close').addEventListener('click', closeHistoryPanel);
  document.getElementById('history-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeHistoryPanel();
  });

  // Coaching — Daily Alignment
  ['btn-daily-alignment', 'm-btn-daily-alignment'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { closeMobileNav(); openDailyAlignment(); });
  });

  // Daily Alignment modal wiring
  document.getElementById('daily-close').addEventListener('click', closeDailyAlignment);
  document.getElementById('daily-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDailyAlignment();
  });
  document.getElementById('align-save-btn').addEventListener('click', saveDailyAlignment);
  document.getElementById('align-goal-add').addEventListener('click', addAlignGoal);
  document.getElementById('align-goal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addAlignGoal();
  });

  // Navigation — coming soon items (desktop + mobile)
  const comingSoon = [
    'btn-core-lessons',
    'btn-profile', 'btn-onboarding', 'btn-advisors',
    'btn-reflections-settings',
    'm-btn-core-lessons',
    'm-btn-profile', 'm-btn-onboarding', 'm-btn-advisors',
    'm-btn-reflections-settings'
  ];
  comingSoon.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { closeMobileNav(); showNotice('Coming soon.'); });
  });

  // Debate — nav buttons (desktop + mobile)
  document.getElementById('btn-debate').addEventListener('click', openDebate);
  document.getElementById('m-btn-debate').addEventListener('click', () => { closeMobileNav(); openDebate(); });

  // Debate — modal controls
  document.getElementById('debate-close').addEventListener('click', closeDebate);
  document.getElementById('debate-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDebate();
  });
  document.getElementById('debate-start-btn').addEventListener('click', () => {
    const topic = document.getElementById('debate-topic-input').value.trim();
    if (!topic) { showNotice('Please enter a topic first.'); return; }
    runDebate(topic);
  });
  document.getElementById('debate-topic-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const topic = document.getElementById('debate-topic-input').value.trim();
      if (topic) runDebate(topic);
    }
  });
  document.getElementById('debate-new-btn').addEventListener('click', () => {
    document.getElementById('debate-thread-phase').style.display = 'none';
    document.getElementById('debate-input-phase').style.display = '';
    document.getElementById('debate-topic-input').value = '';
    setTimeout(() => document.getElementById('debate-topic-input').focus(), 50);
  });

  // Campfire — nav buttons (desktop + mobile)
  document.getElementById('btn-campfire').addEventListener('click', openCampfire);
  document.getElementById('m-btn-campfire').addEventListener('click', () => { closeMobileNav(); openCampfire(); });

  // Campfire — modal controls
  document.getElementById('campfire-close').addEventListener('click', closeCampfire);
  document.getElementById('campfire-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCampfire();
  });
  document.getElementById('campfire-start-btn').addEventListener('click', () => {
    const topic = document.getElementById('campfire-topic').value.trim();
    if (!topic) { showNotice('Please share what you want to bring to the circle.'); return; }
    runCampfire(topic);
  });

  // Campfire — tone buttons
  document.querySelectorAll('.campfire-tone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      campfireTone = btn.dataset.tone;
      document.querySelectorAll('.campfire-tone-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Campfire — advisor toggle
  document.getElementById('ca-btn-all').addEventListener('click', () => {
    campfireAdvisorMode = 'all';
    document.getElementById('ca-btn-all').classList.add('active');
    document.getElementById('ca-btn-select').classList.remove('active');
    document.getElementById('campfire-advisor-chips').style.display = 'none';
  });
  document.getElementById('ca-btn-select').addEventListener('click', () => {
    campfireAdvisorMode = 'select';
    document.getElementById('ca-btn-select').classList.add('active');
    document.getElementById('ca-btn-all').classList.remove('active');
    document.getElementById('campfire-advisor-chips').style.display = 'flex';
  });

  // Campfire — new session
  document.getElementById('campfire-new-btn').addEventListener('click', () => {
    document.getElementById('campfire-session-phase').style.display = 'none';
    document.getElementById('campfire-setup-phase').style.display = '';
    setTimeout(() => document.getElementById('campfire-topic').focus(), 50);
  });

  // Dark Mode — desktop + mobile toggle
  document.getElementById('btn-dark-mode').addEventListener('click', toggleDarkMode);
  document.getElementById('m-btn-dark-mode').addEventListener('click', () => { closeMobileNav(); toggleDarkMode(); });

  // Restore dark mode preference on load
  if (localStorage.getItem('tribe_dark_mode') === 'true') applyDarkMode(true);

  // Voting — nav buttons (desktop + mobile)
  document.getElementById('btn-voting').addEventListener('click', openVoting);
  document.getElementById('m-btn-voting').addEventListener('click', () => { closeMobileNav(); openVoting(); });

  // Voting — modal controls
  document.getElementById('voting-close').addEventListener('click', closeVoting);
  document.getElementById('voting-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeVoting();
  });
  document.getElementById('voting-start-btn').addEventListener('click', runVoting);

  // Voting — type buttons
  document.querySelectorAll('.voting-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      votingType = btn.dataset.vtype;
      document.querySelectorAll('.voting-type-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderVotingOptionsArea();
    });
  });

  // Voting — advisor toggle
  document.getElementById('va-btn-all').addEventListener('click', () => {
    votingAdvisorMode = 'all';
    document.getElementById('va-btn-all').classList.add('active');
    document.getElementById('va-btn-select').classList.remove('active');
    document.getElementById('voting-advisor-chips').style.display = 'none';
  });
  document.getElementById('va-btn-select').addEventListener('click', () => {
    votingAdvisorMode = 'select';
    document.getElementById('va-btn-select').classList.add('active');
    document.getElementById('va-btn-all').classList.remove('active');
    document.getElementById('voting-advisor-chips').style.display = 'flex';
  });

  // Voting — new vote
  document.getElementById('voting-new-btn').addEventListener('click', () => {
    document.getElementById('voting-results-phase').style.display = 'none';
    document.getElementById('voting-setup-phase').style.display = '';
    setTimeout(() => document.getElementById('voting-question').focus(), 50);
  });

  // Stories — bell toggles panel
  document.getElementById('btn-stories-nav').addEventListener('click', e => {
    e.stopPropagation();
    toggleStoriesPanel();
  });

  // Stories — tabs
  document.getElementById('stories-tab-new').addEventListener('click', () => {
    storiesPanelFilter = 'new';
    document.getElementById('stories-tab-new').classList.add('active');
    document.getElementById('stories-tab-archived').classList.remove('active');
    renderStoriesPanel();
  });
  document.getElementById('stories-tab-archived').addEventListener('click', () => {
    storiesPanelFilter = 'archived';
    document.getElementById('stories-tab-archived').classList.add('active');
    document.getElementById('stories-tab-new').classList.remove('active');
    renderStoriesPanel();
  });

  // Stories — close panel when clicking outside
  document.addEventListener('click', e => {
    const panel = document.getElementById('stories-panel');
    const wrap  = document.querySelector('.stories-bell-wrap');
    if (panel.classList.contains('open') && !wrap.contains(e.target)) {
      closeStoriesPanel();
    }
  });

  // Stories — viewer controls
  document.getElementById('story-close').addEventListener('click', closeStoryViewer);
  document.addEventListener('keydown', e => {
    if (!document.getElementById('story-viewer').classList.contains('open')) return;
    if (e.key === 'Escape') closeStoryViewer();
  });

  // About — desktop + mobile
  Object.keys(ABOUT_SECTIONS).forEach(key => {
    const desk = document.getElementById(`btn-about-${key}`);
    const mob  = document.getElementById(`m-btn-about-${key}`);
    if (desk) desk.addEventListener('click', () => openAbout(key));
    if (mob)  mob.addEventListener('click', () => { closeMobileNav(); openAbout(key); });
  });
  document.getElementById('about-close').addEventListener('click', closeAbout);
  document.getElementById('about-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAbout();
  });
  document.getElementById('about-prev').addEventListener('click', () => {
    if (aboutCurrentIndex > 0) { aboutCurrentIndex--; renderAboutFrame(); }
  });
  document.getElementById('about-next').addEventListener('click', () => {
    if (aboutCurrentIndex < ABOUT_KEYS.length - 1) { aboutCurrentIndex++; renderAboutFrame(); }
  });

  // Book Lessons — nav buttons (desktop + mobile)
  document.getElementById('btn-book-lessons').addEventListener('click', openBookLessons);
  document.getElementById('m-btn-book-lessons').addEventListener('click', () => { closeMobileNav(); openBookLessons(); });

  // Book Lessons — modal controls
  document.getElementById('book-lessons-close').addEventListener('click', closeBookLessons);
  document.getElementById('book-lessons-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeBookLessons();
  });
  document.getElementById('bl-start-btn').addEventListener('click', startBookLesson);

  // Book Lessons — mode buttons (input phase)
  document.querySelectorAll('#bl-input-phase .bl-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      blSelectedMode = btn.dataset.mode;
      document.querySelectorAll('#bl-input-phase .bl-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Book Lessons — mode buttons (lesson phase)
  document.querySelectorAll('#bl-lesson-phase .bl-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      blSelectedMode = btn.dataset.mode;
      document.querySelectorAll('#bl-lesson-phase .bl-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      startBookLesson();
    });
  });

  // Book Lessons — tribe pills
  document.querySelectorAll('.bl-tribe-pill').forEach(btn => {
    btn.addEventListener('click', () => continueWithTribe(btn.dataset.mode));
  });

  // Admin — Claude API opens settings modal (desktop + mobile)
  document.getElementById('btn-admin-api').addEventListener('click', openSettings);
  document.getElementById('m-btn-admin-api').addEventListener('click', () => { closeMobileNav(); openSettings(); });

  // Logo / brand → home (new chat + reset mode)
  document.getElementById('btn-home').addEventListener('click', () => {
    closeMobileNav();
    startNewChat();
    setMode('member');
  });

  // Hamburger toggle
  document.getElementById('btn-hamburger').addEventListener('click', toggleMobileNav);
  document.addEventListener('click', e => {
    const nav = document.getElementById('mobile-nav');
    const btn = document.getElementById('btn-hamburger');
    if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Settings modal
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('settings-save').addEventListener('click', saveSettings);
  document.getElementById('settings-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSettings();
  });

  // Restore saved settings into form
  document.getElementById('guide-name-input').value = state.guideName;

  // Start initial conversation session
  startNewChat();
  applyModeUI('member');

});

// ── Input ────────────────────────────────────────────────────────

function onInputChange() {
  $sendBtn.disabled = !$input.value.trim() || state.isLoading;
  autoGrow();
  updateMentionDropdown();
}

// ── Mention autocomplete ─────────────────────────────────────────

const MENTION_OPTIONS = [...TRIBE.map(id => ADVISORS[id].name.toLowerCase()), 'all'];

function updateMentionDropdown() {
  const val = $input.value;
  const cursor = $input.selectionStart;
  const before = val.slice(0, cursor);
  const atMatch = before.match(/@(\w*)$/);
  if (!atMatch) { hideMentionDropdown(); return; }

  const partial = atMatch[1].toLowerCase();
  const filtered = MENTION_OPTIONS.filter(n => n.startsWith(partial));
  if (filtered.length === 0) { hideMentionDropdown(); return; }

  const $drop = document.getElementById('mention-dropdown');
  $drop.innerHTML = filtered.map(n =>
    `<div class="mention-item" data-name="${n}">@${n}</div>`
  ).join('');
  $drop.style.display = 'block';
}

function hideMentionDropdown() {
  const $drop = document.getElementById('mention-dropdown');
  if ($drop) $drop.style.display = 'none';
}

function insertMention(name) {
  const val = $input.value;
  const cursor = $input.selectionStart;
  const before = val.slice(0, cursor).replace(/@\w*$/, `@${name} `);
  const after  = val.slice(cursor);
  $input.value = before + after;
  const pos = before.length;
  $input.focus();
  $input.setSelectionRange(pos, pos);
  hideMentionDropdown();
  onInputChange();
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!$sendBtn.disabled) handleSend();
  }
}

function autoGrow() {
  $input.style.height = 'auto';
  $input.style.height = Math.min($input.scrollHeight, 150) + 'px';
}

// ── Mode switching ────────────────────────────────────────────────

function setMode(mode) {
  const prev = state.mode;
  state.mode = mode;
  applyModeUI(mode, prev);
  $input.placeholder = MODE_PLACEHOLDERS[mode] || 'Ask your tribe something...';
}

function applyModeUI(mode, prev) {
  // Update pill highlights
  document.querySelectorAll('.mode-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const chips = document.querySelectorAll('.advisor-chip');

  if (mode === 'tribe') {
    state.selectedAdvisors = new Set(TRIBE);
    chips.forEach(chip => {
      const id = chip.dataset.advisor;
      chip.classList.toggle('active', TRIBE.includes(id));
      chip.classList.toggle('dim',    id === 'guide');
      chip.style.cursor = 'default';
    });

  } else if (mode === 'guide') {
    state.selectedAdvisors = new Set(['guide']);
    chips.forEach(chip => {
      const id = chip.dataset.advisor;
      chip.classList.toggle('active', id === 'guide');
      chip.classList.toggle('dim',    id !== 'guide');
      chip.style.cursor = 'default';
    });

  } else if (mode === 'bvm') {
    state.selectedAdvisors = new Set(['bvm']);
    chips.forEach(chip => {
      chip.classList.remove('active');
      chip.classList.add('dim');
      chip.style.cursor = 'default';
    });

  } else if (mode === 'member') {
    // Default to first tribe member on entry; keep current selection if already in member mode
    if (!prev || prev !== 'member') {
      state.selectedAdvisors = new Set([TRIBE[0]]);
    }
    chips.forEach(chip => {
      chip.classList.remove('dim');
      chip.style.cursor = 'pointer';
    });
    syncChipHighlights();

  } else if (mode === 'parable') {
    // Default to first tribe advisor
    state.selectedAdvisors = new Set(['seth']);
    chips.forEach(chip => {
      chip.classList.remove('dim');
      chip.style.cursor = 'pointer';
    });
    syncChipHighlights();
  }
}

function toggleAdvisor(id) {
  if (state.mode === 'tribe' || state.mode === 'guide' || state.mode === 'bvm') return;

  if (state.mode === 'parable') {
    // Single-select
    state.selectedAdvisors = new Set([id]);
  } else if (state.mode === 'member') {
    // Multi-toggle — allow deselecting to zero (validated at send)
    if (state.selectedAdvisors.has(id)) {
      state.selectedAdvisors.delete(id);
    } else {
      state.selectedAdvisors.add(id);
    }
  } else {
    // Multi-toggle — keep at least one
    if (state.selectedAdvisors.has(id)) {
      if (state.selectedAdvisors.size > 1) {
        state.selectedAdvisors.delete(id);
      }
    } else {
      state.selectedAdvisors.add(id);
    }
  }
  syncChipHighlights();
}

function syncChipHighlights() {
  document.querySelectorAll('.advisor-chip').forEach(chip => {
    chip.classList.toggle('active', state.selectedAdvisors.has(chip.dataset.advisor));
  });
}

// ── Mention routing ───────────────────────────────────────────────

function extractMentions(text) {
  const matches = text.match(/@(\w+)/g);
  if (!matches) return [];
  return matches.map(m => m.slice(1).toLowerCase());
}

function removeMentions(text) {
  return text.replace(/@\w+/g, '').replace(/\s{2,}/g, ' ').trim();
}

function determineResponders(text) {
  const sessionIds = Array.from(state.selectedAdvisors);
  const mentions = extractMentions(text);

  if (mentions.includes('all')) return sessionIds;

  if (mentions.length > 0) {
    const matched = sessionIds.filter(id =>
      mentions.includes(ADVISORS[id]?.name.toLowerCase())
    );
    return matched.length > 0 ? matched : sessionIds;
  }

  // No mention: use last speaker; fall back to full selection on first message
  return state.lastSpeakers.length > 0 ? state.lastSpeakers : sessionIds;
}

// ── Send / Stop ───────────────────────────────────────────────────

const STOP_ICON  = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="0" y="0" width="12" height="12" rx="2"/></svg>`;
const SEND_ICON  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

function setSendMode() {
  $sendBtn.innerHTML = SEND_ICON;
  $sendBtn.classList.remove('stop-mode');
}

function setStopMode() {
  $sendBtn.innerHTML = STOP_ICON;
  $sendBtn.classList.add('stop-mode');
  $sendBtn.disabled = false;
}

function handleStop() {
  state.stopped = true;
  if (state.streamController) {
    state.streamController.abort();
    state.streamController = null;
  }
}

async function handleSend() {
  const rawText = $input.value.trim();
  if (!rawText || state.isLoading) return;

  if (state.mode === 'member' && state.selectedAdvisors.size === 0) {
    showNotice('Select at least one advisor to continue.');
    return;
  }

  // Resolve mention-based routing (member mode only)
  const advisorIds = state.mode === 'member'
    ? determineResponders(rawText)
    : Array.from(state.selectedAdvisors);

  // Strip @mentions from the text sent to AI
  const aiText = state.mode === 'member' ? removeMentions(rawText) : rawText;

  // Reset input
  $input.value = '';
  $input.style.height = 'auto';
  hideMentionDropdown();
  state.isLoading = true;
  state.stopped = false;
  setStopMode();

  // Hide welcome and controls on first message
  if ($welcome) {
    $welcome.style.display = 'none';
  }
  document.getElementById('mode-row').style.display = 'none';
  document.getElementById('advisor-row').style.display = 'none';

  // Render user bubble (show original text including @mentions)
  $inner.appendChild(createUserBubble(rawText));
  scrollBottom();
  addMsgToConv({ type: 'user', content: rawText });

  // Insert loading cards for responding advisors upfront
  const cards = {};
  for (const id of advisorIds) {
    const card = createLoadingCard(id);
    $inner.appendChild(card);
    cards[id] = card;
  }
  scrollBottom();

  // Call each advisor sequentially (streaming into their card)
  // tribeContext accumulates prior responses so later advisors can reference them
  let tribeContext = '';
  let lastResponderId = null;
  for (const id of advisorIds) {
    if (state.stopped) { fillCard(cards[id], 'Stopped.', true); continue; }
    try {
      const response = await callAdvisor(ADVISORS[id], aiText, tribeContext, cards[id]);
      addMsgToConv({ type: 'advisor', advisor_id: id, content: response });
      tribeContext += `\n\n${ADVISORS[id].name}:\n${response}`;
      lastResponderId = id;
    } catch (err) {
      if (err.name !== 'AbortError') fillCard(cards[id], formatError(err), true);
    }
    scrollBottom();
  }

  // Track last speaker for default routing on next message
  if (lastResponderId) state.lastSpeakers = [lastResponderId];

  // Guide synthesis: only for full tribe mode
  if (!state.stopped && state.mode === 'tribe' && tribeContext.trim() && advisorIds.length > 1) {
    const synthesisCard = createLoadingCard('guide');
    synthesisCard.classList.add('synthesis-card');
    // Override the displayed name to "Guide – Tribe Synthesis"
    synthesisCard.querySelector('.advisor-name').textContent = 'Guide – Tribe Synthesis';
    $inner.appendChild(synthesisCard);
    scrollBottom();

    const synthesisMessage =
      `User Question:\n${text}\n\nTribe Discussion:\n${tribeContext}`;

    const synthesisSystem =
      `Your role is to synthesize the tribe discussion.\n\nResponse format:\n• Title (one short line)\n• One short paragraph summarizing the key insight\n• Up to 3 short bullet takeaways\n\nConstraints:\n- Keep the entire response under 120 words.\n- Do not repeat the advisors.\n- Do not restate the entire discussion.\n- Focus only on the most important takeaway for the user.`;

    try {
      const synthesis = await callAdvisor(ADVISORS['guide'], synthesisMessage, '', synthesisCard, synthesisSystem);
      addMsgToConv({ type: 'synthesis', content: synthesis });
    } catch (err) {
      if (err.name !== 'AbortError') fillCard(synthesisCard, formatError(err), true);
    }
    scrollBottom();
  }

  state.isLoading = false;
  state.stopped = false;
  setSendMode();
  $sendBtn.disabled = !$input.value.trim();
}

// ── API ───────────────────────────────────────────────────────────

async function callAdvisor(advisor, userMessage, tribeContext = '', streamCard = null, systemOverride = null) {
  // systemOverride is used for the synthesis card — bypass knowledge loading in that case
  const system = systemOverride || buildSystemPrompt(advisor);

  // Add parable instruction
  let prompt = userMessage;
  if (state.mode === 'parable') {
    prompt = `Please respond in parable mode. Tell a short story, parable, or historical example that illustrates the relevant wisdom, then add one or two sentences connecting the story to this question. Question: ${userMessage}`;
  }

  // Append earlier advisor responses so this advisor can reference them
  if (tribeContext.trim()) {
    prompt += `\n\nEarlier advisor responses:${tribeContext}`;
  }

  const controller = new AbortController();
  state.streamController = controller;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 450,
      stream: true,
      system,
      messages: [{ role: 'user', content: prompt }]
    }),
    signal: controller.signal
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const textEl = streamCard?.querySelector('.advisor-text');
  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText   = '';
  let firstChunk = true;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      for (const line of decoder.decode(value, { stream: true }).split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            fullText += parsed.delta.text;
            if (textEl) {
              if (firstChunk) {
                // Replace thinking dots with streaming text
                textEl.innerHTML = '';
                textEl.classList.add('streaming');
                firstChunk = false;
              }
              textEl.textContent = fullText;
              scrollBottom();
            }
          }
        } catch (e) { /* skip malformed SSE lines */ }
      }

      if (state.stopped) break;
    }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  } finally {
    state.streamController = null;
  }

  // Final render: strip advisor header + apply markdown
  if (textEl) {
    textEl.classList.remove('streaming');
    const clean = stripAdvisorHeader(fullText, streamCard?.dataset.advisorId);
    textEl.innerHTML = renderMarkdown(clean);
  }

  return fullText;
}

function formatError(err) {
  const msg = err.message || '';
  if (msg.includes('401') || msg.includes('authentication')) {
    return 'Invalid API key. Please update it in Settings.';
  }
  if (msg.includes('429')) {
    return 'Rate limit reached. Please wait a moment and try again.';
  }
  return `Could not connect right now. (${msg || 'Unknown error'})`;
}

// ── DOM helpers ───────────────────────────────────────────────────

function renderMarkdown(text) {
  marked.use({ breaks: true, gfm: true });
  return marked.parse(text);
}

function createUserBubble(text) {
  const div = document.createElement('div');
  div.className = 'advisor-card msg-user-thread';
  div.innerHTML = `
    <div class="advisor-thread-avatar user-avatar-circle">You</div>
    <div class="advisor-meta">
      <div class="advisor-header">
        <span class="advisor-name">You</span>
      </div>
      <div class="advisor-text">${esc(text)}</div>
    </div>`;
  return div;
}

function createLoadingCard(advisorId) {
  const a = ADVISORS[advisorId];
  const card = document.createElement('div');
  card.className = 'advisor-card';
  card.dataset.advisorId = advisorId;
  card.style.setProperty('--advisor-color', a.color);
  const avatarSrc = `../assets/avatars/${advisorId}.png`;
  card.innerHTML = `
    <img class="advisor-thread-avatar" src="${avatarSrc}" alt="${a.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="advisor-avatar" style="background:${a.color};display:none">${a.initial}</div>
    <div class="advisor-meta">
      <div class="advisor-header">
        <span class="advisor-name">${a.name}</span>
        <span class="advisor-title">${a.title}</span>
      </div>
      <div class="advisor-text">
        <span class="advisor-thinking">${a.name} is thinking<div class="typing-dots" style="height:auto"><span></span><span></span><span></span></div></span>
      </div>
    </div>`;
  return card;
}

function stripAdvisorHeader(text, advisorId) {
  const a = ADVISORS[advisorId];
  if (!a) return text;
  let t = text.trim();
  // Remove name line if present at start
  if (t.startsWith(a.name)) t = t.slice(a.name.length).replace(/^[\r\n]+/, '');
  // Remove title line if present next
  if (t.startsWith(a.title)) t = t.slice(a.title.length).replace(/^[\r\n]+/, '');
  return t.trim();
}

function fillCard(card, text, isError = false) {
  const textEl = card.querySelector('.advisor-text');
  if (isError) {
    textEl.innerHTML = `<span class="advisor-error-text">${esc(text)}</span>`;
  } else {
    const clean = stripAdvisorHeader(text, card.dataset.advisorId);
    textEl.innerHTML = renderMarkdown(clean);
  }
}

function showNotice(msg) {
  const el = document.createElement('div');
  el.className = 'app-notice';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function scrollBottom() {
  $stream.scrollTop = $stream.scrollHeight;
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Settings modal ────────────────────────────────────────────────

function openGuide(id) {
  document.getElementById(id).classList.add('open');
}

function closeGuide(id) {
  document.getElementById(id).classList.remove('open');
}

function openSettings() {
  document.getElementById('guide-name-input').value = state.guideName;
  document.getElementById('settings-overlay').classList.add('open');
  setTimeout(() => document.getElementById('guide-name-input').focus(), 100);
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
}

function saveSettings() {
  const name = document.getElementById('guide-name-input').value.trim();
  state.guideName = name || 'a wise mentor and trusted advisor';
  closeSettings();
}

// ── Conversations ─────────────────────────────────────────────────

function getConversations() {
  try { return JSON.parse(localStorage.getItem('tribe_conversations') || '[]'); }
  catch { return []; }
}

function saveConversations(convs) {
  localStorage.setItem('tribe_conversations', JSON.stringify(convs));
}

function generateTitle(text) {
  return text.trim().split(/\s+/).slice(0, 5).join(' ');
}

function formatRelativeDate(ts) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  ===1) return 'Yesterday';
  if (days  <  7) return `${days} days ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function startNewChat() {
  // Drop any empty conversations before creating a new one
  const cleaned = getConversations().filter(c => c.messages.length > 0);
  const newConv = {
    id: 'conv_' + Date.now(),
    title: null,
    created_at: Date.now(),
    updated_at: Date.now(),
    messages: []
  };
  cleaned.unshift(newConv);
  saveConversations(cleaned);
  state.currentConvId = newConv.id;

  $inner.innerHTML = '';
  $inner.appendChild($welcome);
  $welcome.style.display = '';
  document.getElementById('mode-row').style.display = '';
  document.getElementById('advisor-row').style.display = '';
  state.lastSpeakers = [];
  $input.value = '';
  $input.style.height = 'auto';
  $sendBtn.disabled = true;
  if (state.isLoading) { state.stopped = true; state.isLoading = false; setSendMode(); }
}

function addMsgToConv(msg) {
  if (!state.currentConvId) return;
  const convs = getConversations();
  const conv  = convs.find(c => c.id === state.currentConvId);
  if (!conv) return;
  msg.ts = Date.now();
  conv.messages.push(msg);
  conv.updated_at = Date.now();
  // Auto-title: set on first user message
  if (msg.type === 'user' && conv.messages.filter(m => m.type === 'user').length === 1) {
    conv.title = generateTitle(msg.content);
  }
  saveConversations(convs);
}

function openHistoryPanel() {
  const convs = getConversations().filter(c => c.messages.length > 0);
  const $list = document.getElementById('history-list');

  if (convs.length === 0) {
    $list.innerHTML = '<p class="history-empty">No conversations yet.</p>';
  } else {
    $list.innerHTML = convs.map(conv => {
      const title      = esc(conv.title || 'Untitled Chat');
      const date       = formatRelativeDate(conv.updated_at);
      const msgCount   = conv.messages.filter(m => m.type === 'user').length;
      const countLabel = msgCount === 1 ? '1 message' : `${msgCount} messages`;
      return `
        <div class="history-item" data-id="${conv.id}">
          <div class="history-item-main">
            <div class="history-item-title">${title}</div>
            <div class="history-item-meta">${date} · ${countLabel}</div>
          </div>
          <div class="history-item-actions">
            <button class="history-action" data-action="rename" data-id="${conv.id}" title="Rename">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="history-action history-delete" data-action="delete" data-id="${conv.id}" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');

    $list.querySelectorAll('.history-item-main').forEach(el => {
      el.addEventListener('click', () => loadConversation(el.closest('.history-item').dataset.id));
    });
    $list.querySelectorAll('[data-action="rename"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); renameConversation(btn.dataset.id); });
    });
    $list.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); deleteConversation(btn.dataset.id); });
    });
  }

  document.getElementById('history-overlay').classList.add('open');
}

function closeHistoryPanel() {
  document.getElementById('history-overlay').classList.remove('open');
}

function loadConversation(id) {
  const conv = getConversations().find(c => c.id === id);
  if (!conv) return;

  state.currentConvId = id;
  $inner.innerHTML = '';
  $welcome.style.display = 'none';
  document.getElementById('mode-row').style.display = 'none';
  document.getElementById('advisor-row').style.display = 'none';

  for (const msg of conv.messages) {
    if (msg.type === 'user') {
      $inner.appendChild(createUserBubble(msg.content));
    } else if (msg.type === 'advisor') {
      if (!ADVISORS[msg.advisor_id]) continue;
      const card = createLoadingCard(msg.advisor_id);
      $inner.appendChild(card);
      fillCard(card, msg.content);
    } else if (msg.type === 'synthesis') {
      const card = createLoadingCard('guide');
      card.classList.add('synthesis-card');
      card.querySelector('.advisor-name').textContent = 'Guide – Tribe Synthesis';
      $inner.appendChild(card);
      fillCard(card, msg.content);
    }
  }

  scrollBottom();
  closeHistoryPanel();
}

function renameConversation(id) {
  const convs = getConversations();
  const conv  = convs.find(c => c.id === id);
  if (!conv) return;
  const newTitle = prompt('Rename conversation:', conv.title || 'Untitled Chat');
  if (newTitle === null) return;
  conv.title = newTitle.trim() || conv.title;
  saveConversations(convs);
  openHistoryPanel();
}

function deleteConversation(id) {
  saveConversations(getConversations().filter(c => c.id !== id));
  if (state.currentConvId === id) startNewChat();
  openHistoryPanel();
}

// ── Book Lessons ──────────────────────────────────────────────────

let blSelectedMode = 'quick';
let blCurrentBook  = '';

// ── Stories ───────────────────────────────────────────────────────

const STORY_ADVISORS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];
const ADVISOR_AVATAR  = {
  seth:    '../assets/avatars/seth.png',
  emma:    '../assets/avatars/emma.png',
  frank:   '../assets/avatars/frank.png',
  rachel:  '../assets/avatars/rachel.png',
  guide:   '../assets/avatars/guide.svg',
  marcus:  null,
  hannah:  null
};

let parsedStories  = [];   // all stories from md
let svAdvisorId    = null; // currently viewed advisor
let svStories      = [];   // today's stories for current advisor
let svIndex        = 0;    // current story index

// ── Parse ──

function parseStoriesMd(text) {
  const result = [];
  const blocks = text.split('---').map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    if (!block.includes('Advisor:')) continue;
    const line = key => {
      const m = block.match(new RegExp(`^${key}:\\s*(.+)`, 'm'));
      return m ? m[1].trim() : '';
    };
    const advisor  = line('Advisor').toLowerCase();
    const title    = line('Title');
    const type     = line('Type');
    const storyM   = block.match(/^Story:\s*([\s\S]+?)(?=^Lesson:|$)/m);
    const lessonM  = block.match(/^Lesson:\s*([\s\S]+?)$/m);
    const story    = storyM  ? storyM[1].trim()  : '';
    const lesson   = lessonM ? lessonM[1].trim() : '';
    if (advisor && title) result.push({ advisor, title, type, story, lesson });
  }
  return result;
}

// ── Daily rotation (seeded by date + advisor) ──

function daySeed(advisorId) {
  const d = new Date();
  const base = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return base + advisorId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s   = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTodayStories(advisorId) {
  const all = parsedStories.filter(s => s.advisor === advisorId);
  return seededShuffle(all, daySeed(advisorId));
}

// ── Read state ──

function readKey() {
  return `tribe_stories_read_${new Date().toISOString().slice(0, 10)}`;
}

function getReadSet() {
  try { return new Set(JSON.parse(localStorage.getItem(readKey()) || '[]')); }
  catch { return new Set(); }
}

function markAdvisorRead(advisorId) {
  const s = getReadSet();
  s.add(advisorId);
  localStorage.setItem(readKey(), JSON.stringify([...s]));
}

function getUnreadCount() {
  const read = getReadSet();
  return STORY_ADVISORS.filter(id => {
    return getTodayStories(id).length > 0 && !read.has(id);
  }).length;
}

// ── Strip rendering ──

let storiesPanelFilter = 'new'; // 'new' | 'archived'

function initStories() {
  if (knowledge.stories) parsedStories = parseStoriesMd(knowledge.stories);
  updateStoriesBadge();
}

function toggleStoriesPanel() {
  const panel = document.getElementById('stories-panel');
  if (panel.classList.contains('open')) {
    closeStoriesPanel();
  } else {
    renderStoriesPanel();
    panel.classList.add('open');
  }
}

function closeStoriesPanel() {
  document.getElementById('stories-panel').classList.remove('open');
}

function renderStoriesPanel() {
  const list = document.getElementById('stories-panel-list');
  if (!list) return;
  const read = getReadSet();
  list.innerHTML = '';

  const advisorsToShow = STORY_ADVISORS.filter(id => {
    const hasStories = getTodayStories(id).length > 0;
    if (!hasStories) return false;
    if (storiesPanelFilter === 'new')      return !read.has(id);
    if (storiesPanelFilter === 'archived') return  read.has(id);
    return true;
  });

  if (!advisorsToShow.length) {
    const empty = document.createElement('div');
    empty.className = 'story-panel-empty';
    empty.textContent = storiesPanelFilter === 'new' ? 'No new stories.' : 'No archived stories yet.';
    list.appendChild(empty);
    return;
  }

  // Unread first
  advisorsToShow.sort((a, b) => {
    const aRead = read.has(a) ? 1 : 0;
    const bRead = read.has(b) ? 1 : 0;
    return aRead - bRead;
  });

  advisorsToShow.forEach(id => {
    const advisor = ADVISORS[id];
    const todayStories = getTodayStories(id);
    const firstStory = todayStories[0];
    const isUnread = !read.has(id);

    const item = document.createElement('div');
    item.className = 'story-panel-item';

    // Avatar
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'story-panel-avatar' + (isUnread ? ' unread' : '');
    if (isUnread) avatarWrap.style.setProperty('--advisor-ring', advisor.color);

    const avatarInner = document.createElement('div');
    avatarInner.className = 'story-panel-avatar-inner';

    const avatarSrc = ADVISOR_AVATAR[id];
    if (avatarSrc) {
      const img = document.createElement('img');
      img.src = avatarSrc;
      img.alt = advisor.name;
      avatarInner.appendChild(img);
    } else {
      const init = document.createElement('div');
      init.className = 'story-panel-initial';
      init.style.background = advisor.color;
      init.textContent = advisor.initial;
      avatarInner.appendChild(init);
    }
    avatarWrap.appendChild(avatarInner);

    // Info
    const info = document.createElement('div');
    info.className = 'story-panel-info';

    const name = document.createElement('div');
    name.className = 'story-panel-name';
    name.textContent = advisor.name;

    const titleEl = document.createElement('div');
    titleEl.className = 'story-panel-title-text';
    titleEl.textContent = firstStory ? firstStory.title : '';

    const meta = document.createElement('div');
    meta.className = 'story-panel-meta';
    meta.textContent = (firstStory ? firstStory.type : '') + (todayStories.length > 1 ? ` · ${todayStories.length} stories` : '');

    info.appendChild(name);
    info.appendChild(titleEl);
    info.appendChild(meta);

    item.appendChild(avatarWrap);
    item.appendChild(info);

    // Unread dot
    if (isUnread) {
      const dot = document.createElement('div');
      dot.className = 'story-panel-dot';
      item.appendChild(dot);
    }

    item.addEventListener('click', () => {
      closeStoriesPanel();
      openStoryViewer(id);
    });

    list.appendChild(item);
  });
}

function updateStoriesBadge() {
  const badge = document.getElementById('stories-nav-badge');
  if (!badge) return;
  const count = getUnreadCount();
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

// ── Viewer ──

function openStoryViewer(advisorId) {
  const advisor = ADVISORS[advisorId];
  if (!advisor) return;
  svAdvisorId = advisorId;
  svStories   = getTodayStories(advisorId);
  svIndex     = 0;
  document.getElementById('story-viewer').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderStoryFrame();
}

function closeStoryViewer() {
  document.getElementById('story-viewer').classList.remove('open');
  document.body.style.overflow = '';
  markAdvisorRead(svAdvisorId);
  updateStoriesBadge();
}

function renderStoryFrame() {
  if (!svStories.length) { closeStoryViewer(); return; }
  const story  = svStories[svIndex];
  const advisor = ADVISORS[svAdvisorId];

  // Header
  const avatarWrap = document.getElementById('story-header-avatar');
  avatarWrap.innerHTML = '';
  const avatarSrc = ADVISOR_AVATAR[svAdvisorId];
  if (avatarSrc) {
    const img = document.createElement('img');
    img.src = avatarSrc;
    img.alt = advisor.name;
    avatarWrap.appendChild(img);
  } else {
    const init = document.createElement('div');
    init.className = 'story-header-initial';
    init.style.background = advisor.color;
    init.textContent = advisor.initial;
    avatarWrap.appendChild(init);
  }
  document.getElementById('story-header-name').textContent = advisor.name;
  document.getElementById('story-header-role').textContent = advisor.title;

  // Body
  document.getElementById('story-type-tag').textContent = story.type;
  document.getElementById('story-title').textContent    = story.title;
  document.getElementById('story-text').textContent     = story.story;
  document.getElementById('story-lesson').textContent   = story.lesson;

}

// ── About ─────────────────────────────────────────────────────────

// Map nav-button key → section heading in about.md
const ABOUT_SECTIONS = {
  'my-tribe':      'My Tribe',
  'spiritual':     'Spiritual Advisor',
  'mindset':       'Mindset Advisor',
  'emotional':     'Emotional Advisor',
  'health':        'Health Advisor',
  'relationships': 'Relationships Advisor',
  'financial':     'Financial Advisor'
};
const ABOUT_KEYS = Object.keys(ABOUT_SECTIONS);
let aboutCurrentIndex = 0;

function parseAboutSection(sectionTitle) {
  if (!knowledge.about) return '<p>Content not available.</p>';
  const lines = knowledge.about.split('\n');
  const heading = `## ${sectionTitle}`;
  const start = lines.findIndex(l => l.trim() === heading);
  if (start === -1) return '<p>Section not found.</p>';
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break;
    body.push(lines[i]);
  }
  return body.join('\n')
    .trim()
    .replace(/---/g, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function renderAboutFrame() {
  const key   = ABOUT_KEYS[aboutCurrentIndex];
  const title = ABOUT_SECTIONS[key];
  const total = ABOUT_KEYS.length;

  document.getElementById('about-modal-title').textContent = `About — ${title}`;
  document.getElementById('about-content').innerHTML = parseAboutSection(title);
  document.getElementById('about-nav-counter').textContent = `${aboutCurrentIndex + 1} of ${total}`;
  document.getElementById('about-prev').disabled = aboutCurrentIndex === 0;
  document.getElementById('about-next').disabled = aboutCurrentIndex === total - 1;

  // Scroll content back to top on navigation
  const body = document.querySelector('#about-overlay .modal-body');
  if (body) body.scrollTop = 0;
}

function openAbout(key) {
  aboutCurrentIndex = ABOUT_KEYS.indexOf(key);
  if (aboutCurrentIndex === -1) aboutCurrentIndex = 0;
  renderAboutFrame();
  document.getElementById('about-overlay').classList.add('open');
}

function closeAbout() {
  document.getElementById('about-overlay').classList.remove('open');
}

function openBookLessons() {
  blSelectedMode = 'quick';
  blCurrentBook  = '';
  // Reset to input phase
  document.getElementById('bl-input-phase').style.display = '';
  document.getElementById('bl-lesson-phase').style.display = 'none';
  document.getElementById('bl-book-input').value = '';
  document.getElementById('bl-lesson-content').innerHTML = '';
  // Sync mode buttons in input phase
  document.querySelectorAll('#bl-input-phase .bl-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === 'quick');
  });
  document.getElementById('book-lessons-overlay').classList.add('open');
  setTimeout(() => document.getElementById('bl-book-input').focus(), 100);
}

function closeBookLessons() {
  document.getElementById('book-lessons-overlay').classList.remove('open');
}

function formatLessonText(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function buildBookLessonPrompt(bookTitle, mode) {
  const base = knowledge.bookLessons || '';

  const modeInstructions = {
    quick: `Use the Quick lesson mode: cover only the Book Overview and top 3–5 Key Principles. Keep the total response under 300 words. Be concise and clear.`,
    deep:  `Use the Deep Dive lesson mode: cover all five sections fully — Book Overview, Key Principles (up to 10), Practical Takeaways, Who This Book Helps Most, and Potential Critiques. Explain each idea in depth with examples where relevant.`,
    interactive: `Use the Interactive lesson mode: present ideas one at a time. After each major section, include a short reflection question the user can think about. End with a practical challenge the user can act on today.`
  };

  return `${base}

---

You are generating a Book Lesson for the My Tribe learning system.

Book: "${bookTitle}"

${modeInstructions[mode] || modeInstructions.quick}

Format sections using **Section Title** on its own line before the content.

Rules:
- Write entirely in original language. Do not reproduce copyrighted text.
- Summarize, interpret, and explain — do not quote at length.
- Keep the tone clear, practical, and grounded.
- Focus on how ideas apply to real decisions and personal growth.`;
}

async function startBookLesson() {
  const bookTitle = document.getElementById('bl-book-input').value.trim();
  if (!bookTitle) {
    document.getElementById('bl-book-input').focus();
    return;
  }


  blCurrentBook = bookTitle;

  // Switch to lesson phase with loading state
  document.getElementById('bl-input-phase').style.display = 'none';
  const lessonPhase = document.getElementById('bl-lesson-phase');
  lessonPhase.style.display = '';
  document.getElementById('bl-current-book').textContent = bookTitle;

  const contentEl = document.getElementById('bl-lesson-content');
  contentEl.innerHTML = `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Generating lesson…</div>`;

  // Sync mode buttons in lesson phase
  document.querySelectorAll('#bl-lesson-phase .bl-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === blSelectedMode);
  });

  await fetchBookLesson(bookTitle, blSelectedMode);
}

async function fetchBookLesson(bookTitle, mode) {
  const contentEl = document.getElementById('bl-lesson-content');
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: mode === 'quick' ? 600 : 1200,
        system: buildBookLessonPrompt(bookTitle, mode),
        messages: [{ role: 'user', content: `Generate a ${mode} lesson for: ${bookTitle}` }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    contentEl.innerHTML = formatLessonText(data.content[0].text);
  } catch (err) {
    contentEl.innerHTML = `<span class="advisor-error-text">${esc(formatError(err))}</span>`;
  }
}

function continueWithTribe(pillMode) {
  state.bookContext = blCurrentBook;
  closeBookLessons();
  startNewChat();
  setMode(pillMode);
  $input.placeholder = `About "${blCurrentBook}": `;
  $input.focus();
}

// ── Daily Alignment config parser ────────────────────────────────

function parseDailyAlignmentConfig(text) {
  const lines = text.split('\n').map(l => l.trim());
  const cfg = { defaultGoals: [], focus: [], emotional: [], selfImage: [], completionMessage: '' };

  let section = null;
  let collectingOptions = false;
  let collectingMessage = false;

  for (const line of lines) {
    if (line === '---') { collectingOptions = false; collectingMessage = false; continue; }

    if (line === '## 1. Focused Goals')   { section = 'goals';     collectingOptions = false; continue; }
    if (line === '## 2. Focus')           { section = 'focus';     collectingOptions = false; continue; }
    if (line === '## 3. Emotional State') { section = 'emotional'; collectingOptions = false; continue; }
    if (line === '## 4. Self Image')      { section = 'selfImage'; collectingOptions = false; continue; }
    if (line === '# Completion Message')  { section = 'message';   collectingMessage = false; continue; }
    if (line.startsWith('#'))             { section = null; collectingOptions = false; continue; }

    if (!line) continue;

    if (section === 'goals' && line.startsWith('- ')) {
      cfg.defaultGoals.push(line.slice(2).trim());
    } else if (section === 'focus' || section === 'emotional' || section === 'selfImage') {
      if (line === 'Options:') { collectingOptions = true; continue; }
      if (collectingOptions && !line.startsWith('This ') && line !== 'Prompt:') {
        cfg[section].push(line);
      }
    } else if (section === 'message') {
      if (line === 'Example:') { collectingMessage = true; continue; }
      if (collectingMessage && line) { cfg.completionMessage = line; collectingMessage = false; }
    }
  }
  return cfg;
}

function applyDailyAlignmentConfig() {
  if (!knowledge.dailyAlignment) return;
  const cfg = parseDailyAlignmentConfig(knowledge.dailyAlignment);

  const toOptions = labels => labels.map(l => ({ value: l, label: l }));

  if (cfg.defaultGoals.length)     DEFAULT_GOALS          = cfg.defaultGoals;
  if (cfg.focus.length)            FOCUS_OPTIONS          = toOptions(cfg.focus);
  if (cfg.emotional.length)        EMOTIONAL_OPTIONS      = toOptions(cfg.emotional);
  if (cfg.selfImage.length)        SELFIMAGE_OPTIONS      = toOptions(cfg.selfImage);
  if (cfg.completionMessage)       DAILY_COMPLETION_MESSAGE = cfg.completionMessage;
}

// ── Daily Alignment ───────────────────────────────────────────────

// These are fallback defaults — overwritten at startup from coaching/daily-alignment.md
let DEFAULT_GOALS = ['Body transformation', 'Pink Fox & sXp', 'BAM'];

let FOCUS_OPTIONS = [
  { value: 'focused',    label: 'Focused on commitments and priorities' },
  { value: 'distracted', label: 'Distracted or making excuses' },
  { value: 'past',       label: 'Thinking about past problems' }
];

let EMOTIONAL_OPTIONS = [
  { value: 'excited',   label: 'Excited' },
  { value: 'grateful',  label: 'Grateful or at peace' },
  { value: 'neutral',   label: 'Neutral' },
  { value: 'down',      label: 'Down' },
  { value: 'depressed', label: 'Depressed' }
];

let SELFIMAGE_OPTIONS = [
  { value: 'strong',   label: 'Strong and confident' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'low',      label: 'Low confidence' }
];

let DAILY_COMPLETION_MESSAGE = 'When your decisions align with your commitments, discipline, and values, progress becomes inevitable.';

// In-memory state while panel is open
let alignState = { goals: [], focus: null, emotional: null, selfImage: null };

function getGoals() {
  // Always start from config (daily-alignment.md) so changes to the file are reflected
  const base = [...DEFAULT_GOALS];
  // Append any goals the user added manually (stored separately)
  try {
    const custom = JSON.parse(localStorage.getItem('tribe_custom_goals') || '[]');
    custom.forEach(g => { if (!base.includes(g)) base.push(g); });
  } catch {}
  return base;
}

function saveGoals(goals) {
  // Only persist goals that are not already in the config defaults
  const custom = goals.filter(g => !DEFAULT_GOALS.includes(g));
  localStorage.setItem('tribe_custom_goals', JSON.stringify(custom));
}

function getDailyEntries() {
  try { return JSON.parse(localStorage.getItem('tribe_daily_alignment') || '[]'); }
  catch { return []; }
}

function saveDailyEntries(entries) {
  localStorage.setItem('tribe_daily_alignment', JSON.stringify(entries));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayEntry() {
  return getDailyEntries().find(e => e.date === getTodayKey()) || null;
}

function openDailyAlignment() {
  const goalTexts  = getGoals();
  const todayEntry = getTodayEntry();

  if (todayEntry) {
    alignState.goals     = goalTexts.map(t => ({ text: t, checked: todayEntry.goals.includes(t) }));
    alignState.focus     = todayEntry.focus;
    alignState.emotional = todayEntry.emotional;
    alignState.selfImage = todayEntry.selfImage;
  } else {
    alignState.goals     = goalTexts.map(t => ({ text: t, checked: false }));
    alignState.focus     = null;
    alignState.emotional = null;
    alignState.selfImage = null;
  }

  renderAlignment();
  document.getElementById('daily-overlay').classList.add('open');
}

function closeDailyAlignment() {
  document.getElementById('daily-overlay').classList.remove('open');
}

function renderAlignment() {
  renderAlignGoals();
  renderAlignOptions('align-focus',     FOCUS_OPTIONS,     alignState.focus,     v => { alignState.focus     = v; });
  renderAlignOptions('align-emotional', EMOTIONAL_OPTIONS, alignState.emotional, v => { alignState.emotional = v; });
  renderAlignOptions('align-selfimage', SELFIMAGE_OPTIONS, alignState.selfImage, v => { alignState.selfImage = v; });

  // Completion message from config
  document.getElementById('align-message').textContent = `"${DAILY_COMPLETION_MESSAGE}"`;

  const todayEntry = getTodayEntry();
  const badge = document.getElementById('align-saved-badge');
  if (todayEntry) {
    badge.textContent = 'Saved today';
    badge.classList.add('visible');
    document.getElementById('align-save-btn').textContent = 'Update Entry';
  } else {
    badge.classList.remove('visible');
    document.getElementById('align-save-btn').textContent = 'Save Entry';
  }
}

function renderAlignGoals() {
  const container = document.getElementById('align-goals');
  container.innerHTML = alignState.goals.map((g, i) => `
    <div class="align-goal-row" data-index="${i}">
      <label class="align-check-label">
        <input type="checkbox" class="align-checkbox" data-index="${i}" ${g.checked ? 'checked' : ''}>
        <span class="align-goal-text">${esc(g.text)}</span>
      </label>
      <div class="align-goal-actions">
        <button class="align-goal-btn" data-action="edit" data-index="${i}" title="Edit">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="align-goal-btn align-goal-delete" data-action="delete" data-index="${i}" title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>`).join('');

  container.querySelectorAll('.align-checkbox').forEach(cb => {
    cb.addEventListener('change', () => { alignState.goals[+cb.dataset.index].checked = cb.checked; });
  });
  container.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => editAlignGoal(+btn.dataset.index));
  });
  container.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      alignState.goals.splice(+btn.dataset.index, 1);
      saveGoals(alignState.goals.map(g => g.text));
      renderAlignGoals();
    });
  });
}

function editAlignGoal(index) {
  const container = document.getElementById('align-goals');
  const row = container.querySelector(`[data-index="${index}"]`);
  const current = alignState.goals[index].text;
  row.innerHTML = `
    <input type="text" class="align-edit-input" value="${esc(current)}" style="flex:1" />
    <div class="align-goal-actions" style="opacity:1">
      <button class="align-goal-btn" data-action="save" title="Save">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>`;
  const input = row.querySelector('.align-edit-input');
  input.focus(); input.select();
  const commit = () => {
    const val = input.value.trim();
    if (val) { alignState.goals[index].text = val; saveGoals(alignState.goals.map(g => g.text)); }
    renderAlignGoals();
  };
  row.querySelector('[data-action="save"]').addEventListener('click', commit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') renderAlignGoals(); });
}

function renderAlignOptions(containerId, options, selected, onChange) {
  const container = document.getElementById(containerId);
  container.innerHTML = options.map(opt => `
    <div class="align-option ${selected === opt.value ? 'selected' : ''}" data-value="${opt.value}">
      <span class="align-option-box"></span>
      <span class="align-option-label">${esc(opt.label)}</span>
    </div>`).join('');

  container.querySelectorAll('.align-option').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.dataset.value;
      onChange(val);
      container.querySelectorAll('.align-option').forEach(o => o.classList.toggle('selected', o.dataset.value === val));
    });
  });
}

function saveDailyAlignment() {
  const today   = getTodayKey();
  const entries = getDailyEntries().filter(e => e.date !== today);
  entries.unshift({
    date:      today,
    goals:     alignState.goals.filter(g => g.checked).map(g => g.text),
    focus:     alignState.focus,
    emotional: alignState.emotional,
    selfImage: alignState.selfImage,
    saved_at:  Date.now()
  });
  saveDailyEntries(entries);
  saveGoals(alignState.goals.map(g => g.text));
  showNotice('Daily alignment saved.');
  closeDailyAlignment();
}

function addAlignGoal() {
  const input = document.getElementById('align-goal-input');
  const text  = input.value.trim();
  if (!text) return;
  alignState.goals.push({ text, checked: false });
  saveGoals(alignState.goals.map(g => g.text));
  input.value = '';
  renderAlignGoals();
}

// ── Campfire Mode ────────────────────────────────────────────────

let campfireTone        = 'reflective';
let campfireAdvisorMode = 'all';
let campfireRunning     = false;

const CAMPFIRE_ALL_ADVISORS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];

const CAMPFIRE_TONE_DESC = {
  reflective:  'balanced, calm, and contemplative',
  encouraging: 'warm, uplifting, and supportive',
  honest:      'direct, truth-centered, and gently confronting',
  deep:        'philosophical, inward, and meaning-focused'
};

// Each advisor's natural campfire entry type
const CAMPFIRE_ENTRY_TYPES = {
  seth:    'reflection',
  marcus:  'reflection',
  emma:    'question',
  hannah:  'reflection',
  rachel:  'metaphor',
  frank:   'reflection',
  guide:   'closing',
  bvm:     'closing'
};

// One advisor per session gets a parable — prefer seth, then guide/emma
const CAMPFIRE_PARABLE_ADVISOR = 'seth';

const CAMPFIRE_TYPE_LABELS = {
  reflection: 'Reflection',
  question:   'Question',
  parable:    'Parable',
  metaphor:   'Metaphor',
  closing:    'Closing'
};

// Opening lines by tone
const CAMPFIRE_OPENINGS = {
  reflective:  'The fire is quiet tonight. Your Tribe listens.',
  encouraging: 'You brought something real to the circle. You are not alone in this.',
  honest:      'Some questions deserve more than comfort. They deserve truth.',
  deep:        'Some things cannot be rushed. They must be sat with, slowly.'
};

function openCampfire() {
  campfireRunning     = false;
  campfireTone        = 'reflective';
  campfireAdvisorMode = 'all';
  document.querySelectorAll('.campfire-tone-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tone === 'reflective'));
  document.getElementById('ca-btn-all').classList.add('active');
  document.getElementById('ca-btn-select').classList.remove('active');
  document.getElementById('campfire-advisor-chips').style.display = 'none';
  document.querySelectorAll('.campfire-advisor-check').forEach(c => c.checked = true);
  document.getElementById('campfire-topic').value = '';
  document.getElementById('campfire-setup-phase').style.display = '';
  document.getElementById('campfire-session-phase').style.display = 'none';
  document.getElementById('campfire-overlay').classList.add('open');
  setTimeout(() => document.getElementById('campfire-topic').focus(), 100);
}

function closeCampfire() {
  document.getElementById('campfire-overlay').classList.remove('open');
}

function getCampfireAdvisors() {
  if (campfireAdvisorMode === 'all') return CAMPFIRE_ALL_ADVISORS;
  return Array.from(document.querySelectorAll('.campfire-advisor-check:checked')).map(c => c.value);
}

function buildCampfireEntryPrompt(advisor, topic, tone, entryType, priorTexts) {
  const toneDesc = CAMPFIRE_TONE_DESC[tone] || 'calm and reflective';
  const typeInstr = {
    reflection: 'Share a calm, meaningful reflection from your perspective.',
    question:   'Offer one thoughtful question that gently invites deeper self-awareness.',
    metaphor:   'Respond through a metaphor or symbolic image that illuminates the situation.',
    parable:    'Share a brief parable, short story, or symbolic image that holds wisdom for this moment.'
  }[entryType] || 'Share a calm reflection.';

  const prior = priorTexts.length
    ? `\n\nOther voices have already shared:\n${priorTexts.join('\n')}\nDo not repeat their themes. Bring your unique perspective.`
    : '';

  return `You are ${advisor.name}, the ${advisor.title}, speaking in a Campfire circle — a slow, reflective council session.

The person has brought this to the circle: "${topic}"

The tone of this session is: ${toneDesc}.

${typeInstr}

Stay completely in character as ${advisor.name}. Speak from the soul of your pillar — ${advisor.title}.
Be human, grounded, and meaningful. Avoid generic motivational language. Avoid bullet points or headers.
Keep your response to 70–130 words. Let it breathe.${prior}`;
}

function buildCampfireClosingPrompt(topic, tone, allTexts) {
  const toneDesc = CAMPFIRE_TONE_DESC[tone] || 'calm and reflective';
  const thread = allTexts.join('\n\n');
  return `You are the Guide, closing a Campfire council session.

The person brought this to the circle: "${topic}"
The session tone was: ${toneDesc}.

What was shared:
${thread}

Close the session with wisdom that:
1. Names one core truth that emerged from the circle
2. Offers one practical or emotional reflection the person can carry forward
3. Ends with one question or invitation — something to sit with

Keep it to 90–130 words. Speak as the Guide — warm, wise, slightly poetic. No bullet points. Flowing prose.`;
}

function buildCampfireQuestionPrompt(topic, closingText) {
  return `Based on this Campfire session topic: "${topic}"

And this closing reflection: "${closingText}"

Generate exactly one powerful reflection question the person can carry with them.
The question should be introspective, open-ended, and quietly challenging.
Return only the question — nothing else. No preamble. No explanation.`;
}

function appendCampfireEntry(advisorId, entryType, isLoading) {
  const advisor   = ADVISORS[advisorId];
  const avatarSrc = ADVISOR_AVATAR[advisorId];
  const color     = advisor ? advisor.color : '#6B7280';

  const avatarHtml = avatarSrc
    ? `<img src="${avatarSrc}" alt="${advisor.name}" class="campfire-entry-avatar-img">`
    : `<div class="campfire-entry-avatar-initial" style="background:${color}">${advisor.initial}</div>`;

  const typeLabel = CAMPFIRE_TYPE_LABELS[entryType] || 'Reflection';

  const entry = document.createElement('div');
  entry.className = 'campfire-entry';
  entry.id        = `centry-${advisorId}`;
  entry.innerHTML = `
    <div class="campfire-entry-header">
      <div class="campfire-entry-avatar">${avatarHtml}</div>
      <div class="campfire-entry-meta">
        <div class="campfire-entry-name">${advisor.name}</div>
        <div class="campfire-entry-role">${advisor.title}</div>
      </div>
      <div class="campfire-entry-type-badge">${typeLabel}</div>
    </div>
    <div class="campfire-entry-text${isLoading ? ' campfire-loading' : ''}" id="ctext-${advisorId}">
      ${isLoading ? '<span class="campfire-thinking">Listening…</span>' : ''}
    </div>`;

  document.getElementById('campfire-entries').appendChild(entry);
  document.querySelector('.campfire-stream').scrollTop = 9999;
  return entry;
}

async function callCampfireAPI(systemPrompt, userPrompt, maxTokens = 300) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.content[0].text.trim();
}

async function runCampfire(topic) {
  if (campfireRunning) return;
  const advisorIds = getCampfireAdvisors();
  if (!advisorIds.length) { showNotice('Please select at least one voice.'); return; }

  campfireRunning = true;

  // Switch to session phase
  document.getElementById('campfire-setup-phase').style.display = 'none';
  document.getElementById('campfire-session-phase').style.display = '';
  document.getElementById('campfire-entries').innerHTML = '';
  document.getElementById('campfire-closing').style.display = 'none';
  document.getElementById('campfire-question-card').style.display = 'none';
  document.getElementById('campfire-atmosphere').style.display = 'none';

  // Topic card
  document.getElementById('campfire-topic-card').textContent = topic;

  // Opening atmosphere line
  await new Promise(r => setTimeout(r, 300));
  const atmEl = document.getElementById('campfire-atmosphere');
  document.getElementById('campfire-atmosphere-text').textContent = CAMPFIRE_OPENINGS[campfireTone];
  atmEl.style.display = '';

  const priorTexts = [];

  // ── Advisor reflections ───────────────────────────────────────────
  for (const advisorId of advisorIds) {
    // Assign entry type — one advisor gets parable type
    let entryType = CAMPFIRE_ENTRY_TYPES[advisorId] || 'reflection';
    if (advisorId === CAMPFIRE_PARABLE_ADVISOR && advisorIds.length >= 3) {
      entryType = 'parable';
    }

    appendCampfireEntry(advisorId, entryType, true);

    try {
      const advisor = ADVISORS[advisorId];
      const system  = buildCampfireEntryPrompt(advisor, topic, campfireTone, entryType, priorTexts);
      const text    = await callCampfireAPI(system, `Share your ${entryType} on: ${topic}`);

      priorTexts.push(`${advisor.name}: "${text}"`);

      const textEl = document.getElementById(`ctext-${advisorId}`);
      textEl.classList.remove('campfire-loading');
      textEl.textContent = text;
    } catch (e) {
      const textEl = document.getElementById(`ctext-${advisorId}`);
      textEl.classList.remove('campfire-loading');
      textEl.textContent = 'Unable to share.';
    }
    document.querySelector('.campfire-stream').scrollTop = 9999;
  }

  // ── Closing from Guide ────────────────────────────────────────────
  const closingEl = document.getElementById('campfire-closing');
  closingEl.style.display = '';

  // Set guide avatar in closing card
  const closingAvatarEl = document.getElementById('campfire-closing-avatar');
  const guideAvatar = ADVISOR_AVATAR['guide'];
  closingAvatarEl.innerHTML = guideAvatar
    ? `<img src="${guideAvatar}" alt="Guide" style="width:40px;height:40px;border-radius:50%;object-fit:cover;"
        onerror="this.parentElement.innerHTML='<div class=campfire-closing-avatar-initial>G</div>'">`
    : `<div class="campfire-closing-avatar-initial">G</div>`;

  document.getElementById('campfire-closing-text').innerHTML =
    '<span class="campfire-thinking">Reflecting…</span>';
  document.querySelector('.campfire-stream').scrollTop = 9999;

  let closingText = '';
  try {
    const system  = buildCampfireClosingPrompt(topic, campfireTone, priorTexts);
    closingText   = await callCampfireAPI(system, 'Close the campfire session.', 350);
    document.getElementById('campfire-closing-text').textContent = closingText;
  } catch (e) {
    document.getElementById('campfire-closing-text').textContent = 'Unable to close the session.';
  }

  // ── Reflection question ───────────────────────────────────────────
  if (closingText) {
    try {
      const system   = buildCampfireQuestionPrompt(topic, closingText);
      const question = await callCampfireAPI(system, 'Generate the reflection question.', 80);
      const qCard    = document.getElementById('campfire-question-card');
      document.getElementById('campfire-question-text').textContent = question;
      qCard.style.display = '';
    } catch (e) { /* skip silently */ }
  }

  document.querySelector('.campfire-stream').scrollTop = 9999;
  campfireRunning = false;
}

// ── Voting Mode ───────────────────────────────────────────────────

let votingType        = 'yes-no';
let votingAdvisorMode = 'all';
let votingRunning     = false;

const VOTING_ALL_ADVISORS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];

function openVoting() {
  votingRunning     = false;
  votingType        = 'yes-no';
  votingAdvisorMode = 'all';
  document.querySelectorAll('.voting-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.vtype === 'yes-no'));
  document.getElementById('va-btn-all').classList.add('active');
  document.getElementById('va-btn-select').classList.remove('active');
  document.getElementById('voting-advisor-chips').style.display = 'none';
  document.querySelectorAll('.voting-advisor-check').forEach(c => c.checked = true);
  document.getElementById('voting-question').value = '';
  document.getElementById('voting-setup-phase').style.display = '';
  document.getElementById('voting-results-phase').style.display = 'none';
  renderVotingOptionsArea();
  document.getElementById('voting-overlay').classList.add('open');
  setTimeout(() => document.getElementById('voting-question').focus(), 100);
}

function closeVoting() {
  document.getElementById('voting-overlay').classList.remove('open');
}

function renderVotingOptionsArea() {
  const area = document.getElementById('voting-options-area');
  if (votingType === 'yes-no') {
    area.innerHTML = `
      <div class="voting-field-label">Options</div>
      <div class="voting-yn-display">
        <span class="voting-yn-pill">Yes</span>
        <span class="voting-yn-pill">No</span>
      </div>`;
  } else if (votingType === 'ab') {
    area.innerHTML = `
      <div class="voting-field-label">Options</div>
      <div class="voting-ab-inputs">
        <input class="voting-option-input" id="vo-a" placeholder="Option A" />
        <input class="voting-option-input" id="vo-b" placeholder="Option B" />
      </div>`;
  } else {
    area.innerHTML = `
      <div class="voting-field-label">Options <span class="voting-field-sub">(2–5)</span></div>
      <div class="voting-mc-inputs" id="mc-options-list">
        <input class="voting-option-input" data-mc placeholder="Option 1" />
        <input class="voting-option-input" data-mc placeholder="Option 2" />
      </div>
      <button class="voting-add-option-btn" id="voting-add-option">+ Add Option</button>`;
    document.getElementById('voting-add-option').addEventListener('click', addVotingOption);
  }
}

function addVotingOption() {
  const list  = document.getElementById('mc-options-list');
  const count = list.querySelectorAll('input').length;
  if (count >= 5) return;
  const inp = document.createElement('input');
  inp.className   = 'voting-option-input';
  inp.placeholder = `Option ${count + 1}`;
  inp.setAttribute('data-mc', '');
  list.appendChild(inp);
  if (count + 1 >= 5) document.getElementById('voting-add-option').style.display = 'none';
}

function getVotingOptions() {
  if (votingType === 'yes-no') return ['Yes', 'No'];
  if (votingType === 'ab') {
    const a = (document.getElementById('vo-a')?.value.trim()) || 'Option A';
    const b = (document.getElementById('vo-b')?.value.trim()) || 'Option B';
    return [a, b];
  }
  return Array.from(document.querySelectorAll('#mc-options-list input[data-mc]'))
    .map(i => i.value.trim()).filter(v => v);
}

function getVotingAdvisors() {
  if (votingAdvisorMode === 'all') return VOTING_ALL_ADVISORS;
  return Array.from(document.querySelectorAll('.voting-advisor-check:checked')).map(c => c.value);
}

function buildVotePrompt(advisor, question, options) {
  const list = options.map((o, i) => `${i + 1}. ${o}`).join('\n');
  return `You are ${advisor.name}, the ${advisor.title}, casting your vote in a Tribe council session.

The question is: "${question}"

The options are:
${list}

Your task:
1. Choose exactly one option
2. Explain your reasoning in 50–80 words from your perspective as the ${advisor.title}
3. Be direct and decisive — this is a vote, not an essay
4. Stay completely in character

Respond in this exact format (nothing else):
VOTE: [write the option text exactly as shown above]
REASON: [your brief reasoning]`;
}

function buildVotingSummaryPrompt(question, votes, tally, result) {
  const voteLines = votes.map(v => `${v.advisor}: voted "${v.selectedOption}" — ${v.reasoning}`).join('\n');
  const tallyText = Object.entries(tally).map(([k, v]) => `${k}: ${v}`).join(', ');
  const outcome   = result.winningOption
    ? `${result.majorityType} — "${result.winningOption}" wins with ${tally[result.winningOption]} votes`
    : 'Split Council — no majority';
  return `You are the Guide. The Tribe has just voted on a decision.

Question: "${question}"
Final tally: ${tallyText}
Outcome: ${outcome}

How each advisor voted:
${voteLines}

Write a brief council wrap-up (70–100 words):
1. What the council favored and the main reason
2. The key concern from the minority
3. One grounding thought for the person making this decision

Speak as the Guide — warm, wise, direct. No bullet points. Flowing prose.`;
}

function parseVoteResponse(text, options) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let selectedOption = null;
  let reasoningLines = [];
  let inReason = false;

  for (const line of lines) {
    if (!inReason && line.toUpperCase().startsWith('VOTE:')) {
      const raw = line.slice(5).trim();
      selectedOption = options.find(o => o.toLowerCase() === raw.toLowerCase())
        || options.find(o => raw.toLowerCase().includes(o.toLowerCase()))
        || options[0];
    } else if (line.toUpperCase().startsWith('REASON:')) {
      inReason = true;
      reasoningLines.push(line.slice(7).trim());
    } else if (inReason) {
      reasoningLines.push(line);
    }
  }
  if (!selectedOption) selectedOption = options[0];
  const reasoning = reasoningLines.join(' ').trim() || text.trim();
  return { selectedOption, reasoning };
}

function computeVoteResult(votes, options) {
  const tally = {};
  options.forEach(o => tally[o] = 0);
  votes.forEach(v => {
    if (tally[v.selectedOption] !== undefined) tally[v.selectedOption]++;
    else tally[options[0]]++;
  });

  const sorted     = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const topCount   = sorted[0][1];
  const secondCount = sorted[1]?.[1] ?? 0;
  const total      = votes.length;

  let winningOption, majorityType;
  if (topCount === secondCount) {
    winningOption = null;
    majorityType  = 'split';
  } else {
    winningOption = sorted[0][0];
    const gap = topCount - secondCount;
    if (topCount === total)  majorityType = 'unanimous';
    else if (gap >= 3)       majorityType = 'clear';
    else if (gap === 1)      majorityType = 'narrow';
    else                     majorityType = 'majority';
  }
  return { winningOption, tally, majorityType, total };
}

const MAJORITY_LABELS = {
  unanimous: 'Unanimous',
  clear:     'Clear Majority',
  majority:  'Majority Vote',
  narrow:    'Narrow Majority',
  split:     'Split Council'
};

function renderVotingTally(tally, total) {
  const container = document.getElementById('voting-tally');
  const sorted    = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  container.innerHTML = sorted.map(([option, count]) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `<div class="vtally-row">
      <span class="vtally-option">${option}</span>
      <div class="vtally-bar-wrap"><div class="vtally-bar" style="width:0%" data-pct="${pct}"></div></div>
      <span class="vtally-count">${count}</span>
    </div>`;
  }).join('');
  // Animate bars
  requestAnimationFrame(() => {
    container.querySelectorAll('.vtally-bar').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  });
}

function appendVoteCard(advisorId, isLoading) {
  const advisor   = ADVISORS[advisorId];
  const avatarSrc = ADVISOR_AVATAR[advisorId];
  const color     = advisor ? advisor.color : '#6B7280';

  const avatarHtml = avatarSrc
    ? `<img src="${avatarSrc}" alt="${advisor.name}" class="vote-avatar-img">`
    : `<div class="vote-avatar-initial" style="background:${color}">${advisor.initial}</div>`;

  const card = document.createElement('div');
  card.className = 'vote-card';
  card.id        = `vcard-${advisorId}`;
  card.innerHTML = `
    <div class="vote-card-top">
      <div class="vote-avatar">${avatarHtml}</div>
      <div class="vote-advisor-info">
        <div class="vote-advisor-name">${advisor.name}</div>
        <div class="vote-advisor-role">${advisor.title}</div>
      </div>
      <div class="vote-badge vote-badge-loading" id="vbadge-${advisorId}">…</div>
    </div>
    <div class="vote-reasoning" id="vreason-${advisorId}">
      <span class="vote-thinking">Deliberating…</span>
    </div>`;

  document.getElementById('voting-cards').appendChild(card);
  return card;
}

async function runVoting() {
  if (votingRunning) return;

  const question = document.getElementById('voting-question').value.trim();
  if (!question) { showNotice('Please enter a question first.'); return; }

  const options = getVotingOptions();
  if (options.length < 2) { showNotice('Please add at least 2 options.'); return; }

  const advisorIds = getVotingAdvisors();
  if (!advisorIds.length) { showNotice('Please select at least one advisor.'); return; }

  votingRunning = true;

  // Switch to results phase
  document.getElementById('voting-setup-phase').style.display = 'none';
  document.getElementById('voting-results-phase').style.display = '';
  document.getElementById('voting-question-display').textContent = `"${question}"`;
  document.getElementById('voting-result-card').style.display = 'none';
  document.getElementById('voting-tally').innerHTML = '';
  document.getElementById('voting-cards').innerHTML = '';
  document.getElementById('voting-summary').style.display = 'none';

  const votes = [];

  // ── Generate votes sequentially ──────────────────────────────────
  for (const advisorId of advisorIds) {
    appendVoteCard(advisorId, true);
    try {
      const advisor = ADVISORS[advisorId];
      const system  = buildVotePrompt(advisor, question, options);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 200,
          system,
          messages: [{ role: 'user', content: `Vote on: ${question}` }]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const { selectedOption, reasoning } = parseVoteResponse(data.content[0].text, options);

      votes.push({ advisorId, advisor: advisor.name, role: advisor.title, selectedOption, reasoning });

      document.getElementById(`vbadge-${advisorId}`).textContent = selectedOption;
      document.getElementById(`vbadge-${advisorId}`).classList.remove('vote-badge-loading');
      document.getElementById(`vreason-${advisorId}`).textContent = reasoning;
    } catch (e) {
      document.getElementById(`vbadge-${advisorId}`).textContent = '?';
      document.getElementById(`vbadge-${advisorId}`).classList.remove('vote-badge-loading');
      document.getElementById(`vreason-${advisorId}`).textContent = 'Unable to vote.';
    }
  }

  // ── Show result card + tally ──────────────────────────────────────
  const result = computeVoteResult(votes, options);

  const resultCard = document.getElementById('voting-result-card');
  resultCard.style.display = '';
  document.getElementById('vrc-label').textContent   = MAJORITY_LABELS[result.majorityType] || 'Council Decision';
  document.getElementById('vrc-winner').textContent  = result.winningOption || 'Split Council';
  if (result.winningOption) {
    document.getElementById('vrc-count').textContent =
      `${result.tally[result.winningOption]} of ${result.total} votes`;
  } else {
    document.getElementById('vrc-count').textContent = 'No majority reached';
  }

  renderVotingTally(result.tally, result.total);

  // Scroll to top of results
  document.getElementById('voting-results-scroll') &&
    (document.querySelector('.voting-results-scroll').scrollTop = 0);

  // ── Guide summary ─────────────────────────────────────────────────
  const summaryEl = document.getElementById('voting-summary');
  summaryEl.style.display = '';
  document.getElementById('voting-summary-text').innerHTML =
    '<span class="vote-thinking">Summarizing…</span>';

  // Set guide avatar
  const guideAvatar = ADVISOR_AVATAR['guide'];
  const wrapEl = document.getElementById('vgs-avatar-wrap');
  if (guideAvatar) {
    wrapEl.innerHTML = `<img src="${guideAvatar}" alt="Guide" class="vgs-avatar-img"
      onerror="this.parentElement.innerHTML='<div class=vgs-avatar-initial>G</div>'">`;
  } else {
    wrapEl.innerHTML = `<div class="vgs-avatar-initial">G</div>`;
  }

  try {
    const summarySystem = buildVotingSummaryPrompt(question, votes, result.tally, result);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 250,
        system: summarySystem,
        messages: [{ role: 'user', content: 'Summarize the council vote.' }]
      })
    });
    const data = await res.json();
    document.getElementById('voting-summary-text').textContent = data.content[0].text;
  } catch (e) {
    document.getElementById('voting-summary-text').textContent = 'Unable to generate summary.';
  }

  votingRunning = false;
}

// ── Debate Mode ───────────────────────────────────────────────────

let debateRunning = false;

// Advisors used in debate rounds (fixed 4-person council)
const DEBATE_COUNCIL = ['marcus', 'emma', 'frank', 'seth'];

// Reply pairings: who replies to which initial message index
const DEBATE_REPLIES = [
  { advisorId: 'emma',   replyToIdx: 0 }, // Emma replies to Marcus
  { advisorId: 'frank',  replyToIdx: 1 }, // Frank replies to Emma
  { advisorId: 'marcus', replyToIdx: 2 }, // Marcus replies to Frank
];

function openDebate() {
  debateRunning = false;
  document.getElementById('debate-input-phase').style.display = '';
  document.getElementById('debate-thread-phase').style.display = 'none';
  document.getElementById('debate-topic-input').value = '';
  document.getElementById('debate-thread').innerHTML = '';
  document.getElementById('debate-overlay').classList.add('open');
  setTimeout(() => document.getElementById('debate-topic-input').focus(), 100);
}

function closeDebate() {
  document.getElementById('debate-overlay').classList.remove('open');
}

function buildDebateInitPrompt(advisor, topic, priorMessages) {
  const prior = priorMessages.length
    ? '\n\nOther advisors have already shared:\n' +
      priorMessages.map(m => `${m.advisor} (${m.role}): "${m.text}"`).join('\n') +
      '\n\nDo not repeat their points. Bring your unique angle.'
    : '';
  return `You are ${advisor.name}, the ${advisor.title}, participating in a structured Tribe Debate.

The topic is: "${topic}"

Give your initial position on this topic from your unique perspective as the ${advisor.title}. Be direct, take a clear stance.${prior}

Keep your response to 80–120 words. Write as natural speech — no headers or bullet points. Stay completely in character.`;
}

function buildDebateReplyPrompt(advisor, topic, replyToMsg, allMessages) {
  const thread = allMessages.map(m => `${m.advisor} (${m.role}): "${m.text}"`).join('\n\n');
  return `You are ${advisor.name}, the ${advisor.title}, in a structured Tribe Debate.

The topic is: "${topic}"

The discussion so far:
${thread}

Now respond to what ${replyToMsg.advisor} said: "${replyToMsg.text}"

React from your lens as the ${advisor.title}. You may agree, respectfully disagree, or add important nuance. Reference their specific point.

Keep your response to 60–100 words. Write as natural speech — no headers or bullet points. Stay in character.`;
}

function buildDebateSummaryPrompt(topic, allMessages) {
  const thread = allMessages.map(m => {
    const reply = m.replyTo ? ` (replying to ${m.replyTo})` : '';
    return `${m.advisor} (${m.role})${reply}: "${m.text}"`;
  }).join('\n\n');
  return `You are the Guide — a wise personal mentor. You have been observing a Tribe Debate.

The topic was: "${topic}"

The debate:
${thread}

Write a brief, insightful summary covering:
1. The key perspectives raised
2. Where the advisors found common ground
3. Where they genuinely disagreed
4. One reflection question for the person to sit with

Keep the summary to 120–150 words. Speak warmly and synthetically, as the Guide. No bullet points — flowing prose.`;
}

function appendDebateMessage(msg, isLoading) {
  const thread   = document.getElementById('debate-thread');
  const advisor  = ADVISORS[msg.advisorId];
  const avatarSrc = ADVISOR_AVATAR[msg.advisorId];
  const color    = advisor ? advisor.color : '#6B7280';
  const initial  = advisor ? advisor.initial : msg.advisor[0];

  const wrap = document.createElement('div');
  wrap.className = 'debate-msg' +
    (msg.replyTo  ? ' debate-reply'   : '') +
    (msg.isSummary ? ' debate-summary' : '');

  const avatarHtml = avatarSrc
    ? `<img src="${avatarSrc}" alt="${msg.advisor}" class="debate-avatar-img">`
    : `<div class="debate-avatar-initial" style="background:${color}">${initial}</div>`;

  const replyLabel = msg.replyTo
    ? `<div class="debate-reply-label">↳ replying to ${msg.replyTo}</div>`
    : '';

  const bodyText = isLoading
    ? `<span class="debate-thinking">Thinking…</span>`
    : msg.text;

  wrap.innerHTML = `
    <div class="debate-avatar">${avatarHtml}</div>
    <div class="debate-content">
      ${replyLabel}
      <div class="debate-name">${msg.advisor}<span class="debate-role">${msg.role}</span></div>
      <div class="debate-text${isLoading ? ' debate-loading' : ''}">${bodyText}</div>
    </div>`;

  thread.appendChild(wrap);
  thread.scrollTop = thread.scrollHeight;
  return wrap;
}

async function callDebateAPI(systemPrompt, userPrompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 350,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

async function runDebate(topic) {
  if (debateRunning) return;
  debateRunning = true;

  document.getElementById('debate-input-phase').style.display = 'none';
  document.getElementById('debate-thread-phase').style.display = '';
  document.getElementById('debate-topic-banner').textContent = `"${topic}"`;
  document.getElementById('debate-thread').innerHTML = '';

  const messages = [];

  // ── Round 1: Initial positions ─────────────────────────────────
  for (const advisorId of DEBATE_COUNCIL) {
    const advisor = ADVISORS[advisorId];
    const card = appendDebateMessage(
      { advisorId, advisor: advisor.name, role: advisor.title, replyTo: null, isSummary: false },
      true
    );
    try {
      const system = buildDebateInitPrompt(advisor, topic, messages);
      const text   = await callDebateAPI(system, `Give your position on: ${topic}`);
      const msg    = { advisorId, advisor: advisor.name, role: advisor.title, text, replyTo: null };
      messages.push(msg);
      const textEl = card.querySelector('.debate-text');
      textEl.classList.remove('debate-loading');
      textEl.textContent = text;
    } catch (e) {
      card.querySelector('.debate-text').textContent = 'Unable to respond.';
    }
    document.getElementById('debate-thread').scrollTop = 9999;
  }

  // ── Round 2: Cross-advisor replies ─────────────────────────────
  for (const { advisorId, replyToIdx } of DEBATE_REPLIES) {
    const advisor    = ADVISORS[advisorId];
    const replyToMsg = messages[replyToIdx];
    if (!replyToMsg) continue;
    const card = appendDebateMessage(
      { advisorId, advisor: advisor.name, role: advisor.title, replyTo: replyToMsg.advisor, isSummary: false },
      true
    );
    try {
      const system = buildDebateReplyPrompt(advisor, topic, replyToMsg, messages);
      const text   = await callDebateAPI(system, `Reply to ${replyToMsg.advisor}'s point.`);
      const msg    = { advisorId, advisor: advisor.name, role: advisor.title, text, replyTo: replyToMsg.advisor };
      messages.push(msg);
      const textEl = card.querySelector('.debate-text');
      textEl.classList.remove('debate-loading');
      textEl.textContent = text;
    } catch (e) {
      card.querySelector('.debate-text').textContent = 'Unable to respond.';
    }
    document.getElementById('debate-thread').scrollTop = 9999;
  }

  // ── Summary: Guide ─────────────────────────────────────────────
  const guide = ADVISORS['guide'];
  const summaryCard = appendDebateMessage(
    { advisorId: 'guide', advisor: 'Guide', role: 'Your Personal Guide', replyTo: null, isSummary: true },
    true
  );
  try {
    const system = buildDebateSummaryPrompt(topic, messages);
    const text   = await callDebateAPI(system, 'Summarize this debate.');
    const textEl = summaryCard.querySelector('.debate-text');
    textEl.classList.remove('debate-loading');
    textEl.textContent = text;
  } catch (e) {
    summaryCard.querySelector('.debate-text').textContent = 'Unable to generate summary.';
  }
  document.getElementById('debate-thread').scrollTop = 9999;

  debateRunning = false;
}

// ── Dark Mode ─────────────────────────────────────────────────────

function applyDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  // Mobile label update
  const mobLabel = document.querySelector('#m-btn-dark-mode .dark-mode-label');
  if (mobLabel) mobLabel.textContent = on ? 'Light Mode' : 'Dark Mode';
}

function toggleDarkMode() {
  const isDark = document.body.classList.contains('dark-mode');
  applyDarkMode(!isDark);
  localStorage.setItem('tribe_dark_mode', String(!isDark));
}

// ── Mobile nav ────────────────────────────────────────────────────

function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
}

function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}
