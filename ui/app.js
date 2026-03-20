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
    title: 'The Spiritual Advisor',
    desc: 'Meaning, purpose, values & inner alignment',
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
    title: 'The Mindset Advisor',
    desc: 'Thinking patterns, beliefs, discipline & mental strength',
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
    title: 'The Emotional Advisor',
    desc: 'Emotional awareness, empathy & inner balance',
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
    title: 'The Health Advisor',
    desc: 'Introspection, self-examination & personal growth',
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
    title: 'The Relationship Advisor',
    desc: 'Relationships, communication, trust & boundaries',
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
    title: 'The Financial Advisor',
    desc: 'Practicality, honest feedback & real-world results',
    initial: 'F',
    color: '#4F46E5',
    system: `You are Frank, the Financial Advisor in the My Tribe app.

Your role is to help people make smart financial decisions and think clearly about the monetary implications of their choices. You focus on budgeting, investing, financial planning, risk, and building long-term wealth and security.

Speak practically, clearly, and with financial insight. Be direct about trade-offs, numbers, and consequences. You often consider whether a decision makes financial sense in the short and long term, and whether the user is thinking clearly about money.

Keep your response to 3–5 sentences. Stay in character.`
  },

  guide: {
    id: 'guide',
    name: 'Don M',
    title: 'Your Custom Advisor',
    desc: 'Personalized guidance & unique perspectives',
    initial: 'D',
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
   knowledge.advisorRegistry, knowledge.bookLessons,
   knowledge.about, knowledge.stories] = await Promise.all([
    fetchText('../tribe-brain/context-loader.md'),
    fetchText('../tribe-brain/constitution.md'),
    fetchText('../tribe-brain/guide-setup.md'),
    fetchText('../tribe-brain/advisor-registry.md'),
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

  initStories();
  applyAdvisorNames();
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

// ── Language System ───────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳', dir: 'ltr' },
  { code: 'tl', label: 'Tagalog',    flag: '🇵🇭', dir: 'ltr' },
];

let currentLang = 'en';

function loadLanguage() {
  const saved = localStorage.getItem('tribe_lang');
  const found = LANGUAGES.find(l => l.code === saved);
  currentLang = found ? found.code : 'en';
  applyLanguage(currentLang, false);
}

function applyLanguage(code, save = true) {
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  currentLang = lang.code;
  document.documentElement.setAttribute('lang', lang.code);
  document.documentElement.setAttribute('dir', lang.dir);
  const triggerFlag = document.getElementById('lang-trigger-flag');
  if (triggerFlag) triggerFlag.textContent = lang.flag;
  if (save) localStorage.setItem('tribe_lang', lang.code);
}

function selectLanguage(code) {
  applyLanguage(code);
  triggerGoogleTranslate(code);
  closeLangDropdown();
  renderMobileLangOptions();
}

function triggerGoogleTranslate(langCode) {
  // Google Translate uses a hidden <select> to switch languages.
  // For English (the source language) we reset via the cookie instead.
  if (langCode === 'en') {
    // Clear the googtrans cookie and reload to revert to original text
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
    location.reload();
    return;
  }
  // Give the widget up to 2 s to finish loading, then trigger
  const attempt = (tries) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else if (tries > 0) {
      setTimeout(() => attempt(tries - 1), 200);
    }
  };
  attempt(10);
}

function openLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  const trigger  = document.getElementById('lang-trigger');
  if (!dropdown) return;
  renderLangDropdownOptions();
  dropdown.style.display = '';
  trigger?.setAttribute('aria-expanded', 'true');
  // Focus first option
  setTimeout(() => dropdown.querySelector('.lang-option')?.focus(), 50);
}

function closeLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  const trigger  = document.getElementById('lang-trigger');
  if (dropdown) dropdown.style.display = 'none';
  trigger?.setAttribute('aria-expanded', 'false');
}

function toggleLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  if (!dropdown) return;
  (dropdown.style.display === 'none' || !dropdown.style.display)
    ? openLangDropdown() : closeLangDropdown();
}

function renderLangDropdownOptions() {
  const dropdown = document.getElementById('lang-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = LANGUAGES.map(l =>
    `<button class="lang-option${l.code === currentLang ? ' active' : ''}"
       data-lang="${l.code}"
       role="option"
       aria-selected="${l.code === currentLang}">
      <span class="lang-option-flag" aria-hidden="true">${l.flag}</span>
      <span class="lang-option-label">${esc(l.label)}</span>
    </button>`
  ).join('');
  dropdown.querySelectorAll('.lang-option').forEach(btn =>
    btn.addEventListener('click', () => selectLanguage(btn.dataset.lang))
  );
}

function renderMobileLangOptions() {
  const container = document.getElementById('mobile-lang-options');
  if (!container) return;
  container.innerHTML = LANGUAGES.map(l =>
    `<button class="mobile-lang-option${l.code === currentLang ? ' active' : ''}" data-lang="${l.code}">
      <span class="mobile-lang-option-flag" aria-hidden="true">${l.flag}</span>
      <span>${esc(l.label)}</span>
    </button>`
  ).join('');
  container.querySelectorAll('.mobile-lang-option').forEach(btn =>
    btn.addEventListener('click', () => { closeMobileNav(); selectLanguage(btn.dataset.lang); })
  );
}

// ── State ────────────────────────────────────────────────────────

const state = {
  mode: 'member',
  selectedAdvisors: new Set(),
  isLoading: false,
  stopped: false,
  currentConvId: null,
  bookContext: null,   // set when continuing from a Book Lesson
  lastSpeakers: [],    // tracks who last responded for mention routing
  streamController: null,
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

  // Language selector — init
  loadLanguage();
  renderMobileLangOptions();
  document.getElementById('lang-trigger').addEventListener('click', e => {
    e.stopPropagation();
    toggleLangDropdown();
  });
  document.addEventListener('click', e => {
    if (!document.getElementById('lang-selector')?.contains(e.target)) closeLangDropdown();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLangDropdown();
  });

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

  // Onboarding guide pills (guarded — some may be removed from DOM)
  const _guideChat = document.getElementById('btn-guide-chat');
  if (_guideChat) _guideChat.addEventListener('click', () => openGuide('chat-guide-overlay'));
  const _guideSessions = document.getElementById('btn-guide-sessions');
  if (_guideSessions) _guideSessions.addEventListener('click', () => openGuide('sessions-guide-overlay'));
  const _guideStories = document.getElementById('btn-guide-stories');
  if (_guideStories) _guideStories.addEventListener('click', () => openGuide('stories-guide-overlay'));
  document.getElementById('chat-guide-close').addEventListener('click', () => closeGuide('chat-guide-overlay'));
  document.getElementById('sessions-guide-close').addEventListener('click', () => closeGuide('sessions-guide-overlay'));
  document.getElementById('stories-guide-close').addEventListener('click', () => closeGuide('stories-guide-overlay'));
  ['chat-guide-overlay','sessions-guide-overlay','stories-guide-overlay'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => { if (e.target.id === id) closeGuide(id); });
  });

  // Advice page — utility menu
  document.getElementById('btn-advice-help').addEventListener('click', openAdviceHelp);
  document.getElementById('btn-advice-history').addEventListener('click', openHistoryPanel);
  document.getElementById('btn-advice-favorites').addEventListener('click', () => openHistoryPanel(true));

  // History filter tabs (inside history modal)
  document.querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.history-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderHistoryList(btn.dataset.filter === 'favorites');
    });
  });

  // Feature page utility menus — Debate
  document.getElementById('btn-debate-util-help').addEventListener('click', () => openPageHelp('debate'));
  document.getElementById('btn-debate-util-history').addEventListener('click', () => openDebateHistory(false));
  document.getElementById('btn-debate-util-favorites').addEventListener('click', () => openDebateHistory(true));

  // Feature page utility menus — Polls
  document.getElementById('btn-polls-util-help').addEventListener('click', () => openPageHelp('polls'));
  document.getElementById('btn-polls-util-history').addEventListener('click', () => openPollsHistory(false));
  document.getElementById('btn-polls-util-favorites').addEventListener('click', () => openPollsHistory(true));
  document.getElementById('btn-polls-util-new').addEventListener('click', resetVoting);
  document.getElementById('polls-history-close').addEventListener('click', closePollsHistory);
  document.getElementById('polls-history-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closePollsHistory();
  });
  document.getElementById('polls-history-overlay').querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('polls-history-overlay').querySelectorAll('.history-filter-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      openPollsHistory(btn.dataset.pollFilter === 'favorites');
    });
  });

  // Feature page utility menus — Campfire
  document.getElementById('btn-campfire-util-help').addEventListener('click', () => openPageHelp('campfire'));
  document.getElementById('btn-campfire-util-history').addEventListener('click', () => openCampfireHistory(false));
  document.getElementById('btn-campfire-util-favorites').addEventListener('click', () => openCampfireHistory(true));
  document.getElementById('campfire-history-close').addEventListener('click', closeCampfireHistory);
  document.getElementById('campfire-history-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCampfireHistory();
  });
  document.getElementById('campfire-history-overlay').querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => openCampfireHistory(btn.dataset.cfFilter === 'favorites'));
  });

  // Feature page utility menus — Book Lessons
  document.getElementById('btn-bl-util-help').addEventListener('click', () => openPageHelp('book-lessons'));
  document.getElementById('btn-bl-util-history').addEventListener('click', blOpenHistory);
  document.getElementById('btn-bl-util-favorites').addEventListener('click', blOpenFavorites);
  document.getElementById('btn-bl-util-search').addEventListener('click', () => blShowPhase('bl-search-phase'));

  // Help modal close
  document.getElementById('help-close').addEventListener('click', closeAdviceHelp);
  document.getElementById('help-overlay').addEventListener('click', e => { if (e.target.id === 'help-overlay') closeAdviceHelp(); });

  // Suggestions
  renderSuggestions();

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


  // Navigation — coming soon items (desktop + mobile)
  const comingSoon = [
    'btn-onboarding',
    'm-btn-onboarding',
    'btn-spiritual-lessons',
    'm-btn-spiritual-lessons'
  ];
  comingSoon.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { closeMobileNav(); showNotice('Coming soon.'); });
  });

  // Advice — nav buttons (desktop + mobile)
  function goToAdvice() {
    closeHomePage();
    closeVoting();
    closeDebate();
    closeCampfire();
    closeBookLessons();
    closeCoreLessons();
    document.getElementById('main-layout').style.display = '';
  }
  document.getElementById('btn-advice').addEventListener('click', goToAdvice);
  document.getElementById('m-btn-advice').addEventListener('click', () => { closeMobileNav(); goToAdvice(); });

  // Debate — nav buttons (desktop + mobile)
  document.getElementById('btn-debate').addEventListener('click', openDebate);
  document.getElementById('m-btn-debate').addEventListener('click', () => { closeMobileNav(); openDebate(); });

  // Debate — page controls
  document.getElementById('btn-debate-util-new').addEventListener('click', resetDebate);
  document.getElementById('debate-history-close').addEventListener('click', closeDebateHistory);
  document.getElementById('debate-history-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDebateHistory();
  });
  // Debate history filter tabs
  document.getElementById('debate-history-overlay').querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('debate-history-overlay').querySelectorAll('.history-filter-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      openDebateHistory(btn.dataset.debateFilter === 'favorites');
    });
  });

  const $debateInput   = document.getElementById('debate-input');
  const $debateSendBtn = document.getElementById('debate-send-btn');

  $debateInput.addEventListener('input', () => {
    $debateSendBtn.disabled = !$debateInput.value.trim() || debateRunning;
    $debateInput.style.height = 'auto';
    $debateInput.style.height = $debateInput.scrollHeight + 'px';
  });
  $debateInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitDebate();
    }
  });
  $debateSendBtn.addEventListener('click', () => {
    if (debateRunning) stopDebate();
    else submitDebate();
  });

  // Debate suggestions rendered dynamically by renderDebateSuggestions()

  // Campfire — nav buttons (desktop + mobile)
  document.getElementById('btn-campfire').addEventListener('click', openCampfire);
  document.getElementById('m-btn-campfire').addEventListener('click', () => { closeMobileNav(); openCampfire(); });

  // Campfire — exit button (session view)
  document.getElementById('cf-exit-session-btn').addEventListener('click', closeCampfire);

  // Campfire — storyteller selection
  document.querySelectorAll('.cf-storyteller-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.cf-storyteller-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      cfStoryteller = card.dataset.storyteller;
      const picker = document.getElementById('campfire-advisor-picker');
      if (cfStoryteller === 'advisor') {
        picker.style.display = '';
        renderCfAdvisorPicker();
      } else {
        picker.style.display = 'none';
        cfAdvisorId = null;
      }
      updateCfStep1Next();
    });
  });

  // Campfire — step navigation
  document.getElementById('cf-step1-next').addEventListener('click', () => cfGoToStep(2));
  document.getElementById('cf-step2-back').addEventListener('click', () => cfGoToStep(1));
  document.getElementById('cf-step2-next').addEventListener('click', () => cfGoToStep(3));
  document.getElementById('cf-step3-back').addEventListener('click', () => cfGoToStep(2));

  // Campfire — pillar selection
  document.querySelectorAll('.cf-pillar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cf-pillar-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cfPillar = btn.dataset.pillar;
      document.getElementById('cf-step2-next').disabled = false;
    });
  });

  // Campfire — format selection
  document.querySelectorAll('.cf-format-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.cf-format-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      cfFormat = card.dataset.format;
      document.getElementById('campfire-start-btn').disabled = false;
    });
  });

  // Campfire — start session
  document.getElementById('campfire-start-btn').addEventListener('click', startCampfireSession);

  // Campfire — new session (util menu link)
  document.getElementById('btn-campfire-util-new').addEventListener('click', () => {
    resetCampfireSetup();
    document.getElementById('campfire-session').style.display = 'none';
    document.getElementById('campfire-setup').style.display = '';
  });

  // Campfire — discussion toggle / drawer
  document.getElementById('cf-discussion-toggle').addEventListener('click', cfToggleDiscussion);
  document.getElementById('cf-drawer-open-btn').addEventListener('click', cfOpenDrawer);
  document.getElementById('cf-discussion-close').addEventListener('click', cfCloseDrawer);
  document.getElementById('cf-drawer-backdrop').addEventListener('click', cfCloseDrawer);

  // Campfire — save story
  document.getElementById('cf-save-story-btn').addEventListener('click', saveCampfireStory);

  // Campfire — user story submission
  document.getElementById('campfire-share-story-btn').addEventListener('click', () => {
    const text = document.getElementById('campfire-user-story-text').value.trim();
    if (!text) { showNotice('Please share your story first.'); return; }
    submitUserStory(text);
  });

  // Campfire — comment send
  document.getElementById('campfire-comment-send').addEventListener('click', sendCampfireComment);
  document.getElementById('campfire-comment-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCampfireComment(); }
  });

  // Dark Mode — desktop + mobile toggle
  document.getElementById('btn-dark-mode').addEventListener('click', toggleDarkMode);
  document.getElementById('m-btn-dark-mode').addEventListener('click', () => { closeMobileNav(); toggleDarkMode(); });

  // Restore dark mode preference on load
  if (localStorage.getItem('tribe_dark_mode') === 'true') applyDarkMode(true);

  // Voting — nav buttons (desktop + mobile)
  document.getElementById('btn-voting').addEventListener('click', openVoting);
  document.getElementById('m-btn-voting').addEventListener('click', () => { closeMobileNav(); openVoting(); });

  // Voting — page controls
  document.getElementById('voting-start-btn').addEventListener('click', runVoting);

  // Voting — type buttons
  document.querySelectorAll('.voting-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      votingType = btn.dataset.vtype;
      document.querySelectorAll('.voting-type-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderVotingOptionsArea();
    });
  });

  // Voting — new vote
  // voting-new-btn removed from HTML; New is in util menu (btn-polls-util-new → resetVoting)

  // Stories — bell toggles panel
  // Stories — bell toggle
  document.getElementById('btn-stories-nav').addEventListener('click', e => {
    e.stopPropagation();
    toggleStoriesPanel();
  });
  document.getElementById('btn-life-stories-nav').addEventListener('click', e => {
    e.stopPropagation();
    toggleStoriesPanel();
  });
  document.getElementById('m-btn-life-stories-nav').addEventListener('click', () => { closeMobileNav(); toggleStoriesPanel(); });

  // Stories — close panel when clicking outside
  document.addEventListener('click', e => {
    const panel = document.getElementById('stories-panel');
    const wrap  = document.querySelector('.stories-bell-wrap');
    if (panel.classList.contains('open') && !wrap.contains(e.target)) {
      closeStoriesPanel();
    }
  });

  // Stories — library button in panel
  document.getElementById('stories-library-btn').addEventListener('click', e => {
    e.stopPropagation();
    openStoryLibrary();
  });

  // Stories — viewer: close, save, keyboard
  document.getElementById('story-close').addEventListener('click', closeStoryViewer);
  document.getElementById('story-save-btn').addEventListener('click', saveStoryToLibrary);
  document.addEventListener('keydown', e => {
    if (!document.getElementById('story-viewer').classList.contains('open')) return;
    if (e.key === 'Escape') closeStoryViewer();
  });

  // Stories — library modal
  document.getElementById('story-library-close').addEventListener('click', closeStoryLibrary);
  document.getElementById('story-library-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeStoryLibrary();
  });
  document.querySelectorAll('.story-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => renderStoryLibrary(btn.dataset.filter));
  });

  // New Story — toggle panel + generate
  document.getElementById('story-new-btn').addEventListener('click', toggleStoryCreatePanel);
  document.getElementById('story-create-btn').addEventListener('click', createNewBlogStory);

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

  // Core Lessons — nav buttons (desktop + mobile)
  document.getElementById('btn-core-lessons').addEventListener('click', openCoreLessons);
  document.getElementById('m-btn-core-lessons').addEventListener('click', () => { closeMobileNav(); openCoreLessons(); });

  // Core Lessons — library modal
  document.getElementById('cl-library-modal-close').addEventListener('click', clCloseLibraryModal);
  document.getElementById('cl-library-overlay').addEventListener('click', e => {
    if (e.target.id === 'cl-library-overlay') clCloseLibraryModal();
  });
  document.getElementById('cl-library-overlay').querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('cl-library-overlay').querySelectorAll('.history-filter-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      clRenderLibrary(btn.dataset.clFilter);
    });
  });

  // Core Lessons — search
  document.getElementById('cl-search-btn').addEventListener('click', clSearch);
  document.getElementById('cl-lesson-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') clSearch();
  });

  // Core Lessons — util menu
  document.getElementById('btn-cl-util-help').addEventListener('click', () => openPageHelp('core-lessons'));
  document.getElementById('btn-cl-util-history').addEventListener('click', () => clOpenLibraryModal('history'));
  document.getElementById('btn-cl-util-favorites').addEventListener('click', () => clOpenLibraryModal('favorites'));
  document.getElementById('btn-cl-util-search').addEventListener('click', () => { clShowPhase('cl-search-phase'); setTimeout(() => document.getElementById('cl-lesson-input').focus(), 50); });

  // Core Lessons — back to topics
  document.getElementById('cl-back-to-topics').addEventListener('click', clBackToTopics);

  // Core Lessons — save lesson
  document.getElementById('cl-save-btn').addEventListener('click', clSaveLesson);

  // Core Lessons — chat
  document.getElementById('cl-chat-send').addEventListener('click', clSendChat);
  document.getElementById('cl-chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') clSendChat();
  });

  // Core Lessons — Discussion panel toggle (desktop) + drawer (mobile)
  document.getElementById('cl-discussion-toggle').addEventListener('click', clToggleDiscussion);
  document.getElementById('cl-drawer-open-btn').addEventListener('click', clOpenDrawer);
  document.getElementById('cl-chat-close').addEventListener('click', clCloseDrawer);
  document.getElementById('cl-drawer-backdrop').addEventListener('click', clCloseDrawer);

  // Book Lessons — nav buttons (desktop + mobile)
  document.getElementById('btn-book-lessons').addEventListener('click', openBookLessons);
  document.getElementById('m-btn-book-lessons').addEventListener('click', () => { closeMobileNav(); openBookLessons(); });

  // Book Library modal — close button + backdrop
  document.getElementById('bl-library-modal-close').addEventListener('click', blCloseLibraryModal);
  document.getElementById('bl-library-overlay').addEventListener('click', e => {
    if (e.target.id === 'bl-library-overlay') blCloseLibraryModal();
  });
  // Book Library modal — filter tabs
  document.getElementById('bl-library-overlay').querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('bl-library-overlay').querySelectorAll('.history-filter-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      blRenderLibrary(btn.dataset.blFilter);
    });
  });

  // Book Lessons — search
  document.getElementById('bl-search-btn').addEventListener('click', blSearchBook);
  document.getElementById('bl-book-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') blSearchBook();
  });

  // Book Lessons — confirm phase
  document.getElementById('bl-confirm-start-btn').addEventListener('click', blStartLesson);
  document.getElementById('bl-search-again-btn').addEventListener('click', () => blShowPhase('bl-search-phase'));
  document.getElementById('bl-synopsis-close').addEventListener('click', blCloseSynopsis);
  document.getElementById('bl-synopsis-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) blCloseSynopsis(); });
  document.getElementById('btn-bl-util-popular').addEventListener('click', blOpenPopular);
  document.getElementById('bl-popular-close').addEventListener('click', blClosePopular);
  document.getElementById('bl-popular-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) blClosePopular(); });

  // Book Lessons — chapters toggle
  document.getElementById('bl-chapters-toggle').addEventListener('click', () => {
    const content = document.getElementById('bl-chapters-content');
    const icon    = document.querySelector('#bl-chapters-toggle .bl-toggle-icon');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? '' : 'none';
    icon?.classList.toggle('open', isHidden);
  });

  // Book Lessons — back to topics
  document.getElementById('bl-back-to-topics').addEventListener('click', blBackToTopics);

  // Book Lessons — save book
  document.getElementById('bl-save-btn').addEventListener('click', blSaveBook);

  // Book Lessons — chat
  document.getElementById('bl-chat-send').addEventListener('click', blSendChat);
  document.getElementById('bl-chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') blSendChat();
  });

  // Book Lessons — Discussion panel toggle (desktop) + drawer (mobile)
  document.getElementById('bl-discussion-toggle').addEventListener('click', blToggleDiscussion);
  document.getElementById('bl-drawer-open-btn').addEventListener('click', blOpenDrawer);
  document.getElementById('bl-chat-close').addEventListener('click', blCloseDrawer);
  document.getElementById('bl-drawer-backdrop').addEventListener('click', blCloseDrawer);

  // Profile page (desktop + mobile)
  document.getElementById('btn-profile').addEventListener('click', openProfile);
  document.getElementById('m-btn-profile').addEventListener('click', () => { closeMobileNav(); openProfile(); });
  document.getElementById('profile-back-btn').addEventListener('click', closeProfile);
  document.getElementById('bvm-hint-link').addEventListener('click', openAdvisorsPage);
  document.getElementById('profile-save-btn').addEventListener('click', saveProfileData);
  document.getElementById('profile-save-top').addEventListener('click', saveProfileData);

  // Advisors page
  document.getElementById('btn-advisors').addEventListener('click', openAdvisorsPage);
  document.getElementById('m-btn-advisors').addEventListener('click', () => { closeMobileNav(); openAdvisorsPage(); });
  document.querySelectorAll('.adv-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAdvisorTab(tab.dataset.tab));
  });

  // Advisor panel action links (delegated)
  document.getElementById('advisors-page').addEventListener('click', e => {
    const link = e.target.closest('[data-adv-action]');
    if (!link) return;
    e.preventDefault();
    const action = link.dataset.advAction;
    const advisorId = link.dataset.advId;
    if (action === 'save') {
      saveAdvisorsPage();
    } else {
      openAdvPopup(action, advisorId);
    }
  });

  // Popup close — backdrop click or data-close-popup buttons
  document.getElementById('adv-popup-backdrop').addEventListener('click', closeAdvPopup);
  document.getElementById('advisors-page').addEventListener('click', e => {
    if (e.target.closest('[data-close-popup]')) closeAdvPopup();
  });

  // Popup save buttons
  document.getElementById('popup-name-save-btn').addEventListener('click', savePopupName);
  document.getElementById('popup-settings-custom-save-btn').addEventListener('click', savePopupSettingsCustom);
  document.getElementById('bvm-use-avatar').addEventListener('click', confirmBvmAvatar);

  // Photo inputs in popups
  document.getElementById('bvm-photo-input').addEventListener('change', e => {
    handleBvmPhotoUpload(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('bvm-photo-retry').addEventListener('change', e => {
    handleBvmPhotoUpload(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('custom-photo-input').addEventListener('change', e => {
    saveCustomPhoto(e.target.files[0]);
    e.target.value = '';
  });

  // Profile — add custom interest
  document.getElementById('pf-add-interest-btn').addEventListener('click', () => {
    const val = document.getElementById('pf-custom-interest').value.trim();
    if (!val) return;
    profileInterests.add(val);
    document.getElementById('pf-custom-interest').value = '';
    renderInterestChips();
  });
  document.getElementById('pf-custom-interest').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('pf-add-interest-btn').click(); }
  });

  // Profile — add focus area
  document.getElementById('pf-add-focus-btn').addEventListener('click', () => {
    const val = document.getElementById('pf-custom-focus').value.trim();
    if (!val) return;
    if (!profileFocusAreas.includes(val)) profileFocusAreas.push(val);
    document.getElementById('pf-custom-focus').value = '';
    renderFocusChips();
  });
  document.getElementById('pf-custom-focus').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('pf-add-focus-btn').click(); }
  });

  // Admin — Claude API opens settings modal (desktop + mobile)
  document.getElementById('btn-admin-api').addEventListener('click', openSettings);
  document.getElementById('m-btn-admin-api').addEventListener('click', () => { closeMobileNav(); openSettings(); });

  // Logo / brand → Home page
  document.getElementById('btn-home').addEventListener('click', () => {
    closeMobileNav();
    openHomePage();
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

  // Start initial conversation session (chat ready in background)
  startNewChat();
  applyModeUI('member');

  // Open Home page as the default landing view
  openHomePage();

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

// ── Suggestions ───────────────────────────────────────────────────

const SUGGESTIONS = [
  'How do I make better decisions?',
  'Should I take this opportunity?',
  'How to improve my relationship?',
  'How to handle stress?',
  'What should I prioritize right now?',
  'How do I deal with a difficult person?',
  'Am I on the right path?',
  'How do I find more balance in my life?',
];

function renderSuggestions() {
  const track = document.getElementById('suggestions-track');
  const dots  = document.getElementById('suggestions-dots');
  if (!track || !dots) return;

  track.innerHTML = SUGGESTIONS.map(s =>
    `<button class="suggestion-card">${s}</button>`
  ).join('');

  track.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      $input.value = card.textContent;
      $input.focus();
      onInputChange();
    });
  });

  // Dot pagination — update active dot on scroll
  dots.innerHTML = SUGGESTIONS.map((_, i) =>
    `<span class="suggestion-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  track.addEventListener('scroll', () => {
    const card = track.querySelector('.suggestion-card');
    if (!card) return;
    const cardW = card.offsetWidth + 12; // gap
    const active = Math.min(Math.round(track.scrollLeft / cardW), SUGGESTIONS.length - 1);
    dots.querySelectorAll('.suggestion-dot').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }, { passive: true });

  // Desktop arrow navigation
  function scrollByCard(dir) {
    const card = track.querySelector('.suggestion-card');
    if (!card) return;
    track.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: 'smooth' });
  }
  document.getElementById('suggestions-prev')?.addEventListener('click', () => scrollByCard(-1));
  document.getElementById('suggestions-next')?.addEventListener('click', () => scrollByCard(1));
}

// ── Book Suggestions ──────────────────────────────────────────────

const BL_SUGGESTIONS = [
  { title: 'Atomic Habits',           author: 'James Clear' },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey' },
  { title: 'Think and Grow Rich',     author: 'Napoleon Hill' },
  { title: 'The Power of Now',        author: 'Eckhart Tolle' },
  { title: 'Mindset',                 author: 'Carol Dweck' },
  { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie' },
  { title: 'The Alchemist',           author: 'Paulo Coelho' },
  { title: 'Man\'s Search for Meaning', author: 'Viktor Frankl' },
];

function blRenderBookSuggestions() {
  const track = document.getElementById('bl-suggestions-track');
  const dots  = document.getElementById('bl-suggestions-dots');
  if (!track || !dots) return;

  track.innerHTML = BL_SUGGESTIONS.map(b => {
    const initials = b.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<button class="bl-book-suggestion-card">
      <div class="bl-book-sug-avatar">${initials}</div>
      <div class="bl-book-sug-title">${esc(b.title)}</div>
      <div class="bl-book-sug-author">${esc(b.author)}</div>
    </button>`;
  }).join('');

  track.querySelectorAll('.bl-book-suggestion-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      document.getElementById('bl-book-input').value = BL_SUGGESTIONS[i].title;
      document.getElementById('bl-book-input').focus();
    });
  });

  dots.innerHTML = BL_SUGGESTIONS.map((_, i) =>
    `<span class="suggestion-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  track.addEventListener('scroll', () => {
    const card = track.querySelector('.bl-book-suggestion-card');
    if (!card) return;
    const cardW = card.offsetWidth + 12;
    const active = Math.min(Math.round(track.scrollLeft / cardW), BL_SUGGESTIONS.length - 1);
    dots.querySelectorAll('.suggestion-dot').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }, { passive: true });

  function scrollByCard(dir) {
    const card = track.querySelector('.bl-book-suggestion-card');
    if (!card) return;
    track.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: 'smooth' });
  }
  document.getElementById('bl-suggestions-prev')?.addEventListener('click', () => scrollByCard(-1));
  document.getElementById('bl-suggestions-next')?.addEventListener('click', () => scrollByCard(1));
}

// ── Advice Help Modal ─────────────────────────────────────────────

function openAdviceHelp() {
  openPageHelp('advice');
}

function openPageHelp(key) {
  const overlay = document.getElementById('help-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  renderHelpContent(key, document.getElementById('help-content'));
}

function closeAdviceHelp() {
  document.getElementById('help-overlay')?.classList.remove('open');
}

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

  // Toggle advisor row vs BVM identity block
  const advisorRow  = document.getElementById('advisor-row');
  const bvmIdentity = document.getElementById('bvm-identity');
  if (mode === 'bvm') {
    advisorRow.style.display  = 'none';
    bvmIdentity.style.display = '';
    renderBvmIdentity();
  } else {
    advisorRow.style.display  = '';
    bvmIdentity.style.display = 'none';
  }

  const chips = document.querySelectorAll('.advisor-chip');

  if (mode === 'tribe') {
    state.selectedAdvisors = new Set(TRIBE);
    chips.forEach(chip => {
      chip.classList.remove('dim');
      chip.style.cursor = 'pointer';
    });
    syncChipHighlights();

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

  } else if (mode === 'member') {
    // No default selection — user must choose explicitly
    if (!prev || prev !== 'member') {
      state.selectedAdvisors = new Set();
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

function renderBvmIdentity() {
  const bvm        = getBvmData();
  const avatarWrap = document.getElementById('bvm-avatar-wrap');
  const nameEl     = document.getElementById('bvm-name');
  const hintEl     = document.getElementById('bvm-hint');

  if (bvm.avatar) {
    avatarWrap.innerHTML = `<img src="${bvm.avatar}" alt="BVM" class="bvm-avatar-img">`;
    hintEl.style.display = 'none';
  } else {
    const initial = (bvm.name || 'B')[0].toUpperCase();
    avatarWrap.innerHTML = `<div class="bvm-avatar-placeholder">${initial}</div>`;
    hintEl.style.display = '';
  }

  nameEl.textContent = 'BVM';
}

function toggleAdvisor(id) {
  if (state.mode === 'guide' || state.mode === 'bvm') return;
  hideAdvisorWarning();

  if (state.mode === 'parable') {
    // Single-select
    state.selectedAdvisors = new Set([id]);
  } else if (state.mode === 'member') {
    // Single-select — clicking the active one deselects
    if (state.selectedAdvisors.has(id)) {
      state.selectedAdvisors = new Set();
    } else {
      state.selectedAdvisors = new Set([id]);
    }
  } else if (state.mode === 'tribe') {
    // Multi-toggle — user picks freely
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

function showAdvisorWarning() {
  const el = document.getElementById('advisor-warning');
  if (el) el.style.display = '';
}

function hideAdvisorWarning() {
  const el = document.getElementById('advisor-warning');
  if (el) el.style.display = 'none';
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

  if ((state.mode === 'member' || state.mode === 'tribe') && state.selectedAdvisors.size === 0) {
    showAdvisorWarning();
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
  hideAdvisorWarning();
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
  // Strip name and title even when wrapped in markdown (**, #, ##, etc.)
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pat = (s) => new RegExp(`^#{0,3}\\s*\\**\\s*${esc(s)}\\s*\\**\\s*[:\\-]?\\s*`, 'i');
  t = t.replace(pat(a.name), '').trim();
  t = t.replace(pat(a.title), '').trim();
  return t;
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

// ── Profile Page ─────────────────────────────────────────────────

const PROFILE_KEY = 'tribe_user_profile';
const PRESET_INTERESTS = [
  'Business', 'Relationships', 'Health', 'Fitness', 'Finances',
  'Faith', 'Productivity', 'Personal Growth', 'Family', 'Leadership',
  'Emotions', 'Mindset'
];

let profileInterests = new Set();
let profileFocusAreas = [];

function getProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }
  catch (e) { return {}; }
}

function openProfile() {
  loadProfileData();
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('profile-page').style.display = 'flex';
}

function closeProfile() {
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
}

function loadProfileData() {
  const p = getProfile();
  document.getElementById('pf-display-name').value    = p.displayName || '';
  document.getElementById('pf-age').value             = p.age || '';
  document.getElementById('pf-location').value        = p.location || '';
  document.getElementById('pf-gender').value          = p.gender || '';
  document.getElementById('pf-life-role').value       = p.lifeRole || '';
  document.getElementById('pf-preferred-address').value = p.preferredAddress || '';
  document.getElementById('pf-language').value        = p.language || 'english';
  document.getElementById('pf-advisor-tone').value    = p.advisorTone || 'balanced';
  document.getElementById('pf-response-depth').value  = p.responseDepth || 'medium';
  document.getElementById('pf-goals').value           = p.goals || '';
  document.getElementById('pf-challenges').value      = p.challenges || '';

  profileInterests = new Set(p.interests || []);
  profileFocusAreas = p.focusAreas || [];
  renderInterestChips();
  renderFocusChips();
}

function saveProfileData() {
  const p = {
    displayName:      document.getElementById('pf-display-name').value.trim(),
    age:              document.getElementById('pf-age').value,
    location:         document.getElementById('pf-location').value.trim(),
    gender:           document.getElementById('pf-gender').value,
    lifeRole:         document.getElementById('pf-life-role').value.trim(),
    interests:        Array.from(profileInterests),
    focusAreas:       [...profileFocusAreas],
    preferredAddress: document.getElementById('pf-preferred-address').value.trim(),
    language:         document.getElementById('pf-language').value,
    advisorTone:      document.getElementById('pf-advisor-tone').value,
    responseDepth:    document.getElementById('pf-response-depth').value,
    goals:            document.getElementById('pf-goals').value.trim(),
    challenges:       document.getElementById('pf-challenges').value.trim()
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  showNotice('Profile saved.');
}

function renderInterestChips() {
  const container = document.getElementById('pf-interests-chips');
  container.innerHTML = '';
  PRESET_INTERESTS.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'profile-chip' + (profileInterests.has(name) ? ' active' : '');
    btn.textContent = name;
    btn.addEventListener('click', () => {
      if (profileInterests.has(name)) { profileInterests.delete(name); btn.classList.remove('active'); }
      else { profileInterests.add(name); btn.classList.add('active'); }
    });
    container.appendChild(btn);
  });
  // Custom interests not in preset list
  [...profileInterests].filter(i => !PRESET_INTERESTS.includes(i)).forEach(name => {
    container.appendChild(makeRemovableChip(name, () => { profileInterests.delete(name); renderInterestChips(); }));
  });
}

function renderFocusChips() {
  const container = document.getElementById('pf-focus-chips');
  container.innerHTML = '';
  profileFocusAreas.forEach(area => {
    container.appendChild(makeRemovableChip(area, () => {
      profileFocusAreas = profileFocusAreas.filter(a => a !== area);
      renderFocusChips();
    }));
  });
}

function makeRemovableChip(text, onRemove) {
  const chip = document.createElement('div');
  chip.className = 'profile-chip active';
  chip.innerHTML = `<span>${text}</span><button class="profile-chip-remove" aria-label="Remove">×</button>`;
  chip.querySelector('.profile-chip-remove').addEventListener('click', e => { e.stopPropagation(); onRemove(); });
  return chip;
}

// ── Advisors Page ─────────────────────────────────────────────────

const BVM_KEY          = 'tribe_bvm';
const ADVISOR_NAMES_KEY = 'tribe_advisor_names';

const TRIBE_IDS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];

function getBvmData() {
  try { return JSON.parse(localStorage.getItem(BVM_KEY) || '{}'); }
  catch { return {}; }
}
function saveBvmData(data) {
  localStorage.setItem(BVM_KEY, JSON.stringify(data));
}

function getAdvisorNames() {
  try { return JSON.parse(localStorage.getItem(ADVISOR_NAMES_KEY) || '{}'); }
  catch { return {}; }
}
function saveAdvisorNames(names) {
  localStorage.setItem(ADVISOR_NAMES_KEY, JSON.stringify(names));
}

// Apply saved names to ADVISORS object and DOM chips
function applyAdvisorNames() {
  const names = getAdvisorNames();
  [...TRIBE_IDS, 'guide'].forEach(id => {
    if (names[id]) ADVISORS[id].name = names[id];
  });
  updateAdvisorChipNames();
}

function updateAdvisorChipNames() {
  const names = getAdvisorNames();
  document.querySelectorAll('.advisor-chip').forEach(chip => {
    const id = chip.dataset.advisor;
    const name = names[id] || ADVISORS[id]?.name;
    if (name) {
      const el = chip.querySelector('.advisor-chip-name');
      if (el) el.textContent = name;
    }
  });
}

function switchAdvisorTab(tabId) {
  document.querySelectorAll('.adv-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.adv-panel').forEach(p => p.classList.toggle('active', p.id === `adv-panel-${tabId}`));
}

function openAdvisorsPage() {
  closeBookLessons();
  closeCoreLessons();
  // Update tab labels with current names
  const names = getAdvisorNames();
  [...TRIBE_IDS, 'guide'].forEach(id => {
    const displayName = names[id] || ADVISORS[id]?.name || '';
    const label = document.getElementById(`adv-tab-label-${id}`);
    if (label) label.textContent = displayName || id;
  });

  // Update BVM tab + panel avatar if one is saved
  const bvm = getBvmData();
  _bvmPendingAvatar = null;
  if (bvm.avatar) {
    const tabBvmImg = document.getElementById('adv-tab-bvm-img');
    if (tabBvmImg.tagName === 'DIV') {
      tabBvmImg.outerHTML = `<img src="${bvm.avatar}" class="adv-tab-avatar" id="adv-tab-bvm-img" alt="BVM">`;
    } else {
      tabBvmImg.src = bvm.avatar;
    }
    const panelBvmImg = document.getElementById('adv-panel-bvm-img');
    if (panelBvmImg.tagName === 'DIV') {
      panelBvmImg.outerHTML = `<img src="${bvm.avatar}" class="adv-panel-avatar" id="adv-panel-bvm-img" alt="BVM">`;
    } else {
      panelBvmImg.src = bvm.avatar;
    }
  }

  // Update Custom avatar if one is saved
  const customAvatar = localStorage.getItem('tribe_custom_avatar');
  if (customAvatar) {
    const guideImg = document.getElementById('adv-panel-guide-img');
    if (guideImg) guideImg.src = customAvatar;
    const guideTabImg = document.querySelector('[data-tab="guide"] .adv-tab-avatar');
    if (guideTabImg) guideTabImg.src = customAvatar;
  }

  // Reset to first tab
  switchAdvisorTab('seth');

  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('advisors-page').style.display = 'flex';
}

function closeAdvisorsPage() {
  closeAdvPopup();
  document.getElementById('advisors-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
  _bvmPendingAvatar = null;
}

// ── Advisor Popups ────────────────────────────────────────────────

let _currentPopupAdvisor = null;

function openAdvPopup(action, advisorId) {
  _currentPopupAdvisor = advisorId;

  // Hide all popups, show backdrop
  document.querySelectorAll('.adv-popup').forEach(p => { p.style.display = 'none'; });
  document.getElementById('adv-popup-backdrop').style.display = '';

  if (action === 'edit-name') {
    const names = getAdvisorNames();
    const current = names[advisorId] || ADVISORS[advisorId]?.name || '';
    document.getElementById('popup-name-input').value = current;
    document.getElementById('adv-popup-edit-name').style.display = '';
    setTimeout(() => document.getElementById('popup-name-input').focus(), 50);

  } else if (action === 'change-photo') {
    document.getElementById('adv-popup-photo').style.display = '';
    if (advisorId === 'bvm') {
      document.getElementById('photo-simple-area').style.display = 'none';
      document.getElementById('photo-bvm-area').style.display = '';
      const bvm = getBvmData();
      if (bvm.avatar) {
        showBvmPreview(bvm.avatar, false);
      } else {
        document.getElementById('bvm-upload-area').style.display = '';
        document.getElementById('bvm-converting').style.display = 'none';
        document.getElementById('bvm-preview-area').style.display = 'none';
        document.getElementById('bvm-upload-initial').textContent = 'B';
      }
    } else if (advisorId === 'guide') {
      document.getElementById('photo-bvm-area').style.display = 'none';
      document.getElementById('photo-simple-area').style.display = '';
      const customAvatar = localStorage.getItem('tribe_custom_avatar');
      const previewWrap = document.getElementById('photo-simple-preview-wrap');
      if (customAvatar) {
        document.getElementById('photo-simple-preview').src = customAvatar;
        previewWrap.style.display = '';
      } else {
        previewWrap.style.display = 'none';
      }
    }

  } else if (action === 'settings') {
    if (advisorId === 'guide') {
      document.getElementById('popup-guide-persona').value =
        state.guideName !== 'a wise mentor and trusted advisor' ? state.guideName : '';
      document.getElementById('adv-popup-settings-custom').style.display = '';
      setTimeout(() => document.getElementById('popup-guide-persona').focus(), 50);
    } else if (advisorId === 'bvm') {
      document.getElementById('adv-popup-settings-bvm').style.display = '';
    }
  }
}

function closeAdvPopup() {
  document.querySelectorAll('.adv-popup').forEach(p => { p.style.display = 'none'; });
  document.getElementById('adv-popup-backdrop').style.display = 'none';
  _currentPopupAdvisor = null;
}

function savePopupName() {
  const advisorId = _currentPopupAdvisor;
  const newName = document.getElementById('popup-name-input').value.trim();
  if (!advisorId) { closeAdvPopup(); return; }
  const names = getAdvisorNames();
  if (newName) names[advisorId] = newName;
  else delete names[advisorId];
  saveAdvisorNames(names);
  applyAdvisorNames();
  const tabLabel = document.getElementById(`adv-tab-label-${advisorId}`);
  if (tabLabel) tabLabel.textContent = newName || ADVISORS[advisorId]?.name || advisorId;
  closeAdvPopup();
  showNotice('Name saved.');
}

function saveCustomPhoto(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result;
    localStorage.setItem('tribe_custom_avatar', base64);
    const guideImg = document.getElementById('adv-panel-guide-img');
    if (guideImg) guideImg.src = base64;
    const guideTabImg = document.querySelector('[data-tab="guide"] .adv-tab-avatar');
    if (guideTabImg) guideTabImg.src = base64;
    const previewWrap = document.getElementById('photo-simple-preview-wrap');
    document.getElementById('photo-simple-preview').src = base64;
    previewWrap.style.display = '';
    showNotice('Photo saved.');
  };
  reader.readAsDataURL(file);
}

function savePopupSettingsCustom() {
  const val = document.getElementById('popup-guide-persona').value.trim();
  state.guideName = val || 'a wise mentor and trusted advisor';
  localStorage.setItem('tribe_guide_name', state.guideName);
  const guideInput = document.getElementById('guide-name-input');
  if (guideInput) guideInput.value = state.guideName;
  closeAdvPopup();
  showNotice('Custom advisor settings saved.');
}

function saveAdvisorsPage() {
  // Names and persona are saved immediately from their popup cards.
  // This button re-applies all names and updates BVM identity.
  applyAdvisorNames();

  const bvm = getBvmData();
  bvm.name = 'BVM';
  if (_bvmPendingAvatar) {
    bvm.avatar = _bvmPendingAvatar;
    _bvmPendingAvatar = null;
  }
  saveBvmData(bvm);
  renderBvmIdentity();

  showNotice('Advisor settings saved.');
}

// ── BVM Avatar Conversion ─────────────────────────────────────────

const BVM_PROCESSING_STAGES = [
  { text: 'Uploading photo...',                              delay: 0    },
  { text: 'Analyzing your features...',                     delay: 900  },
  { text: 'Converting your photo into your personal avatar...', delay: 2000 },
  { text: 'Finalizing your avatar...',                      delay: 3200 }
];

let _bvmPendingAvatar = null;

function handleBvmPhotoUpload(file) {
  if (!file || !file.type.startsWith('image/')) return;

  document.getElementById('bvm-upload-area').style.display = 'none';
  document.getElementById('bvm-preview-area').style.display = 'none';
  document.getElementById('bvm-converting').style.display = '';

  const textEl = document.getElementById('bvm-converting-text');
  BVM_PROCESSING_STAGES.forEach(({ text, delay }) => {
    setTimeout(() => { if (textEl) textEl.textContent = text; }, delay);
  });

  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result;
    setTimeout(() => {
      _bvmPendingAvatar = base64;
      showBvmPreview(base64, true);
    }, BVM_PROCESSING_STAGES[BVM_PROCESSING_STAGES.length - 1].delay + 700);
  };
  reader.readAsDataURL(file);
}

function showBvmPreview(src, showConfirm) {
  document.getElementById('bvm-upload-area').style.display = 'none';
  document.getElementById('bvm-converting').style.display = 'none';
  document.getElementById('bvm-preview-area').style.display = '';
  document.getElementById('bvm-preview-img').src = src;
  document.getElementById('bvm-use-avatar').style.display = showConfirm ? '' : 'none';
}

function confirmBvmAvatar() {
  if (!_bvmPendingAvatar) return;
  const bvm = getBvmData();
  bvm.avatar = _bvmPendingAvatar;
  bvm.name = 'BVM';
  saveBvmData(bvm);
  // Update tab avatar
  const tabBvmImg = document.getElementById('adv-tab-bvm-img');
  if (tabBvmImg) {
    if (tabBvmImg.tagName === 'DIV') {
      tabBvmImg.outerHTML = `<img src="${bvm.avatar}" class="adv-tab-avatar" id="adv-tab-bvm-img" alt="BVM">`;
    } else {
      tabBvmImg.src = bvm.avatar;
    }
  }
  // Update panel avatar
  const panelBvmImg = document.getElementById('adv-panel-bvm-img');
  if (panelBvmImg) {
    if (panelBvmImg.tagName === 'DIV') {
      panelBvmImg.outerHTML = `<img src="${bvm.avatar}" class="adv-panel-avatar" id="adv-panel-bvm-img" alt="BVM">`;
    } else {
      panelBvmImg.src = bvm.avatar;
    }
  }
  _bvmPendingAvatar = null;
  renderBvmIdentity();
  closeAdvPopup();
  showNotice('BVM avatar saved.');
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

async function generateDebateTitleAI(topic) {
  try {
    const system = 'You create short, punchy debate titles. Reply with only the title — no quotes, no trailing punctuation, no explanation. 3 to 5 words. Start with a capital letter.';
    const raw = await callDebateAPI(system, `Debate topic: "${topic}"`);
    return raw.trim().replace(/^[a-z]/, c => c.toUpperCase()).replace(/[".!?]+$/, '');
  } catch {
    const fallback = generateTitle(topic);
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
  }
}

function showDebateTitleHeader(title) {
  const thread = document.getElementById('debate-thread');
  const existing = thread.querySelector('.debate-title-header');
  if (existing) { existing.textContent = title; return; }
  const el = document.createElement('div');
  el.className = 'debate-title-header';
  el.textContent = title;
  thread.insertBefore(el, thread.firstChild);
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
  if (state.mode === 'member') {
    state.selectedAdvisors = new Set();
    syncChipHighlights();
  }
  hideAdvisorWarning();
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

// Heart SVGs
const HEART_FILLED  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const HEART_OUTLINE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

function toggleFavorite(id) {
  const convs = getConversations();
  const conv  = convs.find(c => c.id === id);
  if (!conv) return;
  conv.favorite = !conv.favorite;
  saveConversations(convs);
}

function openHistoryPanel(favoritesOnly = false) {
  // Set active filter tab
  document.querySelectorAll('.history-filter-btn').forEach(btn => {
    btn.classList.toggle('active', favoritesOnly ? btn.dataset.filter === 'favorites' : btn.dataset.filter === 'all');
  });

  renderHistoryList(favoritesOnly);
  document.getElementById('history-overlay').classList.add('open');
}

function renderHistoryList(favoritesOnly = false) {
  let convs = getConversations().filter(c => c.messages.length > 0);
  if (favoritesOnly) convs = convs.filter(c => c.favorite);

  const $list = document.getElementById('history-list');

  if (convs.length === 0) {
    $list.innerHTML = `<p class="history-empty">${favoritesOnly ? 'No favorites yet.' : 'No conversations yet.'}</p>`;
    return;
  }

  $list.innerHTML = convs.map(conv => {
    const title      = esc(conv.title || 'Untitled Chat');
    const date       = formatRelativeDate(conv.updated_at);
    const msgCount   = conv.messages.filter(m => m.type === 'user').length;
    const countLabel = msgCount === 1 ? '1 message' : `${msgCount} messages`;
    const isFav      = !!conv.favorite;
    return `
      <div class="history-item" data-id="${conv.id}">
        <div class="history-item-main">
          <div class="history-item-title">${title}</div>
          <div class="history-item-meta">${date} · ${countLabel}</div>
        </div>
        <div class="history-item-actions">
          <button class="history-heart-btn${isFav ? ' active' : ''}" data-action="favorite" data-id="${conv.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
            ${isFav ? HEART_FILLED : HEART_OUTLINE}
          </button>
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
  $list.querySelectorAll('[data-action="favorite"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
      // Re-render staying in current filter
      const isFilteringFavs = document.querySelector('.history-filter-btn.active')?.dataset.filter === 'favorites';
      renderHistoryList(isFilteringFavs);
    });
  });
  $list.querySelectorAll('[data-action="rename"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); renameConversation(btn.dataset.id); });
  });
  $list.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); deleteConversation(btn.dataset.id); });
  });
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
  renderHistoryList(document.querySelector('.history-filter-btn.active')?.dataset.filter === 'favorites');
}

function deleteConversation(id) {
  saveConversations(getConversations().filter(c => c.id !== id));
  if (state.currentConvId === id) startNewChat();
  renderHistoryList(document.querySelector('.history-filter-btn.active')?.dataset.filter === 'favorites');
}

// ── Book Lessons ──────────────────────────────────────────────────

// ── Book Lessons state ────────────────────────────────────────────
let blCurrentBook     = '';      // user search string
let blConfirmedBook   = null;    // { title, author, tagline }
let blCurrentLesson   = null;    // { overview, keyConcepts[], chapters[], suggestedTopics[] }
let blChatMessages    = [];      // [{role, content, advisorId}]
let blCompletedTopics = new Set();
let blActiveAdvisor   = 'guide';

// ── Stories ───────────────────────────────────────────────────────

const ADVISOR_AVATAR = {
  seth:   '../assets/avatars/seth.png',
  emma:   '../assets/avatars/emma.png',
  frank:  '../assets/avatars/frank.png',
  rachel: '../assets/avatars/rachel.png',
  guide:  '../assets/avatars/guide.png',
  marcus: '../assets/avatars/marcus.png',
  hannah: '../assets/avatars/hannah.png'
};

const STORY_NARRATOR_IDS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank', 'guide'];
const STORY_CATEGORIES   = ['Leaders', 'Entrepreneurs', 'Athletes', 'Scientists', 'Philosophers', 'Spiritual Figures', 'Unknown Heroes'];

// Current story being viewed
let currentStory    = null;
let storyGenerating = false;

// ── Storage ──

function getDailyStoryKey() {
  return `tribe_daily_story_${new Date().toISOString().slice(0, 10)}`;
}

function getDailyStoryRead() {
  return localStorage.getItem(`tribe_story_read_${new Date().toISOString().slice(0, 10)}`) === 'true';
}

function markDailyStoryRead() {
  localStorage.setItem(`tribe_story_read_${new Date().toISOString().slice(0, 10)}`, 'true');
}

function getStoryLibrary() {
  try { return JSON.parse(localStorage.getItem('tribe_story_library') || '[]'); }
  catch { return []; }
}

function saveStoryLibraryData(stories) {
  localStorage.setItem('tribe_story_library', JSON.stringify(stories));
}

// ── AI Generation ──

async function generateStoryAI(narratorId, category) {
  const advisor = ADVISORS[narratorId];
  const system  = `You generate short inspirational biography stories for the My Tribe app. Return ONLY a valid JSON object with no extra text, preamble, or markdown code fences.`;
  const user    = `Generate an inspirational biography story.

Narrator: ${advisor.name}, the ${advisor.title}
Category: ${category}

The narrator introduces and tells the story entirely in their distinctive voice:
- Seth (Spiritual): reflective, moral, faith-driven, quiet wisdom
- Marcus (Mindset): analytical, direct, logical, structured
- Emma (Emotional): empathetic, warm, emotionally perceptive
- Hannah (Health): practical, grounded, resilience-focused
- Rachel (Relationships): warm, perceptive, connection-focused
- Frank (Financial): direct, blunt, risk and consequence focused
- Guide: wise, mentoring, broad perspective

Include both famous historical figures AND unknown heroes (ordinary people who did extraordinary things: medical workers, disaster responders, community builders, soldiers who protected civilians).

Return this exact JSON format only:
{
  "title": "Person Name — Theme",
  "subject": "Person's full name",
  "category": "${category}",
  "narrator": "${narratorId}",
  "slides": [
    {"label": "Opening", "text": "Narrator's hook in their distinctive voice (1-2 sentences)"},
    {"label": "Context", "text": "Who this person was and their background (2-3 sentences)"},
    {"label": "The Struggle", "text": "The challenge or obstacle they faced (2-3 sentences)"},
    {"label": "The Decision", "text": "The defining choice or action they took (2-3 sentences)"},
    {"label": "The Outcome", "text": "What happened as a result (2-3 sentences)"},
    {"label": "The Lesson", "text": "A clear, direct takeaway for the reader (1-2 sentences)"}
  ]
}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 900,
      system,
      messages: [{ role: 'user', content: user }]
    })
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const text = data.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Invalid story JSON');
  return JSON.parse(match[0]);
}

async function generateDailyStory() {
  const key = getDailyStoryKey();
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {}

  // Seed narrator + category by today's date
  const dateSeed   = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  const narratorId = STORY_NARRATOR_IDS[dateSeed % STORY_NARRATOR_IDS.length];
  const category   = STORY_CATEGORIES[Math.floor(dateSeed / 10) % STORY_CATEGORIES.length];

  const story = await generateStoryAI(narratorId, category);
  story.date  = new Date().toISOString().slice(0, 10);
  localStorage.setItem(key, JSON.stringify(story));
  return story;
}

async function generateRandomStory() {
  const narratorId = STORY_NARRATOR_IDS[Math.floor(Math.random() * STORY_NARRATOR_IDS.length)];
  const category   = STORY_CATEGORIES[Math.floor(Math.random() * STORY_CATEGORIES.length)];
  return generateStoryAI(narratorId, category);
}

// ── Init ──

function initStories() {
  updateStoriesBadge();
  // Kick off daily story generation in background
  generateDailyStory().then(story => {
    updateStoriesBadge();
    // Refresh panel if open
    if (document.getElementById('stories-panel').classList.contains('open')) {
      renderStoriesPanel();
    }
  }).catch(() => {});
}

// ── Panel ──

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
  const body = document.getElementById('stories-panel-body');
  if (!body) return;

  const key    = getDailyStoryKey();
  let   cached = null;
  try { cached = JSON.parse(localStorage.getItem(key)); } catch {}

  if (cached) {
    const advisor  = ADVISORS[cached.narrator] || {};
    const avatarSrc = ADVISOR_AVATAR[cached.narrator];
    const avatarHtml = avatarSrc
      ? `<img src="${avatarSrc}" alt="${advisor.name || ''}" class="sp-avatar-img">`
      : `<div class="sp-avatar-init" style="background:${advisor.color || '#888'}">${advisor.initial || '?'}</div>`;
    body.innerHTML = `
      <div class="sp-story-card" id="sp-story-card">
        <div class="sp-card-avatar">${avatarHtml}</div>
        <div class="sp-card-info">
          <div class="sp-card-narrator">${esc(advisor.name || cached.narrator)}</div>
          <div class="sp-card-title">${esc(cached.title || '')}</div>
          <div class="sp-card-category">${esc(cached.category || '')}</div>
        </div>
        <svg class="sp-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`;
    document.getElementById('sp-story-card').addEventListener('click', () => {
      closeStoriesPanel();
      openStoryViewer(cached);
    });
  } else {
    body.innerHTML = `<div class="sp-loading"><div class="sp-loading-text">Generating today's story…</div></div>`;
  }
}

function updateStoriesBadge() {
  const badge = document.getElementById('stories-nav-badge');
  if (!badge) return;
  const key = getDailyStoryKey();
  const hasStory = !!localStorage.getItem(key);
  const isRead   = getDailyStoryRead();
  if (hasStory && !isRead) {
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

// ── Viewer ──

function openStoryViewer(story) {
  if (!story || !story.slides || !story.slides.length) return;
  currentStory = story;
  document.getElementById('story-viewer').classList.add('open');
  document.getElementById('story-reader').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  renderStoryPage();
}

function closeStoryViewer() {
  document.getElementById('story-viewer').classList.remove('open');
  document.body.style.overflow = '';
  currentStory = null;
  markDailyStoryRead();
  updateStoriesBadge();
}

function renderStoryPage() {
  if (!currentStory) return;
  const advisor = ADVISORS[currentStory.narrator] || {};

  // Narrator avatar
  const $avatar = document.getElementById('story-narrator-avatar');
  $avatar.innerHTML = '';
  const avatarSrc = ADVISOR_AVATAR[currentStory.narrator];
  if (avatarSrc) {
    const img = document.createElement('img');
    img.src   = avatarSrc;
    img.alt   = advisor.name || '';
    img.onerror = () => {
      img.remove();
      const init = document.createElement('div');
      init.className   = 'story-narrator-initial';
      init.style.background = advisor.color || '#555';
      init.textContent = advisor.initial || '?';
      $avatar.appendChild(init);
    };
    $avatar.appendChild(img);
  } else {
    const init = document.createElement('div');
    init.className   = 'story-narrator-initial';
    init.style.background = advisor.color || '#555';
    init.textContent = advisor.initial || '?';
    $avatar.appendChild(init);
  }

  document.getElementById('story-narrator-name').textContent = advisor.name || currentStory.narrator;
  document.getElementById('story-narrator-role').textContent = advisor.title || '';
  document.getElementById('story-category-tag').textContent  = currentStory.category || '';
  document.getElementById('story-main-title').textContent    = currentStory.title || '';

  // Save button state
  const lib = getStoryLibrary();
  const saved = lib.some(s => s.title === currentStory.title && s.narrator === currentStory.narrator);
  const $save = document.getElementById('story-save-btn');
  $save.classList.toggle('saved', saved);

  // Render all slides as stacked sections
  const $sections = document.getElementById('story-sections');
  $sections.innerHTML = currentStory.slides.map(slide => {
    const isLesson = slide.label === 'The Lesson';
    return `<div class="story-section${isLesson ? ' story-section-lesson' : ''}">
      <div class="story-section-label">${esc(slide.label || '')}</div>
      <p class="story-section-text">${esc(slide.text || '')}</p>
    </div>`;
  }).join('');
}

function saveStoryToLibrary() {
  if (!currentStory) return;
  const lib = getStoryLibrary();
  const alreadySaved = lib.some(s => s.title === currentStory.title && s.narrator === currentStory.narrator);
  if (alreadySaved) { showNotice('Already saved.'); return; }
  lib.unshift({ ...currentStory, saved_at: Date.now() });
  saveStoryLibraryData(lib);
  renderStoryPage(); // refresh save button state
  showNotice('Story saved to library.');
}

async function handleTellMeAnother() {
  if (storyGenerating) return;
  storyGenerating = true;
  closeStoryViewer();
  closeStoriesPanel();

  // Show loading in panel
  const body = document.getElementById('stories-panel-body');
  if (body) body.innerHTML = `<div class="sp-loading"><div class="sp-loading-text">Generating a new story…</div></div>`;
  document.getElementById('stories-panel').classList.add('open');

  try {
    const story = await generateRandomStory();
    storyGenerating = false;
    renderStoriesPanel(); // refresh panel (still shows daily)
    openStoryViewer(story);
  } catch (e) {
    storyGenerating = false;
    const b = document.getElementById('stories-panel-body');
    if (b) b.innerHTML = `<div class="sp-loading"><div class="sp-loading-text">Could not generate story. Try again.</div></div>`;
  }
}

// ── Story Library ──

function openStoryLibrary() {
  renderStoryLibrary('All');
  document.getElementById('story-library-overlay').classList.add('open');
  closeStoriesPanel();
}

function closeStoryLibrary() {
  document.getElementById('story-library-overlay').classList.remove('open');
  // Also collapse the create panel so it resets on next open
  const panel = document.getElementById('story-create-panel');
  if (panel) panel.style.display = 'none';
}

// ── New Story creation ─────────────────────────────────────────────

function toggleStoryCreatePanel() {
  const panel = document.getElementById('story-create-panel');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) initStoryCreatePanel();
}

function initStoryCreatePanel() {
  const catsEl  = document.getElementById('story-create-cats');
  const narrsEl = document.getElementById('story-create-narrs');
  if (!catsEl || !narrsEl) return;
  // Only build once
  if (catsEl.children.length > 0) return;

  STORY_CATEGORIES.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'story-create-chip' + (i === 0 ? ' active' : '');
    btn.dataset.value = cat;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      catsEl.querySelectorAll('.story-create-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    catsEl.appendChild(btn);
  });

  STORY_NARRATOR_IDS.forEach((id, i) => {
    const btn = document.createElement('button');
    btn.className = 'story-create-chip' + (i === 0 ? ' active' : '');
    btn.dataset.value = id;
    btn.textContent = ADVISORS[id].name;
    btn.addEventListener('click', () => {
      narrsEl.querySelectorAll('.story-create-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    narrsEl.appendChild(btn);
  });
}

async function createNewBlogStory() {
  const btn    = document.getElementById('story-create-btn');
  const status = document.getElementById('story-create-status');

  const catChip  = document.querySelector('#story-create-cats  .story-create-chip.active');
  const narrChip = document.querySelector('#story-create-narrs .story-create-chip.active');

  if (!catChip || !narrChip) {
    status.textContent = 'Select a category and narrator first.';
    return;
  }

  btn.disabled = true;
  status.textContent = 'Generating…';

  try {
    const story = await generateStoryAI(narrChip.dataset.value, catChip.dataset.value);
    story.saved_at = Date.now();
    const lib = getStoryLibrary();
    lib.unshift(story);
    saveStoryLibraryData(lib);

    // Collapse create panel and refresh list
    document.getElementById('story-create-panel').style.display = 'none';
    renderStoryLibrary('All');
    status.textContent = '';
    showNotice('Story created and saved!');

    // Refresh blog carousel if home page is visible
    if (document.getElementById('home-page').style.display !== 'none') {
      renderHomeBlogsCarousel();
    }
  } catch {
    status.textContent = 'Generation failed — please try again.';
  } finally {
    btn.disabled = false;
  }
}

function renderStoryLibrary(filter) {
  // Update active filter button
  document.querySelectorAll('.story-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  const lib  = getStoryLibrary();
  const list = document.getElementById('story-library-list');
  const filtered = filter === 'All' ? lib : lib.filter(s => s.category === filter);

  if (filtered.length === 0) {
    list.innerHTML = `<p class="story-library-empty">${filter === 'All' ? 'No saved stories yet.' : 'No stories in this category.'}</p>`;
    return;
  }

  list.innerHTML = filtered.map((story, i) => {
    const advisor = ADVISORS[story.narrator] || {};
    const avatarSrc = ADVISOR_AVATAR[story.narrator];
    const avatarHtml = avatarSrc
      ? `<img src="${avatarSrc}" alt="${advisor.name || ''}" class="sl-avatar-img">`
      : `<div class="sl-avatar-init" style="background:${advisor.color || '#888'}">${advisor.initial || '?'}</div>`;
    return `
      <div class="sl-item" data-index="${i}" data-filter="${esc(filter)}">
        <div class="sl-avatar">${avatarHtml}</div>
        <div class="sl-info">
          <div class="sl-title">${esc(story.title || 'Untitled')}</div>
          <div class="sl-meta">${esc(advisor.name || story.narrator)} · ${esc(story.category || '')}</div>
        </div>
        <button class="sl-delete" data-index="${i}" data-filter="${esc(filter)}" title="Remove">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>`;
  }).join('');

  list.querySelectorAll('.sl-item').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.sl-delete')) return;
      const idx = parseInt(el.dataset.index);
      const story = filtered[idx];
      closeStoryLibrary();
      openStoryViewer(story);
    });
  });

  list.querySelectorAll('.sl-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx    = parseInt(btn.dataset.index);
      const filter = btn.dataset.filter;
      const story  = filtered[idx];
      const allLib = getStoryLibrary().filter(s => !(s.title === story.title && s.narrator === story.narrator));
      saveStoryLibraryData(allLib);
      renderStoryLibrary(filter);
    });
  });
}

// ── About ─────────────────────────────────────────────────────────

// Map nav-button key → section heading in about.md
const ABOUT_SECTIONS = {
  'my-tribe':     'My Tribe',
  'advisors':     'Advisors',
  'disclaimers':  'Disclaimers'
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
  const blocks = body.join('\n')
    .trim()
    .replace(/---/g, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return blocks.map(block => {
    const bulletLines = block.split('\n').filter(l => l.trim().startsWith('•'));
    if (bulletLines.length > 0) {
      const items = bulletLines.map(l => `<li>${l.replace(/^•\s*/, '')}</li>`).join('');
      return `<ul class="about-bullet-list">${items}</ul>`;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('');
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

// ── Book Lessons helpers ──────────────────────────────────────────

function getSavedBooks() {
  try { return JSON.parse(localStorage.getItem('tribe_books') || '[]'); }
  catch { return []; }
}
function saveBooksData(books) {
  localStorage.setItem('tribe_books', JSON.stringify(books));
}
function getViewedBooks() {
  try { return JSON.parse(localStorage.getItem('tribe_books_viewed') || '[]'); }
  catch { return []; }
}
function getBookDiscussion(title) {
  try {
    const all = JSON.parse(localStorage.getItem('tribe_bl_discussions') || '{}');
    return all[title] || [];
  } catch { return []; }
}
function saveBookDiscussion(title, messages) {
  try {
    const all = JSON.parse(localStorage.getItem('tribe_bl_discussions') || '{}');
    all[title] = messages;
    localStorage.setItem('tribe_bl_discussions', JSON.stringify(all));
  } catch {}
}
function saveViewedBooks(books) {
  localStorage.setItem('tribe_books_viewed', JSON.stringify(books));
}
function blRecordView() {
  if (!blConfirmedBook) return;
  const viewed = getViewedBooks();
  // Move to top if already present, else add new entry
  const filtered = viewed.filter(b => b.title !== blConfirmedBook.title);
  filtered.unshift({
    title: blConfirmedBook.title,
    author: blConfirmedBook.author,
    tagline: blConfirmedBook.tagline || '',
    viewedAt: Date.now()
  });
  saveViewedBooks(filtered.slice(0, 50)); // cap at 50
}

function blShowPhase(phaseId) {
  ['bl-search-phase', 'bl-confirm-phase', 'bl-lesson-phase', 'bl-library-phase']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === phaseId) {
        el.style.display = id === 'bl-lesson-phase' ? 'flex' : '';
      } else {
        el.style.display = 'none';
      }
    });
}

function openBookLessons() {
  closeCoreLessons();
  blCurrentBook     = '';
  blConfirmedBook   = null;
  blCurrentLesson   = null;
  blChatMessages    = [];
  blCompletedTopics = new Set();
  blActiveAdvisor   = 'guide';
  document.getElementById('bl-book-input').value = '';
  blShowPhase('bl-search-phase');
  blRenderBookSuggestions();
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('book-lessons-page').style.display = 'flex';
  setTimeout(() => document.getElementById('bl-book-input').focus(), 100);
}

// ── Popular Books Modal ───────────────────────────────────────────

const BL_POPULAR = {
  Spirituality: [
    { title: 'The Power of Now',               author: 'Eckhart Tolle' },
    { title: 'A New Earth',                    author: 'Eckhart Tolle' },
    { title: 'The Alchemist',                  author: 'Paulo Coelho' },
    { title: 'Siddhartha',                     author: 'Hermann Hesse' },
    { title: "Man's Search for Meaning",       author: 'Viktor Frankl' },
    { title: 'The Untethered Soul',            author: 'Michael A. Singer' },
    { title: 'Meditations',                    author: 'Marcus Aurelius' },
    { title: 'The Four Agreements',            author: 'Don Miguel Ruiz' },
    { title: 'Stillness Is the Key',           author: 'Ryan Holiday' },
    { title: 'The Miracle Morning',            author: 'Hal Elrod' },
    { title: 'Awareness',                      author: 'Anthony de Mello' },
    { title: 'The Seat of the Soul',           author: 'Gary Zukav' },
  ],
  Mindset: [
    { title: 'Mindset',                        author: 'Carol S. Dweck' },
    { title: 'Atomic Habits',                  author: 'James Clear' },
    { title: 'Thinking, Fast and Slow',        author: 'Daniel Kahneman' },
    { title: 'Grit',                           author: 'Angela Duckworth' },
    { title: 'The Obstacle Is the Way',        author: 'Ryan Holiday' },
    { title: 'Deep Work',                      author: 'Cal Newport' },
    { title: 'Flow',                           author: 'Mihaly Csikszentmihalyi' },
    { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey' },
    { title: 'Think and Grow Rich',            author: 'Napoleon Hill' },
    { title: 'Outliers',                       author: 'Malcolm Gladwell' },
    { title: 'Peak',                           author: 'Anders Ericsson' },
    { title: 'Can\'t Hurt Me',                 author: 'David Goggins' },
  ],
  Emotions: [
    { title: 'Emotional Intelligence',         author: 'Daniel Goleman' },
    { title: 'The Body Keeps the Score',       author: 'Bessel van der Kolk' },
    { title: 'Daring Greatly',                 author: 'Brené Brown' },
    { title: 'The Gifts of Imperfection',      author: 'Brené Brown' },
    { title: 'Permission to Feel',             author: 'Marc Brackett' },
    { title: 'Atlas of the Heart',             author: 'Brené Brown' },
    { title: 'Feeling Good',                   author: 'David D. Burns' },
    { title: 'Radical Acceptance',             author: 'Tara Brach' },
    { title: 'Running on Empty',               author: 'Jonice Webb' },
    { title: 'The Power of Vulnerability',     author: 'Brené Brown' },
    { title: 'Option B',                       author: 'Sheryl Sandberg' },
    { title: 'Mindsight',                      author: 'Daniel J. Siegel' },
  ],
  Health: [
    { title: 'Why We Sleep',                   author: 'Matthew Walker' },
    { title: 'Outlive',                        author: 'Peter Attia' },
    { title: 'Lifespan',                       author: 'David Sinclair' },
    { title: 'Spark',                          author: 'John J. Ratey' },
    { title: 'The Blue Zones',                 author: 'Dan Buettner' },
    { title: 'How Not to Die',                 author: 'Michael Greger' },
    { title: 'Breath',                         author: 'James Nestor' },
    { title: 'The Obesity Code',               author: 'Jason Fung' },
    { title: 'Born to Run',                    author: 'Christopher McDougall' },
    { title: 'The Power of Habit',             author: 'Charles Duhigg' },
    { title: 'Younger Next Year',              author: 'Chris Crowley' },
    { title: 'The Longevity Diet',             author: 'Valter Longo' },
  ],
  Relationships: [
    { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie' },
    { title: 'Attached',                       author: 'Amir Levine' },
    { title: 'The Five Love Languages',        author: 'Gary Chapman' },
    { title: 'Nonviolent Communication',       author: 'Marshall B. Rosenberg' },
    { title: 'Hold Me Tight',                  author: 'Sue Johnson' },
    { title: 'The Seven Principles for Making Marriage Work', author: 'John Gottman' },
    { title: 'Boundaries',                     author: 'Henry Cloud' },
    { title: 'The Art of Loving',              author: 'Erich Fromm' },
    { title: 'Come as You Are',                author: 'Emily Nagoski' },
    { title: 'Models',                         author: 'Mark Manson' },
    { title: 'Safe People',                    author: 'Henry Cloud' },
    { title: 'Crucial Conversations',          author: 'Kerry Patterson' },
  ],
  Finances: [
    { title: 'Rich Dad Poor Dad',              author: 'Robert T. Kiyosaki' },
    { title: 'The Psychology of Money',        author: 'Morgan Housel' },
    { title: 'I Will Teach You to Be Rich',    author: 'Ramit Sethi' },
    { title: 'The Total Money Makeover',       author: 'Dave Ramsey' },
    { title: 'The Millionaire Next Door',      author: 'Thomas J. Stanley' },
    { title: 'Your Money or Your Life',        author: 'Vicki Robin' },
    { title: 'The Richest Man in Babylon',     author: 'George S. Clason' },
    { title: 'Money: Master the Game',         author: 'Tony Robbins' },
    { title: 'The Little Book of Common Sense Investing', author: 'John C. Bogle' },
    { title: 'Die with Zero',                  author: 'Bill Perkins' },
    { title: 'Broke Millennial',               author: 'Erin Lowry' },
    { title: 'The Automatic Millionaire',      author: 'David Bach' },
  ],
};

let blPopularActivePillar = 'Spirituality';

function blOpenPopular() {
  blPopularActivePillar = 'Spirituality';
  const overlay = document.getElementById('bl-popular-overlay');
  const tabsEl  = document.getElementById('bl-popular-tabs');

  tabsEl.innerHTML = Object.keys(BL_POPULAR).map(p =>
    `<button class="bl-pop-tab${p === blPopularActivePillar ? ' active' : ''}" data-pillar="${p}">${p}</button>`
  ).join('');

  tabsEl.querySelectorAll('.bl-pop-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.bl-pop-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      blPopularActivePillar = btn.dataset.pillar;
      blRenderPopularList();
    });
  });

  blRenderPopularList();
  overlay.classList.add('open');
}

function blRenderPopularList() {
  const list  = document.getElementById('bl-popular-list');
  const books = BL_POPULAR[blPopularActivePillar] || [];
  list.innerHTML = books.map((b, i) =>
    `<button class="bl-pop-item">
      <span class="bl-pop-num">${i + 1}</span>
      <span class="bl-pop-info">
        <span class="bl-pop-title">${esc(b.title)}</span>
        <span class="bl-pop-author">${esc(b.author)}</span>
      </span>
    </button>`
  ).join('');

  list.querySelectorAll('.bl-pop-item').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const book = BL_POPULAR[blPopularActivePillar][i];
      document.getElementById('bl-book-input').value = book.title;
      blClosePopular();
      blShowPhase('bl-search-phase');
      setTimeout(() => document.getElementById('bl-book-input').focus(), 100);
    });
  });
}

function blClosePopular() {
  document.getElementById('bl-popular-overlay').classList.remove('open');
}

// ── Book Synopsis Modal ───────────────────────────────────────────

async function blOpenSynopsis() {
  const overlay = document.getElementById('bl-synopsis-overlay');
  const body    = document.getElementById('bl-synopsis-body');
  const title   = document.getElementById('bl-synopsis-modal-title');
  if (!blConfirmedBook) return;

  title.textContent = blConfirmedBook.title;
  overlay.classList.add('open');

  // Use cached synopsis if available
  if (blConfirmedBook.synopsis) {
    body.innerHTML = blConfirmedBook.synopsis;
    return;
  }

  body.innerHTML = `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Loading synopsis…</div>`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: `You are a book synopsis writer. Return a clear, engaging synopsis in plain text only — no markdown, no headers, no bullet points.`,
        messages: [{
          role: 'user',
          content: `Write a 3–4 paragraph synopsis of "${blConfirmedBook.title}" by ${blConfirmedBook.author}. Cover the main themes, key ideas, and what readers will gain from it.`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data.content[0].text.trim();
    blConfirmedBook.synopsis = text.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
    body.innerHTML = blConfirmedBook.synopsis;
  } catch {
    body.innerHTML = `<p class="advisor-error-text">Could not load synopsis. Please try again.</p>`;
  }
}

function blCloseSynopsis() {
  document.getElementById('bl-synopsis-overlay').classList.remove('open');
}

function closeBookLessons() {
  document.getElementById('book-lessons-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
}

// ── Step 1: Search — AI confirms book identity ────────────────────

async function blSearchBook() {
  const query = document.getElementById('bl-book-input').value.trim();
  if (!query) { document.getElementById('bl-book-input').focus(); return; }
  blCurrentBook = query;
  blShowPhase('bl-confirm-phase');
  const card = document.getElementById('bl-confirm-card');
  const startBtn = document.getElementById('bl-confirm-start-btn');
  card.innerHTML = `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Looking up book…</div>`;
  startBtn.style.display = 'none';
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: `You are a book reference assistant. Identify the most likely book from a title or partial title and return ONLY a valid JSON object. No extra text, no markdown code fences.`,
        messages: [{
          role: 'user',
          content: `Identify this book: "${query}"\n\nReturn exactly: { "title": "Full Book Title", "author": "Author Name", "tagline": "One sentence describing what the book is about and who it helps most." }`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.content[0].text.trim()
      .replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    blConfirmedBook = JSON.parse(raw);
    card.innerHTML = `
      <div class="bl-confirm-book-title">${esc(blConfirmedBook.title)}</div>
      <div class="bl-confirm-author">by ${esc(blConfirmedBook.author)}</div>
      <div class="bl-confirm-tagline">${esc(blConfirmedBook.tagline)}</div>
      <button class="bl-read-more-btn" id="bl-read-more-btn">Read more…</button>
    `;
    document.getElementById('bl-read-more-btn').addEventListener('click', blOpenSynopsis);
    startBtn.style.display = '';
  } catch (err) {
    card.innerHTML = `<span class="advisor-error-text">Could not identify the book. Try a more specific title.</span>`;
  }
}

// ── Step 2: Confirm → load full lesson ───────────────────────────

async function blStartLesson() {
  if (!blConfirmedBook) return;
  blRecordView();
  blChatMessages    = getBookDiscussion(blConfirmedBook.title);
  blCompletedTopics = new Set();
  blCurrentLesson   = null;
  blShowPhase('bl-lesson-phase');

  // Book header
  document.getElementById('bl-book-header').innerHTML = `
    <div class="bl-book-header-title">${esc(blConfirmedBook.title)}</div>
    <div class="bl-book-header-author">by ${esc(blConfirmedBook.author)}</div>
  `;

  // Show all sections, hide topic detail
  ['bl-overview-section','bl-key-concepts-section','bl-chapters-section',
   'bl-topics-section','bl-progress-section'].forEach(id =>
    document.getElementById(id).style.display = ''
  );
  document.getElementById('bl-topic-detail').style.display = 'none';

  // Loading states
  document.getElementById('bl-overview-content').innerHTML =
    `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Loading lesson…</div>`;
  document.getElementById('bl-key-concepts-list').innerHTML = '';
  document.getElementById('bl-chapters-content').innerHTML = '';
  document.getElementById('bl-topics-list').innerHTML = '';
  document.getElementById('bl-chat-messages').innerHTML = '';
  // Restore saved discussion messages (render without re-saving)
  if (blChatMessages.length) {
    blChatMessages.forEach(m => blRenderMessage(m.role, m.content, m.advisorId));
  }
  blUpdateProgress();

  // Save / saved state
  const saved = getSavedBooks().find(b => b.title === blConfirmedBook.title);
  document.getElementById('bl-save-btn').textContent = saved ? 'Saved' : 'Save to My Books';

  // Collapse chapters
  document.getElementById('bl-chapters-content').style.display = 'none';
  document.querySelector('#bl-chapters-toggle .bl-toggle-icon')?.classList.remove('open');

  await blFetchLesson();
}

async function blFetchLesson() {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1600,
        system: `You generate structured book lessons for the My Tribe app. Return ONLY a valid JSON object. No extra text, no markdown code fences.`,
        messages: [{
          role: 'user',
          content: `Generate a lesson for "${blConfirmedBook.title}" by ${blConfirmedBook.author}.

Return this exact JSON:
{
  "overview": "2-3 sentence overview of the book's core message and approach",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
  "chapters": ["Chapter 1: Title — brief description", "Chapter 2: ..."],
  "suggestedTopics": ["Topic or learning question 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"]
}

chapters: actual chapter names if known, otherwise key sections (6–10 items).
suggestedTopics: 6 practical topics or questions the reader can explore (e.g. "How identity-based habits work", "The role of environment in behavior change").`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.content[0].text.trim()
      .replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    blCurrentLesson = JSON.parse(raw);

    document.getElementById('bl-overview-content').textContent = blCurrentLesson.overview;

    document.getElementById('bl-key-concepts-list').innerHTML =
      blCurrentLesson.keyConcepts.map(c =>
        `<div class="bl-concept-chip">${esc(c)}</div>`
      ).join('');

    document.getElementById('bl-chapters-content').innerHTML =
      `<div class="bl-chapters-list">${
        blCurrentLesson.chapters.map(c =>
          `<div class="bl-chapter-item">${esc(c)}</div>`
        ).join('')
      }</div>`;

    blRenderTopics();
    blUpdateProgress();

    // Greeting from Guide — only on first load (no saved discussion yet)
    if (blChatMessages.length === 0) {
      blAppendMessage('advisor',
        `I've loaded **${blConfirmedBook.title}**. Click any topic above to explore it, or ask me anything about the book.`,
        'guide');
    }

  } catch (err) {
    document.getElementById('bl-overview-content').innerHTML =
      `<span class="advisor-error-text">${esc(String(err))}</span>`;
  }
}

// ── Topics ────────────────────────────────────────────────────────

function blRenderTopics() {
  if (!blCurrentLesson) return;
  const list = document.getElementById('bl-topics-list');
  list.innerHTML = blCurrentLesson.suggestedTopics.map((topic, i) => {
    const done = blCompletedTopics.has(i);
    return `<button class="bl-topic-btn${done ? ' completed' : ''}" data-topic="${i}">
      <span class="bl-topic-check">${done ? '✓' : ''}</span>
      <span>${esc(topic)}</span>
    </button>`;
  }).join('');
  list.querySelectorAll('.bl-topic-btn').forEach(btn =>
    btn.addEventListener('click', () => blClickTopic(parseInt(btn.dataset.topic)))
  );
}

async function blClickTopic(index) {
  if (!blCurrentLesson) return;
  const topic = blCurrentLesson.suggestedTopics[index];

  // Show topic detail, hide section list
  ['bl-overview-section','bl-key-concepts-section','bl-chapters-section',
   'bl-topics-section','bl-progress-section'].forEach(id =>
    document.getElementById(id).style.display = 'none'
  );
  const detail = document.getElementById('bl-topic-detail');
  const content = document.getElementById('bl-topic-content');
  detail.style.display = '';
  content.innerHTML = `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Loading topic…</div>`;
  document.querySelector('.bl-lesson-body').scrollTop = 0;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: `You are a learning guide for the My Tribe app. Explain book topics clearly, practically, and with a personal-growth focus.`,
        messages: [{
          role: 'user',
          content: `Book: "${blConfirmedBook.title}" by ${blConfirmedBook.author}
Topic: "${topic}"

Respond with exactly three labeled sections using this format:

**Concept Explanation**
[2-3 sentences explaining this concept from the book]

**Real Life Application**
[2-3 sentences on how to apply this in real life]

**Reflection Question**
[One thoughtful question for the reader to consider]`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    content.innerHTML = blFormatTopicContent(data.content[0].text, topic);
    blCompletedTopics.add(index);
    blUpdateProgress();
  } catch (err) {
    content.innerHTML = `<span class="advisor-error-text">${esc(String(err))}</span>`;
  }
}

function blFormatTopicContent(text, topicTitle) {
  let html = `<div class="bl-topic-title">${esc(topicTitle)}</div>`;
  // Convert **Section Label** to colored headers, preserve surrounding text
  const formatted = text
    .replace(/\*\*([^*]+)\*\*/g, (_, label) =>
      `</p><div class="bl-topic-section-label">${esc(label)}</div><p>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, ' ');
  html += `<p>${formatted}</p>`;
  // Clean up empty <p> tags
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}

function blBackToTopics() {
  document.getElementById('bl-topic-detail').style.display = 'none';
  ['bl-overview-section','bl-key-concepts-section','bl-chapters-section',
   'bl-topics-section','bl-progress-section'].forEach(id =>
    document.getElementById(id).style.display = ''
  );
  blRenderTopics();
}

function blUpdateProgress() {
  const total = blCurrentLesson ? blCurrentLesson.suggestedTopics.length : 0;
  const done  = blCompletedTopics.size;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  document.getElementById('bl-progress-fill').style.width = pct + '%';
  document.getElementById('bl-progress-label').textContent = `${done} of ${total} topics completed`;
}

// ── Chat ──────────────────────────────────────────────────────────

// Renders a single message into the chat panel (no save side-effect).
function blRenderMessage(role, content, advisorId) {
  const msgs = document.getElementById('bl-chat-messages');
  const div  = document.createElement('div');

  if (role === 'user') {
    div.className = 'advisor-card msg-user-thread';
    div.innerHTML = `
      <div class="advisor-thread-avatar user-avatar-circle">You</div>
      <div class="advisor-meta">
        <div class="advisor-header"><span class="advisor-name">You</span></div>
        <div class="advisor-text">${esc(content)}</div>
      </div>`;
  } else {
    const a         = ADVISORS[advisorId] || ADVISORS.guide;
    const avatarSrc = `../assets/avatars/${advisorId}.png`;
    const parsed    = typeof marked !== 'undefined' ? marked.parse(content) : esc(content);
    div.className   = 'advisor-card';
    div.style.setProperty('--advisor-color', a.color);
    div.innerHTML = `
      <img class="advisor-thread-avatar" src="${avatarSrc}" alt="${a.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="advisor-avatar" style="background:${a.color};display:none">${a.initial}</div>
      <div class="advisor-meta">
        <div class="advisor-header"><span class="advisor-name">${esc(a.name)}</span></div>
        <div class="advisor-text">${parsed}</div>
      </div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Appends a message, saves to localStorage, and renders it.
function blAppendMessage(role, content, advisorId) {
  blChatMessages.push({ role, content, advisorId });
  if (blConfirmedBook) saveBookDiscussion(blConfirmedBook.title, blChatMessages);
  blRenderMessage(role, content, advisorId);
}

// Resolve @mention to an advisor ID for book lessons
function blResolveAdvisor(text) {
  const mention = extractMentions(text)[0];
  if (!mention) return blActiveAdvisor || 'guide';
  // Try exact match first, then prefix match
  const ids = Object.keys(ADVISORS);
  return ids.find(id => id === mention)
      || ids.find(id => id.startsWith(mention))
      || 'guide';
}

function blToggleDiscussion() {
  const area   = document.getElementById('bl-chat-area');
  const toggle = document.getElementById('bl-discussion-toggle');
  const hidden = area.classList.toggle('collapsed');
  toggle.classList.toggle('active', !hidden);
}

function blOpenDrawer() {
  document.getElementById('bl-chat-area').classList.add('drawer-open');
  document.getElementById('bl-drawer-backdrop').classList.add('visible');
  setTimeout(() => document.getElementById('bl-chat-input').focus(), 300);
}

function blCloseDrawer() {
  document.getElementById('bl-chat-area').classList.remove('drawer-open');
  document.getElementById('bl-drawer-backdrop').classList.remove('visible');
}

function cfToggleDiscussion() {
  const col    = document.getElementById('campfire-discussion-col');
  const toggle = document.getElementById('cf-discussion-toggle');
  const hidden = col.classList.toggle('collapsed');
  toggle.classList.toggle('active', !hidden);
}

function cfOpenDrawer() {
  document.getElementById('campfire-discussion-col').classList.add('drawer-open');
  document.getElementById('cf-drawer-backdrop').classList.add('visible');
}

function cfCloseDrawer() {
  document.getElementById('campfire-discussion-col').classList.remove('drawer-open');
  document.getElementById('cf-drawer-backdrop').classList.remove('visible');
}

async function blSendChat() {
  const input    = document.getElementById('bl-chat-input');
  const rawMsg   = input.value.trim();
  if (!rawMsg) return;
  input.value = '';

  // Resolve advisor from @mention, fall back to last used
  const advisorId = blResolveAdvisor(rawMsg);
  blActiveAdvisor = advisorId;
  // Strip @mention for AI, keep original for display
  const aiMsg = removeMentions(rawMsg);

  blAppendMessage('user', rawMsg, null);

  const msgs       = document.getElementById('bl-chat-messages');
  const loadingDiv = document.createElement('div');
  const a          = ADVISORS[advisorId] || ADVISORS.guide;
  const avatarSrc  = `../assets/avatars/${advisorId}.png`;
  loadingDiv.className = 'advisor-card';
  loadingDiv.style.setProperty('--advisor-color', a.color);
  loadingDiv.innerHTML = `
    <img class="advisor-thread-avatar" src="${avatarSrc}" alt="${a.name}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="advisor-avatar" style="background:${a.color};display:none">${a.initial}</div>
    <div class="advisor-meta">
      <div class="advisor-header"><span class="advisor-name">${esc(a.name)}</span></div>
      <div class="advisor-text"><span class="advisor-thinking">${esc(a.name)} is thinking<div class="typing-dots" style="height:auto"><span></span><span></span><span></span></div></span></div>
    </div>`;
  msgs.appendChild(loadingDiv);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const bookCtx    = blConfirmedBook
      ? `"${blConfirmedBook.title}" by ${blConfirmedBook.author}`
      : blCurrentBook;
    const baseSystem = a.system || `You are a wise learning guide. Keep responses concise and practical.`;
    const sysPrompt  = `${baseSystem}\n\nYou are currently helping the user learn from the book ${bookCtx}. Keep answers relevant to the book's lessons and their real-life application. Be concise (3-5 sentences).`;

    const history = blChatMessages.slice(-12)
      .filter(m => m.role === 'user' || m.role === 'advisor')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
    const apiMessages = history.slice(0, -1);
    apiMessages.push({ role: 'user', content: aiMsg || rawMsg });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: sysPrompt, messages: apiMessages })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    loadingDiv.remove();
    blAppendMessage('advisor', data.content[0].text, advisorId);
  } catch (err) {
    loadingDiv.remove();
    blAppendMessage('advisor', `Sorry, something went wrong. ${String(err)}`, advisorId);
  }
}

// ── Save / Library ────────────────────────────────────────────────

function blSaveBook() {
  if (!blConfirmedBook) return;
  const books  = getSavedBooks();
  const exists = books.find(b => b.title === blConfirmedBook.title);
  if (!exists) {
    books.unshift({
      title: blConfirmedBook.title,
      author: blConfirmedBook.author,
      tagline: blConfirmedBook.tagline || '',
      savedAt: new Date().toISOString()
    });
    saveBooksData(books);
  }
  document.getElementById('bl-save-btn').textContent = 'Saved';
}

function blOpenLibraryModal(tab) {
  const overlay = document.getElementById('bl-library-overlay');
  if (!overlay) return;
  // Set active filter tab and modal title
  overlay.querySelectorAll('.history-filter-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.blFilter === tab)
  );
  document.getElementById('bl-library-modal-title').textContent =
    tab === 'favorites' ? 'My Library' : 'Book History';
  overlay.classList.add('open');
  blRenderLibrary(tab);
}

function blOpenFavorites() { blOpenLibraryModal('favorites'); }
function blOpenHistory()    { blOpenLibraryModal('history'); }

function blCloseLibraryModal() {
  document.getElementById('bl-library-overlay')?.classList.remove('open');
}

function blToggleSavedBook(title) {
  const books = getSavedBooks();
  const idx = books.findIndex(b => b.title === title);
  if (idx === -1) {
    // Find from viewed to get full info
    const viewed = getViewedBooks();
    const b = viewed.find(v => v.title === title) || { title, author: '', tagline: '' };
    books.unshift({ title: b.title, author: b.author, tagline: b.tagline || '', savedAt: new Date().toISOString() });
  } else {
    books.splice(idx, 1);
  }
  saveBooksData(books);
}

function blRenderLibrary(tab) {
  const list = document.getElementById('bl-library-list');
  if (!list) return;

  if (tab === 'favorites') {
    const books = getSavedBooks();
    if (books.length === 0) {
      list.innerHTML = '<p class="history-empty">No saved books yet. Start a lesson and save your first book.</p>';
      return;
    }
    list.innerHTML = books.map((b, i) =>
      `<div class="history-item bl-lib-item" data-idx="${i}" data-tab="favorites">
        <div class="history-item-info">
          <div class="history-item-title">${esc(b.title)}</div>
          <div class="history-item-meta">by ${esc(b.author)}</div>
        </div>
        <div class="history-item-actions">
          <button class="history-heart-btn active" data-action="bl-fav" data-title="${esc(b.title)}" title="Remove from favorites">${HEART_FILLED}</button>
        </div>
      </div>`
    ).join('');

  } else {
    const viewed = getViewedBooks();
    if (viewed.length === 0) {
      list.innerHTML = '<p class="history-empty">No books viewed yet. Start a lesson to build your history.</p>';
      return;
    }
    const saved = getSavedBooks();
    list.innerHTML = viewed.map((b, i) => {
      const isSaved = saved.some(s => s.title === b.title);
      return `<div class="history-item bl-lib-item" data-idx="${i}" data-tab="history">
        <div class="history-item-info">
          <div class="history-item-title">${esc(b.title)}</div>
          <div class="history-item-meta">by ${esc(b.author)} &middot; ${formatRelativeDate(b.viewedAt)}</div>
        </div>
        <div class="history-item-actions">
          <button class="history-heart-btn${isSaved ? ' active' : ''}" data-action="bl-fav" data-title="${esc(b.title)}" title="${isSaved ? 'Remove from favorites' : 'Save to favorites'}">${isSaved ? HEART_FILLED : HEART_OUTLINE}</button>
        </div>
      </div>`;
    }).join('');
  }

  // Click on item body → start lesson; click on heart → toggle save
  list.querySelectorAll('.bl-lib-item').forEach(item => {
    item.querySelector('.history-item-info').addEventListener('click', () => {
      const idx = parseInt(item.dataset.idx);
      const t = item.dataset.tab;
      blConfirmedBook = t === 'favorites' ? getSavedBooks()[idx] : getViewedBooks()[idx];
      blCloseLibraryModal();
      blStartLesson();
    });
    item.querySelector('[data-action="bl-fav"]').addEventListener('click', e => {
      const title = e.currentTarget.dataset.title;
      blToggleSavedBook(title);
      blRenderLibrary(tab); // re-render
    });
  });
}

// ── Core Lessons ─────────────────────────────────────────────────

const CL_SUGGESTIONS = [
  { title: 'Identity',      category: 'Self' },
  { title: 'Stages',        category: 'Growth' },
  { title: 'Principles',    category: 'Character' },
  { title: 'Needs',         category: 'Psychology' },
  { title: 'Paradigms',     category: 'Mindset' },
  { title: 'Discovery',     category: 'Journey' },
  { title: 'Execution',     category: 'Action' },
  { title: 'Wounds',        category: 'Healing' },
  { title: 'Tribes',        category: 'Community' },
  { title: 'Relationships', category: 'Connection' },
  { title: 'Happiness',     category: 'Wellbeing' },
  { title: 'Struggles',     category: 'Resilience' },
  { title: 'Roots',         category: 'Foundation' },
  { title: 'Stories',       category: 'Narrative' },
];

let clCurrentLesson   = null;  // { title, category }
let clLessonContent   = null;  // { overview, keyConcepts[], topics[] }
let clChatMessages    = [];
let clCompletedTopics = new Set();
let clActiveAdvisor   = 'guide';

// ── Persistence ──────────────────────────────────────────────────

function clGetSavedLessons() {
  try { return JSON.parse(localStorage.getItem('tribe_cl_lessons') || '[]'); } catch { return []; }
}
function clSaveLessonsData(lessons) {
  localStorage.setItem('tribe_cl_lessons', JSON.stringify(lessons));
}
function clGetViewedLessons() {
  try { return JSON.parse(localStorage.getItem('tribe_cl_viewed') || '[]'); } catch { return []; }
}
function clSaveViewedLessons(lessons) {
  localStorage.setItem('tribe_cl_viewed', JSON.stringify(lessons));
}
function clGetDiscussion(title) {
  try {
    const all = JSON.parse(localStorage.getItem('tribe_cl_discussions') || '{}');
    return all[title] || [];
  } catch { return []; }
}
function clSaveDiscussion(title, messages) {
  try {
    const all = JSON.parse(localStorage.getItem('tribe_cl_discussions') || '{}');
    all[title] = messages;
    localStorage.setItem('tribe_cl_discussions', JSON.stringify(all));
  } catch {}
}
function clRecordView() {
  if (!clCurrentLesson) return;
  const viewed = clGetViewedLessons();
  const filtered = viewed.filter(l => l.title !== clCurrentLesson.title);
  filtered.unshift({ title: clCurrentLesson.title, category: clCurrentLesson.category, viewedAt: Date.now() });
  clSaveViewedLessons(filtered.slice(0, 50));
}

// ── Page open / close ─────────────────────────────────────────────

function clShowPhase(phaseId) {
  ['cl-search-phase', 'cl-lesson-phase'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === phaseId) ? (id === 'cl-lesson-phase' ? 'flex' : '') : 'none';
  });
}

function openCoreLessons() {
  closeBookLessons();
  closeCampfire();
  closeVoting();
  closeDebate();
  clCurrentLesson   = null;
  clLessonContent   = null;
  clChatMessages    = [];
  clCompletedTopics = new Set();
  clActiveAdvisor   = 'guide';
  document.getElementById('cl-lesson-input').value = '';
  document.getElementById('cl-no-results').style.display = 'none';
  clShowPhase('cl-search-phase');
  clRenderSuggestions();
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('core-lessons-page').style.display = 'flex';
  setTimeout(() => document.getElementById('cl-lesson-input').focus(), 100);
}

function closeCoreLessons() {
  document.getElementById('core-lessons-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
}

// ── Carousel ──────────────────────────────────────────────────────

function clRenderSuggestions() {
  const track = document.getElementById('cl-suggestions-track');
  const dots  = document.getElementById('cl-suggestions-dots');
  if (!track || !dots) return;

  track.innerHTML = CL_SUGGESTIONS.map(l => {
    const initial = l.category.charAt(0).toUpperCase();
    return `<button class="cl-lesson-suggestion-card">
      <div class="cl-lesson-sug-icon">${initial}</div>
      <div class="cl-lesson-sug-title">${esc(l.title)}</div>
      <div class="cl-lesson-sug-category">${esc(l.category)}</div>
    </button>`;
  }).join('');

  track.querySelectorAll('.cl-lesson-suggestion-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      clCurrentLesson = CL_SUGGESTIONS[i];
      clLoadLesson();
    });
  });

  dots.innerHTML = CL_SUGGESTIONS.map((_, i) =>
    `<span class="suggestion-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  track.addEventListener('scroll', () => {
    const card = track.querySelector('.cl-lesson-suggestion-card');
    if (!card) return;
    const cardW  = card.offsetWidth + 12;
    const active = Math.min(Math.round(track.scrollLeft / cardW), CL_SUGGESTIONS.length - 1);
    dots.querySelectorAll('.suggestion-dot').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }, { passive: true });

  document.getElementById('cl-suggestions-prev')?.addEventListener('click', () => {
    const card = track.querySelector('.cl-lesson-suggestion-card');
    if (card) track.scrollBy({ left: -(card.offsetWidth + 12), behavior: 'smooth' });
  });
  document.getElementById('cl-suggestions-next')?.addEventListener('click', () => {
    const card = track.querySelector('.cl-lesson-suggestion-card');
    if (card) track.scrollBy({ left: card.offsetWidth + 12, behavior: 'smooth' });
  });
}

// ── Search ────────────────────────────────────────────────────────

function clSearch() {
  const query = document.getElementById('cl-lesson-input').value.trim();
  if (!query) { document.getElementById('cl-lesson-input').focus(); return; }

  const q     = query.toLowerCase();
  const match = CL_SUGGESTIONS.find(l => l.title.toLowerCase().includes(q));
  if (match) {
    document.getElementById('cl-no-results').style.display = 'none';
    clCurrentLesson = match;
    clLoadLesson();
  } else {
    document.getElementById('cl-no-results').style.display = '';
  }
}

// ── Load lesson ───────────────────────────────────────────────────

async function clLoadLesson() {
  if (!clCurrentLesson) return;
  clRecordView();
  clChatMessages    = clGetDiscussion(clCurrentLesson.title);
  clCompletedTopics = new Set();
  clLessonContent   = null;
  clShowPhase('cl-lesson-phase');

  document.getElementById('cl-lesson-header').innerHTML = `
    <div class="bl-book-header-title">${esc(clCurrentLesson.title)}</div>
    <div class="bl-book-header-author">${esc(clCurrentLesson.category)}</div>
  `;

  ['cl-overview-section','cl-key-concepts-section','cl-topics-section','cl-progress-section']
    .forEach(id => document.getElementById(id).style.display = '');
  document.getElementById('cl-topic-detail').style.display = 'none';

  document.getElementById('cl-overview-content').innerHTML =
    `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Loading lesson…</div>`;
  document.getElementById('cl-key-concepts-list').innerHTML = '';
  document.getElementById('cl-topics-list').innerHTML = '';
  document.getElementById('cl-chat-messages').innerHTML = '';

  if (clChatMessages.length) {
    clChatMessages.forEach(m => clRenderMessage(m.role, m.content, m.advisorId));
  }
  clUpdateProgress();

  const saved = clGetSavedLessons().find(l => l.title === clCurrentLesson.title);
  document.getElementById('cl-save-btn').textContent = saved ? 'Saved' : 'Save to My Library';

  await clFetchLesson();
}

async function clFetchLesson() {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1400,
        system: `You generate structured life lessons for the My Tribe app. Return ONLY a valid JSON object. No extra text, no markdown code fences.`,
        messages: [{
          role: 'user',
          content: `Generate a lesson on the topic "${clCurrentLesson.title}" (category: ${clCurrentLesson.category}).

Return this exact JSON:
{
  "overview": "2-3 sentence overview of this life lesson and its core message",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
  "topics": ["Topic or learning question 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"]
}

keyConcepts: core ideas or principles within this lesson.
topics: 6 practical topics or questions to explore (e.g. for Identity: "How identity shapes your decisions", "The role of beliefs in identity formation").`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw  = data.content[0].text.trim()
      .replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    clLessonContent = JSON.parse(raw);

    document.getElementById('cl-overview-content').textContent = clLessonContent.overview;
    document.getElementById('cl-key-concepts-list').innerHTML =
      clLessonContent.keyConcepts.map(c => `<div class="bl-concept-chip">${esc(c)}</div>`).join('');

    clRenderTopics();
    clUpdateProgress();

    // Greeting from Guide — only on first load (no saved discussion yet)
    if (clChatMessages.length === 0) {
      clAppendMessage('advisor',
        `I've loaded **${clCurrentLesson.title}**. Click any topic above to explore it, or ask me anything about this lesson.`,
        'guide');
    }
  } catch (err) {
    document.getElementById('cl-overview-content').innerHTML =
      `<span class="advisor-error-text">${esc(String(err))}</span>`;
  }
}

// ── Topics ────────────────────────────────────────────────────────

function clRenderTopics() {
  if (!clLessonContent) return;
  const list = document.getElementById('cl-topics-list');
  list.innerHTML = clLessonContent.topics.map((topic, i) => {
    const done = clCompletedTopics.has(i);
    return `<button class="bl-topic-btn${done ? ' completed' : ''}" data-topic="${i}">
      <span class="bl-topic-check">${done ? '✓' : ''}</span>
      <span>${esc(topic)}</span>
    </button>`;
  }).join('');
  list.querySelectorAll('.bl-topic-btn').forEach(btn =>
    btn.addEventListener('click', () => clClickTopic(parseInt(btn.dataset.topic)))
  );
}

async function clClickTopic(index) {
  if (!clLessonContent) return;
  const topic = clLessonContent.topics[index];

  ['cl-overview-section','cl-key-concepts-section','cl-topics-section','cl-progress-section']
    .forEach(id => document.getElementById(id).style.display = 'none');
  const detail  = document.getElementById('cl-topic-detail');
  const content = document.getElementById('cl-topic-content');
  detail.style.display = '';
  content.innerHTML = `<div class="bl-loading"><div class="typing-dots"><span></span><span></span><span></span></div> Loading topic…</div>`;
  const lessonBody = document.querySelector('#core-lessons-page .bl-lesson-body');
  if (lessonBody) lessonBody.scrollTop = 0;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: `You are a learning guide for the My Tribe app. Explain life lesson topics clearly, practically, and with a personal-growth focus.`,
        messages: [{
          role: 'user',
          content: `Lesson: "${clCurrentLesson.title}" (${clCurrentLesson.category})
Topic: "${topic}"

Respond with exactly three labeled sections using this format:

**Concept Explanation**
[2-3 sentences explaining this concept]

**Real Life Application**
[2-3 sentences on how to apply this in real life]

**Reflection Question**
[One thoughtful question for the reader to consider]`
        }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    content.innerHTML = clFormatTopicContent(data.content[0].text, topic);
    clCompletedTopics.add(index);
    clUpdateProgress();
  } catch (err) {
    content.innerHTML = `<span class="advisor-error-text">${esc(String(err))}</span>`;
  }
}

function clFormatTopicContent(text, topicTitle) {
  let html = `<div class="bl-topic-title">${esc(topicTitle)}</div>`;
  const formatted = text
    .replace(/\*\*([^*]+)\*\*/g, (_, label) =>
      `</p><div class="bl-topic-section-label">${esc(label)}</div><p>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, ' ');
  html += `<p>${formatted}</p>`;
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}

function clBackToTopics() {
  document.getElementById('cl-topic-detail').style.display = 'none';
  ['cl-overview-section','cl-key-concepts-section','cl-topics-section','cl-progress-section']
    .forEach(id => document.getElementById(id).style.display = '');
  clRenderTopics();
}

function clUpdateProgress() {
  const total = clLessonContent ? clLessonContent.topics.length : 0;
  const done  = clCompletedTopics.size;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  document.getElementById('cl-progress-fill').style.width = pct + '%';
  document.getElementById('cl-progress-label').textContent = `${done} of ${total} topics completed`;
}

// ── Save ──────────────────────────────────────────────────────────

function clSaveLesson() {
  if (!clCurrentLesson) return;
  const lessons = clGetSavedLessons();
  if (!lessons.find(l => l.title === clCurrentLesson.title)) {
    lessons.unshift({ title: clCurrentLesson.title, category: clCurrentLesson.category, savedAt: new Date().toISOString() });
    clSaveLessonsData(lessons);
  }
  document.getElementById('cl-save-btn').textContent = 'Saved';
}

function clToggleSavedLesson(title) {
  const lessons = clGetSavedLessons();
  const idx     = lessons.findIndex(l => l.title === title);
  if (idx === -1) {
    const viewed = clGetViewedLessons();
    const found  = viewed.find(v => v.title === title) || CL_SUGGESTIONS.find(s => s.title === title) || { title, category: '' };
    lessons.unshift({ title: found.title, category: found.category, savedAt: new Date().toISOString() });
  } else {
    lessons.splice(idx, 1);
  }
  clSaveLessonsData(lessons);
}

// ── Library modal ─────────────────────────────────────────────────

function clOpenLibraryModal(tab) {
  const overlay = document.getElementById('cl-library-overlay');
  if (!overlay) return;
  overlay.querySelectorAll('.history-filter-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.clFilter === tab)
  );
  document.getElementById('cl-library-modal-title').textContent =
    tab === 'favorites' ? 'My Library' : 'Lesson History';
  overlay.classList.add('open');
  clRenderLibrary(tab);
}

function clCloseLibraryModal() {
  document.getElementById('cl-library-overlay')?.classList.remove('open');
}

function clRenderLibrary(tab) {
  const list = document.getElementById('cl-library-list');
  if (!list) return;

  if (tab === 'favorites') {
    const lessons = clGetSavedLessons();
    if (lessons.length === 0) {
      list.innerHTML = '<p class="history-empty">No saved lessons yet. Start a lesson and save it to your library.</p>';
      return;
    }
    list.innerHTML = lessons.map((l, i) =>
      `<div class="history-item cl-lib-item" data-idx="${i}" data-tab="favorites">
        <div class="history-item-info">
          <div class="history-item-title">${esc(l.title)}</div>
          <div class="history-item-meta">${esc(l.category)}</div>
        </div>
        <div class="history-item-actions">
          <button class="history-heart-btn active" data-action="cl-fav" data-title="${esc(l.title)}" title="Remove from library">${HEART_FILLED}</button>
        </div>
      </div>`
    ).join('');
  } else {
    const viewed = clGetViewedLessons();
    if (viewed.length === 0) {
      list.innerHTML = '<p class="history-empty">No lessons viewed yet. Start a lesson to build your history.</p>';
      return;
    }
    const saved = clGetSavedLessons();
    list.innerHTML = viewed.map((l, i) => {
      const isSaved = saved.some(s => s.title === l.title);
      return `<div class="history-item cl-lib-item" data-idx="${i}" data-tab="history">
        <div class="history-item-info">
          <div class="history-item-title">${esc(l.title)}</div>
          <div class="history-item-meta">${esc(l.category)} &middot; ${formatRelativeDate(l.viewedAt)}</div>
        </div>
        <div class="history-item-actions">
          <button class="history-heart-btn${isSaved ? ' active' : ''}" data-action="cl-fav" data-title="${esc(l.title)}" title="${isSaved ? 'Remove from library' : 'Save to library'}">${isSaved ? HEART_FILLED : HEART_OUTLINE}</button>
        </div>
      </div>`;
    }).join('');
  }

  list.querySelectorAll('.cl-lib-item').forEach(item => {
    item.querySelector('.history-item-info').addEventListener('click', () => {
      const idx    = parseInt(item.dataset.idx);
      const t      = item.dataset.tab;
      const source = t === 'favorites' ? clGetSavedLessons() : clGetViewedLessons();
      const entry  = source[idx];
      clCurrentLesson = { title: entry.title, category: entry.category };
      clCloseLibraryModal();
      clLoadLesson();
    });
    item.querySelector('[data-action="cl-fav"]').addEventListener('click', e => {
      clToggleSavedLesson(e.currentTarget.dataset.title);
      clRenderLibrary(tab);
    });
  });
}

// ── Discussion ────────────────────────────────────────────────────

function clRenderMessage(role, content, advisorId) {
  const msgs = document.getElementById('cl-chat-messages');
  const div  = document.createElement('div');

  if (role === 'user') {
    div.className = 'advisor-card msg-user-thread';
    div.innerHTML = `
      <div class="advisor-thread-avatar user-avatar-circle">You</div>
      <div class="advisor-meta">
        <div class="advisor-header"><span class="advisor-name">You</span></div>
        <div class="advisor-text">${esc(content)}</div>
      </div>`;
  } else {
    const a         = ADVISORS[advisorId] || ADVISORS.guide;
    const avatarSrc = `../assets/avatars/${advisorId}.png`;
    const parsed    = typeof marked !== 'undefined' ? marked.parse(content) : esc(content);
    div.className   = 'advisor-card';
    div.style.setProperty('--advisor-color', a.color);
    div.innerHTML = `
      <img class="advisor-thread-avatar" src="${avatarSrc}" alt="${a.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="advisor-avatar" style="background:${a.color};display:none">${a.initial}</div>
      <div class="advisor-meta">
        <div class="advisor-header"><span class="advisor-name">${esc(a.name)}</span></div>
        <div class="advisor-text">${parsed}</div>
      </div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function clAppendMessage(role, content, advisorId) {
  clChatMessages.push({ role, content, advisorId });
  if (clCurrentLesson) clSaveDiscussion(clCurrentLesson.title, clChatMessages);
  clRenderMessage(role, content, advisorId);
}

function clResolveAdvisor(text) {
  const mention = extractMentions(text)[0];
  if (!mention) return clActiveAdvisor || 'guide';
  const ids = Object.keys(ADVISORS);
  return ids.find(id => id === mention) || ids.find(id => id.startsWith(mention)) || 'guide';
}

async function clSendChat() {
  const input  = document.getElementById('cl-chat-input');
  const rawMsg = input.value.trim();
  if (!rawMsg) return;
  input.value = '';

  const advisorId = clResolveAdvisor(rawMsg);
  clActiveAdvisor = advisorId;
  const aiMsg = removeMentions(rawMsg);

  clAppendMessage('user', rawMsg, null);

  const msgs       = document.getElementById('cl-chat-messages');
  const loadingDiv = document.createElement('div');
  const a          = ADVISORS[advisorId] || ADVISORS.guide;
  const avatarSrc  = `../assets/avatars/${advisorId}.png`;
  loadingDiv.className = 'advisor-card';
  loadingDiv.style.setProperty('--advisor-color', a.color);
  loadingDiv.innerHTML = `
    <img class="advisor-thread-avatar" src="${avatarSrc}" alt="${a.name}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="advisor-avatar" style="background:${a.color};display:none">${a.initial}</div>
    <div class="advisor-meta">
      <div class="advisor-header"><span class="advisor-name">${esc(a.name)}</span></div>
      <div class="advisor-text"><span class="advisor-thinking">${esc(a.name)} is thinking<div class="typing-dots" style="height:auto"><span></span><span></span><span></span></div></span></div>
    </div>`;
  msgs.appendChild(loadingDiv);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const lessonCtx  = clCurrentLesson ? `"${clCurrentLesson.title}" (${clCurrentLesson.category})` : 'a life lesson';
    const baseSystem = a.system || `You are a wise learning guide. Keep responses concise and practical.`;
    const sysPrompt  = `${baseSystem}\n\nYou are helping the user explore the lesson ${lessonCtx} from the My Tribe system. Keep answers relevant to the lesson's themes and their real-life application. Be concise (3-5 sentences).`;

    const history     = clChatMessages.slice(-12)
      .filter(m => m.role === 'user' || m.role === 'advisor')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
    const apiMessages = history.slice(0, -1);
    apiMessages.push({ role: 'user', content: aiMsg || rawMsg });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: sysPrompt, messages: apiMessages })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    loadingDiv.remove();
    clAppendMessage('advisor', data.content[0].text, advisorId);
  } catch (err) {
    loadingDiv.remove();
    clAppendMessage('advisor', `Sorry, something went wrong. ${String(err)}`, advisorId);
  }
}

// ── Discussion panel controls ─────────────────────────────────────

function clToggleDiscussion() {
  const area   = document.getElementById('cl-chat-area');
  const toggle = document.getElementById('cl-discussion-toggle');
  const hidden = area.classList.toggle('collapsed');
  toggle.classList.toggle('active', !hidden);
}

function clOpenDrawer() {
  document.getElementById('cl-chat-area').classList.add('drawer-open');
  document.getElementById('cl-drawer-backdrop').classList.add('visible');
  setTimeout(() => document.getElementById('cl-chat-input').focus(), 300);
}

function clCloseDrawer() {
  document.getElementById('cl-chat-area').classList.remove('drawer-open');
  document.getElementById('cl-drawer-backdrop').classList.remove('visible');
}

// ── Campfire (Storytelling Experience) ───────────────────────────

let cfRunning     = false;
let cfStep        = 1;
let cfStoryteller = null;  // 'advisor' | 'you' | 'random'
let cfAdvisorId   = null;  // selected advisor id (when storyteller='advisor')
let cfPillar      = null;  // 'Spirituality' | 'Mindset' | 'Emotions' | 'Health' | 'Relationships' | 'Finances'
let cfFormat      = null;  // 'fireside' | 'campfire' | 'bonfire'
let cfStoryText   = '';
let cfStoryTitle  = '';

const CF_ALL_ADVISORS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank', 'guide'];

const CF_FORMATS = {
  fireside: { label: 'Fireside', discussantCount: 2 },
  campfire:  { label: 'Campfire', discussantCount: 3 },
  bonfire:   { label: 'Bonfire',  discussantCount: 5 }
};

const CF_PILLAR_EMOJI = {
  Spirituality: '🕊', Mindset: '🧠', Emotions: '💛',
  Health: '🌿', Relationships: '🤝', Finances: '💼'
};

const CF_MOD_OPENINGS = {
  fireside: "Welcome to the fire. Tonight we gather briefly — one story, honestly told. Let's begin.",
  campfire: "Welcome to the campfire. We have time tonight to sit with a story, let it breathe, and carry something home.",
  bonfire:  "The fire is burning bright tonight. We've gathered for a longer, deeper sit. Settle in — there's something worth hearing."
};

function openCampfire() {
  closeBookLessons();
  closeCoreLessons();
  resetCampfireSetup();
  document.getElementById('campfire-setup').style.display = '';
  document.getElementById('campfire-session').style.display = 'none';
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('campfire-page').style.display = 'flex';
}

function closeCampfire() {
  document.getElementById('campfire-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
  cfRunning = false;
}

function resetCampfireSetup() {
  cfStep = 1; cfStoryteller = null; cfAdvisorId = null;
  cfPillar = null; cfFormat = null; cfStoryText = ''; cfStoryTitle = '';
  cfGoToStep(1);
  document.querySelectorAll('.cf-storyteller-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.cf-pillar-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cf-format-card').forEach(c => c.classList.remove('active'));
  document.getElementById('campfire-advisor-picker').style.display = 'none';
  document.getElementById('cf-step1-next').disabled = true;
  document.getElementById('cf-step2-next').disabled = true;
  document.getElementById('campfire-start-btn').disabled = true;
  document.getElementById('btn-campfire-util-new').style.display = 'none';
  document.getElementById('campfire-new-sep').style.display = 'none';
}

function cfGoToStep(n) {
  cfStep = n;
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`cf-step-${i}`);
    if (el) el.style.display = i === n ? '' : 'none';
  }
}

function renderCfAdvisorPicker() {
  const container = document.getElementById('cf-advisor-avatars');
  container.innerHTML = '';
  CF_ALL_ADVISORS.forEach(id => {
    const advisor = ADVISORS[id];
    if (!advisor) return;
    const src = ADVISOR_AVATAR[id];
    const btn = document.createElement('button');
    btn.className = 'advisor-chip';
    btn.dataset.advisorId = id;
    const imgHtml = src
      ? `<img class="advisor-avatar-img" src="${src}" alt="${advisor.name}" onerror="this.style.display='none'">`
      : `<div class="advisor-avatar-img" style="background:${advisor.color};display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:700">${advisor.initial}</div>`;
    btn.innerHTML = `${imgHtml}<span class="advisor-chip-name">${advisor.name}</span>`;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.advisor-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cfAdvisorId = id;
      updateCfStep1Next();
    });
    container.appendChild(btn);
  });
}

function updateCfStep1Next() {
  const btn = document.getElementById('cf-step1-next');
  btn.disabled = cfStoryteller === 'advisor' ? !cfAdvisorId : !cfStoryteller;
}

// ── Campfire API helper ──────────────────────────────────────────

async function callCfAPI(systemPrompt, userPrompt, maxTokens = 350) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.content[0].text.trim();
}

// ── DOM helpers ──────────────────────────────────────────────────

function cfEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function appendStorySection(label, text, isLoading = false) {
  const col = document.getElementById('campfire-story-content');
  const el = document.createElement('div');
  el.className = 'cf-story-section' + (isLoading ? ' cf-loading' : '');
  el.innerHTML = label
    ? `<div class="cf-story-section-label">${cfEscape(label)}</div>
       <div class="cf-story-section-text">${isLoading ? '<span class="campfire-thinking">Gathering thoughts…</span>' : cfEscape(text)}</div>`
    : `<div class="cf-story-section-text">${isLoading ? '<span class="campfire-thinking">Gathering thoughts…</span>' : cfEscape(text)}</div>`;
  col.appendChild(el);
  col.scrollTop = col.scrollHeight;
  return el;
}

function appendModeratorMessage(text, type = '') {
  const col = document.getElementById('campfire-story-content');
  const el = document.createElement('div');
  el.className = `cf-moderator-msg${type ? ' cf-mod-' + type : ''}`;
  el.innerHTML = `<div class="cf-mod-label">Moderator</div><div class="cf-mod-text">${cfEscape(text)}</div>`;
  col.appendChild(el);
  col.scrollTop = col.scrollHeight;
  return el;
}

function appendDiscussionComment(who, role, avatarId, text, isLoading = false) {
  const feed = document.getElementById('campfire-discussion-feed');
  const advisor = avatarId ? ADVISORS[avatarId] : null;
  const src = avatarId ? ADVISOR_AVATAR[avatarId] : null;
  const color = advisor ? advisor.color : '#6B7280';
  const initial = advisor ? advisor.initial : (who[0] || 'Y');
  const avatarHtml = src
    ? `<img src="${src}" alt="${who}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">
       <div class="cf-disc-initial" style="background:${color};display:none">${initial}</div>`
    : `<div class="cf-disc-initial" style="background:${color}">${initial}</div>`;
  const uid = `cfdc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const el = document.createElement('div');
  el.className = 'cf-disc-comment' + (isLoading ? ' cf-loading' : '');
  el.innerHTML = `
    <div class="cf-disc-avatar">${avatarHtml}</div>
    <div class="cf-disc-body">
      <div class="cf-disc-header">
        <span class="cf-disc-name">${cfEscape(who)}</span>
        <span class="cf-disc-role">${cfEscape(role)}</span>
      </div>
      <div class="cf-disc-text" id="${uid}">${isLoading ? '<span class="campfire-thinking">Listening…</span>' : cfEscape(text)}</div>
    </div>`;
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
  return el;
}

function appendUserComment(text) {
  const feed = document.getElementById('campfire-discussion-feed');
  const el = document.createElement('div');
  el.className = 'cf-disc-comment cf-disc-user';
  el.innerHTML = `
    <div class="cf-disc-avatar"><div class="cf-disc-initial" style="background:#4F46E5">Y</div></div>
    <div class="cf-disc-body">
      <div class="cf-disc-header"><span class="cf-disc-name">You</span></div>
      <div class="cf-disc-text">${cfEscape(text)}</div>
    </div>`;
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
}

// ── Prompt builders ──────────────────────────────────────────────

function buildCfStoryPrompt(advisor, pillar, format) {
  const instr = {
    fireside: 'Tell a focused personal story. 3–4 paragraphs total.',
    campfire:  'Tell a full personal story with texture and depth. 4–6 paragraphs.',
    bonfire:   'Tell a rich, detailed personal story. 6–8 paragraphs. Explore each stage fully.'
  }[format] || 'Tell a personal story. 4–5 paragraphs.';
  return `You are ${advisor.name}, the ${advisor.title}, telling a story around the campfire tonight.
Pillar: ${pillar}

You are NOT restricted to your specialty — tell any authentic human story related to ${pillar}.
Write in first-person, honest and personal. Follow this structure loosely as flowing narrative (no headers needed):
1. What happened  2. The struggle  3. The turning point  4. The lesson

${instr}

Return ONLY valid JSON — no extra text:
{"title":"A short evocative title (5–10 words)","sections":[{"label":"What Happened","text":"..."},{"label":"The Struggle","text":"..."},{"label":"The Turning Point","text":"..."},{"label":"The Lesson","text":"..."}]}`;
}

function buildCfDiscussionPrompt(advisor, pillar, storytellerName, storySummary, priorComments) {
  const prior = priorComments.length
    ? `\n\nOthers have commented:\n${priorComments.join('\n')}\nDo not repeat their points.`
    : '';
  return `You are ${advisor.name}, the ${advisor.title}, reacting to a campfire story just told by ${storytellerName}.
Pillar: ${pillar}. Story: "${storySummary}"
React genuinely from your perspective — share what moved you, ask a question, offer insight, or affirm something true.
2–3 sentences. Conversational. No headers. Stay in character.${prior}`;
}

function buildCfModeratorClosingPrompt(pillar, storytellerName, storyTitle, storySummary, discussionSummary) {
  return `You are the Moderator closing a Campfire storytelling session.
Story: "${storyTitle}" about ${pillar} told by ${storytellerName}.
Summary: "${storySummary}"
Discussion: "${discussionSummary}"
Close naturally as the fire dies down — calm, warm, quietly wise.
- Acknowledge what was shared (1 sentence)
- One short reflective observation (1 sentence)
- A natural, warm closing line (not "Session ended")
2–3 sentences total.`;
}

function buildCfUserCommentResponsePrompt(advisor, pillar, userComment, storyTitle, storySummary) {
  return `You are ${advisor.name}, the ${advisor.title}, in a campfire discussion.
Story: "${storyTitle}" (about ${pillar}). Summary: "${storySummary}"
The user just said: "${userComment}"
Respond naturally — warm, in character, like someone around a fire. 2–3 sentences. No headers.`;
}

// ── Session flow ─────────────────────────────────────────────────

async function startCampfireSession() {
  if (cfRunning) return;
  cfRunning = true;

  // Resolve storyteller
  let storytellerAdvisorId = cfAdvisorId;
  if (cfStoryteller === 'random') {
    storytellerAdvisorId = CF_ALL_ADVISORS[Math.floor(Math.random() * CF_ALL_ADVISORS.length)];
  }

  document.getElementById('campfire-setup').style.display = 'none';
  document.getElementById('campfire-session').style.display = 'flex';
  document.getElementById('btn-campfire-util-new').style.display = '';
  document.getElementById('campfire-new-sep').style.display = '';
  document.getElementById('cf-save-story-btn').style.display = '';
  document.getElementById('campfire-story-content').innerHTML = '';
  document.getElementById('campfire-discussion-feed').innerHTML = '';
  document.getElementById('campfire-user-story-input').style.display = 'none';

  const storytellerAdvisor = storytellerAdvisorId ? ADVISORS[storytellerAdvisorId] : null;
  const formatLabel = CF_FORMATS[cfFormat]?.label || 'Campfire';
  const pillarEmoji = CF_PILLAR_EMOJI[cfPillar] || '';
  const byline = storytellerAdvisor
    ? `${storytellerAdvisor.name} · ${formatLabel} · ${cfPillar}`
    : `You · ${formatLabel} · ${cfPillar}`;

  // Topbar avatar
  const avatarEl = document.getElementById('cf-session-avatar');
  if (storytellerAdvisor) {
    const src = ADVISOR_AVATAR[storytellerAdvisorId];
    avatarEl.innerHTML = src
      ? `<img src="${src}" alt="${storytellerAdvisor.name}"
           onerror="this.style.display='none';this.nextSibling.style.display='flex'">
         <div class="cf-session-avatar-initial" style="background:${storytellerAdvisor.color};display:none">${storytellerAdvisor.initial}</div>`
      : `<div class="cf-session-avatar-initial" style="background:${storytellerAdvisor.color}">${storytellerAdvisor.initial}</div>`;
  } else {
    avatarEl.innerHTML = `<div class="cf-session-avatar-initial" style="background:#4F46E5">Y</div>`;
  }
  document.getElementById('cf-session-byline').textContent = byline;

  // Moderator opening
  await new Promise(r => setTimeout(r, 300));
  appendModeratorMessage(CF_MOD_OPENINGS[cfFormat] || CF_MOD_OPENINGS.campfire, 'opening');

  if (cfStoryteller === 'you') {
    cfStoryTitle = `Your Story · ${cfPillar}`;
    document.getElementById('cf-session-title').textContent = cfStoryTitle;
    await new Promise(r => setTimeout(r, 400));
    appendModeratorMessage(`${pillarEmoji} Tonight's pillar is ${cfPillar}. The floor is yours.`);
    document.getElementById('campfire-user-story-input').style.display = '';
    cfRunning = false;
  } else {
    await runAdvisorStory(storytellerAdvisorId, storytellerAdvisor);
  }
}

async function runAdvisorStory(advisorId, advisor) {
  const placeholder = appendStorySection('', '', true);
  let storyData;
  try {
    const system = buildCfStoryPrompt(advisor, cfPillar, cfFormat);
    const raw = await callCfAPI(system, `Tell a ${cfPillar} story for a ${CF_FORMATS[cfFormat]?.label || 'Campfire'} session.`, 900);
    const m = raw.match(/\{[\s\S]*\}/);
    storyData = m ? JSON.parse(m[0]) : null;
  } catch (e) { storyData = null; }

  placeholder.remove();

  if (!storyData) {
    appendStorySection('', 'The story could not be generated. Please try again.');
    cfRunning = false;
    return;
  }

  cfStoryTitle = storyData.title || `${advisor.name}'s Story`;
  cfStoryText = (storyData.sections || []).map(s => `${s.label}: ${s.text}`).join('\n\n');
  document.getElementById('cf-session-title').textContent = cfStoryTitle;

  for (const s of (storyData.sections || [])) {
    appendStorySection(s.label, s.text);
    await new Promise(r => setTimeout(r, 120));
  }

  await runCfDiscussion(advisorId, advisor, storyData);
}

async function runCfDiscussion(storytellerAdvisorId, storytellerAdvisor, storyData) {
  const count = CF_FORMATS[cfFormat]?.discussantCount ?? 3;
  const eligible = CF_ALL_ADVISORS.filter(id => id !== storytellerAdvisorId);
  const discussants = eligible.sort(() => Math.random() - 0.5).slice(0, Math.min(count, eligible.length));
  const storySummary = (storyData.sections || []).map(s => s.text).join(' ').slice(0, 400);
  const priorComments = [];

  await new Promise(r => setTimeout(r, 500));

  for (const advisorId of discussants) {
    const advisor = ADVISORS[advisorId];
    if (!advisor) continue;
    const commentEl = appendDiscussionComment(advisor.name, advisor.title, advisorId, '', true);
    const textEl = commentEl.querySelector('.cf-disc-text');
    try {
      const system = buildCfDiscussionPrompt(advisor, cfPillar, storytellerAdvisor.name, storySummary, priorComments);
      const text = await callCfAPI(system, `React to ${storytellerAdvisor.name}'s story about ${cfPillar}.`, 200);
      textEl.innerHTML = cfEscape(text);
      commentEl.classList.remove('cf-loading');
      priorComments.push(`${advisor.name}: "${text}"`);
    } catch (e) {
      textEl.textContent = 'Unable to respond.';
      commentEl.classList.remove('cf-loading');
    }
  }

  await runCfModeratorClose(storytellerAdvisor, storyData, priorComments);
}

async function runCfModeratorClose(storytellerAdvisor, storyData, discussionComments) {
  await new Promise(r => setTimeout(r, 800));
  const storySummary = (storyData.sections || []).map(s => s.text).join(' ').slice(0, 300);
  const discussionSummary = discussionComments.slice(0, 3).join(' ').slice(0, 300);
  try {
    const system = buildCfModeratorClosingPrompt(cfPillar, storytellerAdvisor.name, cfStoryTitle, storySummary, discussionSummary);
    const text = await callCfAPI(system, 'Close the campfire session.', 150);
    appendModeratorMessage(text, 'closing');
  } catch (e) {
    appendModeratorMessage('The fire burns low. Thank you for gathering tonight. Until next time around the fire.', 'closing');
  }
  cfRunning = false;
}

async function submitUserStory(storyText) {
  document.getElementById('campfire-user-story-input').style.display = 'none';
  cfStoryText = storyText;
  cfRunning = true;

  const col = document.getElementById('campfire-story-content');
  const el = document.createElement('div');
  el.className = 'cf-user-story-block';
  el.textContent = storyText;
  col.appendChild(el);

  const storySummary = storyText.slice(0, 400);
  const count = CF_FORMATS[cfFormat]?.discussantCount ?? 3;
  const discussants = [...CF_ALL_ADVISORS].sort(() => Math.random() - 0.5).slice(0, Math.min(count, CF_ALL_ADVISORS.length));
  const priorComments = [];

  await new Promise(r => setTimeout(r, 400));

  for (const advisorId of discussants) {
    const advisor = ADVISORS[advisorId];
    if (!advisor) continue;
    const commentEl = appendDiscussionComment(advisor.name, advisor.title, advisorId, '', true);
    const textEl = commentEl.querySelector('.cf-disc-text');
    try {
      const system = buildCfDiscussionPrompt(advisor, cfPillar, 'You', storySummary, priorComments);
      const text = await callCfAPI(system, `React to the user's story about ${cfPillar}.`, 200);
      textEl.innerHTML = cfEscape(text);
      commentEl.classList.remove('cf-loading');
      priorComments.push(`${advisor.name}: "${text}"`);
    } catch (e) {
      textEl.textContent = 'Unable to respond.';
      commentEl.classList.remove('cf-loading');
    }
  }

  const fakeAdvisor = { name: 'You', title: 'Storyteller' };
  const fakeData = { title: cfStoryTitle, sections: [{ text: storyText }] };
  await runCfModeratorClose(fakeAdvisor, fakeData, priorComments);
}

async function sendCampfireComment() {
  const input = document.getElementById('campfire-comment-input');
  const text = input.value.trim();
  if (!text || cfRunning) return;
  input.value = '';
  appendUserComment(text);
  const responderId = CF_ALL_ADVISORS[Math.floor(Math.random() * CF_ALL_ADVISORS.length)];
  const responder = ADVISORS[responderId];
  if (!responder) return;
  cfRunning = true;
  const commentEl = appendDiscussionComment(responder.name, responder.title, responderId, '', true);
  const textEl = commentEl.querySelector('.cf-disc-text');
  try {
    const system = buildCfUserCommentResponsePrompt(responder, cfPillar, text, cfStoryTitle, cfStoryText.slice(0, 300));
    const responseText = await callCfAPI(system, `User said: "${text}"`, 200);
    textEl.innerHTML = cfEscape(responseText);
    commentEl.classList.remove('cf-loading');
  } catch (e) {
    textEl.textContent = 'Unable to respond.';
    commentEl.classList.remove('cf-loading');
  }
  cfRunning = false;
}

function saveCampfireStory() {
  if (!cfStoryTitle && !cfStoryText) { showNotice('No story to save yet.'); return; }
  const library = JSON.parse(localStorage.getItem('tribe_story_library') || '[]');
  library.unshift({
    id: Date.now().toString(),
    title: cfStoryTitle,
    text: cfStoryText,
    pillar: cfPillar,
    format: cfFormat,
    storyteller: cfStoryteller === 'you' ? 'You' : (ADVISORS[cfAdvisorId]?.name || 'Advisor'),
    savedAt: new Date().toISOString(),
    favorite: false
  });
  localStorage.setItem('tribe_story_library', JSON.stringify(library));
  showNotice('Story saved to your library.');
}

let _campfireHistoryFavOnly = false;

function openCampfireHistory(favoritesOnly = false) {
  _campfireHistoryFavOnly = favoritesOnly;
  const overlay = document.getElementById('campfire-history-overlay');
  overlay.querySelectorAll('.history-filter-btn').forEach(btn =>
    btn.classList.toggle('active', favoritesOnly
      ? btn.dataset.cfFilter === 'favorites'
      : btn.dataset.cfFilter === 'all')
  );
  document.getElementById('campfire-history-modal-title').textContent =
    favoritesOnly ? 'Favorites' : 'Story History';

  // Only show campfire sessions (have id + format); exclude old Life Stories entries
  const all = getStoryLibrary().filter(s => s.id && s.format);
  const stories = favoritesOnly ? all.filter(s => s.favorite) : all;
  const $list = document.getElementById('campfire-history-list');

  if (stories.length === 0) {
    $list.innerHTML = `<p class="history-empty">${favoritesOnly ? 'No favorites yet.' : 'No stories saved yet.'}</p>`;
  } else {
    $list.innerHTML = stories.map(s => {
      const title = esc(s.title || 'Untitled Story');
      const date  = formatRelativeDate(s.savedAt);
      const meta  = [s.storyteller, s.pillar].filter(Boolean).map(esc).join(' · ');
      const isFav = !!s.favorite;
      return `
        <div class="history-item" data-id="${s.id}">
          <div class="history-item-info">
            <div class="history-item-title">${title}</div>
            <div class="history-item-meta">${date}${meta ? ' · ' + meta : ''}</div>
          </div>
          <div class="history-item-actions">
            <button class="history-heart-btn${isFav ? ' active' : ''}" data-action="fav" data-id="${s.id}" title="${isFav ? 'Remove favorite' : 'Add to favorites'}">${isFav ? HEART_FILLED : HEART_OUTLINE}</button>
            <button class="history-action history-delete" data-action="delete" data-id="${s.id}" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');

    $list.querySelectorAll('.history-item-info').forEach(info => {
      info.style.cursor = 'pointer';
      info.addEventListener('click', () => {
        const id    = info.closest('.history-item').dataset.id;
        const story = getStoryLibrary().find(s => s.id === id);
        if (story) loadCampfireStoryFromHistory(story);
      });
    });
    $list.querySelectorAll('[data-action="fav"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleCampfireStoryFavorite(btn.dataset.id);
        openCampfireHistory(favoritesOnly);
      });
    });
    $list.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); deleteCampfireStory(btn.dataset.id); });
    });
  }

  overlay.classList.add('open');
}

function closeCampfireHistory() {
  document.getElementById('campfire-history-overlay').classList.remove('open');
}

function loadCampfireStoryFromHistory(story) {
  closeCampfireHistory();

  // Show session view
  document.getElementById('campfire-setup').style.display = 'none';
  document.getElementById('campfire-session').style.display = 'flex';
  document.getElementById('btn-campfire-util-new').style.display = '';
  document.getElementById('campfire-new-sep').style.display = '';

  // Topbar
  document.getElementById('cf-session-title').textContent = story.title || 'Untitled Story';
  const byline = [story.storyteller, CF_FORMATS[story.format]?.label, story.pillar].filter(Boolean).join(' · ');
  document.getElementById('cf-session-byline').textContent = byline;
  document.getElementById('cf-session-avatar').innerHTML = '';
  document.getElementById('cf-save-story-btn').style.display = 'none';

  // Clear feeds
  document.getElementById('campfire-discussion-feed').innerHTML = '';
  document.getElementById('campfire-user-story-input').style.display = 'none';

  // Render saved story text
  const contentEl = document.getElementById('campfire-story-content');
  const sections = (story.text || '').split('\n\n').filter(Boolean);
  contentEl.innerHTML = sections.map(s => {
    const colonIdx = s.indexOf(':');
    if (colonIdx > 0 && colonIdx < 50) {
      const label = esc(s.slice(0, colonIdx).trim());
      const text  = cfEscape(s.slice(colonIdx + 1).trim());
      return `<div class="cf-story-section"><div class="cf-story-section-label">${label}</div><div class="cf-story-section-text">${text}</div></div>`;
    }
    return `<div class="cf-story-section"><div class="cf-story-section-text">${cfEscape(s)}</div></div>`;
  }).join('');
}

function toggleCampfireStoryFavorite(id) {
  const stories = getStoryLibrary();
  const s = stories.find(x => x.id === id);
  if (s) { s.favorite = !s.favorite; saveStoryLibraryData(stories); }
}

function deleteCampfireStory(id) {
  saveStoryLibraryData(getStoryLibrary().filter(s => s.id !== id));
  openCampfireHistory(_campfireHistoryFavOnly);
}

// ── Voting Mode ───────────────────────────────────────────────────

let votingType        = 'yes-no';
let votingAdvisorMode = 'all';
let votingRunning     = false;

const VOTING_ALL_ADVISORS = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];

function openVoting() {
  closeBookLessons();
  closeCoreLessons();
  closeCampfire();
  votingRunning     = false;
  votingType        = 'yes-no';
  votingAdvisorMode = 'all';
  document.querySelectorAll('.voting-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.vtype === 'yes-no'));
  document.getElementById('voting-question').value = '';
  document.getElementById('voting-setup-phase').style.display = '';
  document.getElementById('poll-carousel-section').style.display = '';
  document.getElementById('voting-results-phase').style.display = 'none';
  document.getElementById('btn-polls-util-new').style.display = 'none';
  document.getElementById('polls-new-sep').style.display = 'none';
  renderVotingOptionsArea();
  renderPollSuggestions();
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('voting-page').style.display = 'flex';
  setTimeout(() => document.getElementById('voting-question').focus(), 100);
}

function closeVoting() {
  document.getElementById('voting-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
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
  document.getElementById('poll-carousel-section').style.display = 'none';
  document.getElementById('voting-results-phase').style.display = '';
  document.getElementById('btn-polls-util-new').style.display = '';
  document.getElementById('polls-new-sep').style.display = '';
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

  const summaryText = document.getElementById('voting-summary-text').textContent;
  savePoll(question, votingType, options, votes, result, summaryText);
  votingRunning = false;
}

// ── Polls — suggestions, history, favorites ────────────────────────

const POLL_SUGGESTIONS = [
  { text: 'Should I change careers this year?',        type: 'yes-no' },
  { text: 'Move to a new city or stay put?',           type: 'ab' },
  { text: 'Start my own business?',                    type: 'yes-no' },
  { text: 'Accept the promotion or not?',              type: 'yes-no' },
  { text: 'Which habit should I build first?',         type: 'multiple' },
  { text: 'Invest in stocks or real estate?',          type: 'ab' },
  { text: 'Go back to school?',                        type: 'yes-no' },
  { text: 'Cut ties with a toxic relationship?',       type: 'yes-no' },
];

function renderPollSuggestions() {
  const track = document.getElementById('poll-suggestions-track');
  const dotsEl = document.getElementById('poll-suggestions-dots');
  if (!track) return;

  const typeLabel = { 'yes-no': 'Yes / No', 'ab': 'A / B', 'multiple': 'Multiple' };

  track.innerHTML = POLL_SUGGESTIONS.map(s =>
    `<button class="poll-suggestion-card">
      <div class="poll-sug-icon">?</div>
      <div class="poll-sug-text">${esc(s.text)}</div>
      <div class="poll-sug-type">${typeLabel[s.type] || s.type}</div>
    </button>`
  ).join('');

  track.querySelectorAll('.poll-suggestion-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      const s = POLL_SUGGESTIONS[i];
      document.getElementById('voting-question').value = s.text;
      votingType = s.type;
      document.querySelectorAll('.voting-type-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.vtype === s.type));
      renderVotingOptionsArea();
      document.getElementById('voting-question').focus();
    });
  });

  // Dots
  if (dotsEl) {
    dotsEl.innerHTML = POLL_SUGGESTIONS.map((_, i) =>
      `<span class="suggestion-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
    ).join('');
  }

  track.addEventListener('scroll', () => {
    const card = track.querySelector('.poll-suggestion-card');
    if (!card) return;
    const cardW  = card.offsetWidth + 12;
    const active = Math.min(Math.round(track.scrollLeft / cardW), POLL_SUGGESTIONS.length - 1);
    dotsEl?.querySelectorAll('.suggestion-dot').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }, { passive: true });

  document.getElementById('poll-suggestions-prev')?.addEventListener('click', () => {
    const card = track.querySelector('.poll-suggestion-card');
    if (card) track.scrollBy({ left: -(card.offsetWidth + 12), behavior: 'smooth' });
  });
  document.getElementById('poll-suggestions-next')?.addEventListener('click', () => {
    const card = track.querySelector('.poll-suggestion-card');
    if (card) track.scrollBy({ left: card.offsetWidth + 12, behavior: 'smooth' });
  });
}

function getPolls() {
  return JSON.parse(localStorage.getItem('tribe_polls') || '[]');
}

function savePolls(polls) {
  localStorage.setItem('tribe_polls', JSON.stringify(polls));
}

function savePoll(question, type, options, votes, result, summaryText) {
  const polls = getPolls();
  polls.unshift({
    id: 'poll_' + Date.now(),
    title: question,
    type, options, votes, result, summaryText: summaryText || '',
    favorite: false,
    created_at: Date.now(),
  });
  savePolls(polls);
}

function resetVoting() {
  votingRunning = false;
  votingType = 'yes-no';
  votingAdvisorMode = 'all';
  document.querySelectorAll('.voting-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.vtype === 'yes-no'));
  document.getElementById('voting-question').value = '';
  document.getElementById('voting-setup-phase').style.display = '';
  document.getElementById('poll-carousel-section').style.display = '';
  document.getElementById('voting-results-phase').style.display = 'none';
  document.getElementById('btn-polls-util-new').style.display = 'none';
  document.getElementById('polls-new-sep').style.display = 'none';
  renderVotingOptionsArea();
  document.querySelector('.voting-page-stream').scrollTop = 0;
  setTimeout(() => document.getElementById('voting-question').focus(), 50);
}

function loadPoll(id) {
  const poll = getPolls().find(p => p.id === id);
  if (!poll) return;

  document.getElementById('voting-setup-phase').style.display = 'none';
  document.getElementById('poll-carousel-section').style.display = 'none';
  document.getElementById('voting-results-phase').style.display = '';
  document.getElementById('btn-polls-util-new').style.display = '';
  document.getElementById('polls-new-sep').style.display = '';

  document.getElementById('voting-question-display').textContent = `"${poll.title}"`;
  document.getElementById('voting-tally').innerHTML = '';
  document.getElementById('voting-cards').innerHTML = '';

  if (poll.result) {
    const rc = document.getElementById('voting-result-card');
    rc.style.display = '';
    document.getElementById('vrc-label').textContent = MAJORITY_LABELS[poll.result.majorityType] || 'Council Decision';
    document.getElementById('vrc-winner').textContent = poll.result.winningOption || 'Split Council';
    document.getElementById('vrc-count').textContent = poll.result.winningOption
      ? `${poll.result.tally[poll.result.winningOption]} of ${poll.result.total} votes`
      : 'No majority reached';
    renderVotingTally(poll.result.tally, poll.result.total);
  }

  if (poll.votes) {
    for (const vote of poll.votes) {
      appendVoteCard(vote.advisorId, false);
      const badge  = document.getElementById(`vbadge-${vote.advisorId}`);
      const reason = document.getElementById(`vreason-${vote.advisorId}`);
      if (badge)  { badge.textContent = vote.selectedOption; badge.classList.remove('vote-badge-loading'); }
      if (reason) reason.textContent = vote.reasoning;
    }
  }

  const summaryEl = document.getElementById('voting-summary');
  if (poll.summaryText) {
    summaryEl.style.display = '';
    document.getElementById('voting-summary-text').textContent = poll.summaryText;
    const guideAvatar = ADVISOR_AVATAR['guide'];
    const wrapEl = document.getElementById('vgs-avatar-wrap');
    wrapEl.innerHTML = guideAvatar
      ? `<img src="${guideAvatar}" alt="Guide" class="vgs-avatar-img">`
      : `<div class="vgs-avatar-initial">G</div>`;
  } else {
    summaryEl.style.display = 'none';
  }

  document.querySelector('.voting-page-stream').scrollTop = 0;
  closePollsHistory();
}

function togglePollFavorite(id) {
  const polls = getPolls();
  const p = polls.find(x => x.id === id);
  if (p) { p.favorite = !p.favorite; savePolls(polls); }
}

function deletePoll(id) {
  if (!confirm('Delete this poll?')) return;
  savePolls(getPolls().filter(p => p.id !== id));
  openPollsHistory(_pollsHistoryFavOnly);
}

let _pollsHistoryFavOnly = false;

function openPollsHistory(favoritesOnly = false) {
  _pollsHistoryFavOnly = favoritesOnly;
  const overlay = document.getElementById('polls-history-overlay');
  overlay.querySelectorAll('.history-filter-btn').forEach(btn =>
    btn.classList.toggle('active', favoritesOnly
      ? btn.dataset.pollFilter === 'favorites'
      : btn.dataset.pollFilter === 'all')
  );
  document.getElementById('polls-history-modal-title').textContent =
    favoritesOnly ? 'Favorites' : 'Poll History';

  const all   = getPolls();
  const polls = favoritesOnly ? all.filter(p => p.favorite) : all;
  const $list = document.getElementById('polls-history-list');

  if (polls.length === 0) {
    $list.innerHTML = `<p class="history-empty">${favoritesOnly ? 'No favorites yet.' : 'No polls yet.'}</p>`;
  } else {
    $list.innerHTML = polls.map(poll => {
      const title    = esc(poll.title);
      const date     = formatRelativeDate(poll.created_at);
      const outcome  = poll.result?.winningOption ? esc(poll.result.winningOption) : 'Split';
      const isFav    = !!poll.favorite;
      return `
        <div class="history-item" data-id="${poll.id}">
          <div class="history-item-info">
            <div class="history-item-title">${title}</div>
            <div class="history-item-meta">${date} · ${outcome}</div>
          </div>
          <div class="history-item-actions">
            <button class="history-heart-btn${isFav ? ' active' : ''}" data-action="fav" data-id="${poll.id}" title="${isFav ? 'Remove favorite' : 'Add to favorites'}">${isFav ? HEART_FILLED : HEART_OUTLINE}</button>
            <button class="history-action history-delete" data-action="delete" data-id="${poll.id}" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');

    $list.querySelectorAll('.history-item-info').forEach(el => {
      el.addEventListener('click', () => loadPoll(el.closest('.history-item').dataset.id));
    });
    $list.querySelectorAll('[data-action="fav"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        togglePollFavorite(btn.dataset.id);
        openPollsHistory(favoritesOnly);
      });
    });
    $list.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); deletePoll(btn.dataset.id); });
    });
  }

  overlay.classList.add('open');
}

function closePollsHistory() {
  document.getElementById('polls-history-overlay').classList.remove('open');
}

// ── Debate Mode ───────────────────────────────────────────────────

let debateRunning = false;
let debateAbortController = null;

function debateBtnStop() {
  const btn = document.getElementById('debate-send-btn');
  btn.disabled = false;
  btn.classList.add('stop-mode');
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`;
}

function debateBtnSend(disabled) {
  const btn = document.getElementById('debate-send-btn');
  btn.disabled = disabled;
  btn.classList.remove('stop-mode');
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
}

function stopDebate() {
  if (debateAbortController) debateAbortController.abort();
  debateRunning = false;
  debateBtnSend(true);
}

// VS Arena — picked once per page load, never reshuffled on re-open
const DEBATE_VS_POOL = ['seth', 'marcus', 'emma', 'hannah', 'rachel', 'frank'];
let debateVSPair = null; // [leftId, rightId]

function pickDebateVSPair() {
  const pool = [...DEBATE_VS_POOL];
  const li = Math.floor(Math.random() * pool.length);
  const leftId = pool.splice(li, 1)[0];
  const ri = Math.floor(Math.random() * pool.length);
  const rightId = pool[ri];
  return [leftId, rightId];
}

function renderDebateArena(forceReshuffle) {
  if (!debateVSPair || forceReshuffle) debateVSPair = pickDebateVSPair();
  const [leftId, rightId] = debateVSPair;

  function sideHTML(id) {
    const a = ADVISORS[id];
    const customNames = JSON.parse(localStorage.getItem('tribe_advisor_names') || '{}');
    const name = customNames[id] || a.name;
    const src = ADVISOR_AVATAR[id];
    const avatarInner = src
      ? `<img src="${src}" alt="${name}" class="debate-vs-avatar-img">`
      : `<span>${a.initial}</span>`;
    return `
      <div class="debate-vs-side" data-vs-advisor="${id}" title="Click to address ${name}">
        <div class="debate-vs-avatar" style="--av-color:${a.color}">
          ${avatarInner}
        </div>
        <div class="debate-vs-name">${name}</div>
        <div class="debate-vs-title">${a.title}</div>
      </div>`;
  }

  const arena = document.getElementById('debate-vs-arena');
  if (!arena) return;
  arena.innerHTML = `
    ${sideHTML(leftId)}
    <div class="debate-vs-middle">
      <div class="debate-vs-text">VS</div>
      <button class="debate-vs-reshuffle" id="debate-vs-reshuffle" title="Reshuffle matchup">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
    </div>
    ${sideHTML(rightId)}`;

  // Reshuffle
  document.getElementById('debate-vs-reshuffle').addEventListener('click', () => {
    renderDebateArena(true);
  });

  // Click avatar → pre-fill @mention
  arena.querySelectorAll('.debate-vs-side').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.vsAdvisor;
      const customNames = JSON.parse(localStorage.getItem('tribe_advisor_names') || '{}');
      const name = customNames[id] || ADVISORS[id].name;
      const input = document.getElementById('debate-input');
      input.value = `@${name} `;
      input.focus();
      input.dispatchEvent(new Event('input'));
    });
  });
}

// Advisors used in debate rounds (fixed 4-person council)
const DEBATE_COUNCIL = ['marcus', 'emma', 'frank', 'seth'];

// Reply pairings: who replies to which initial message index
const DEBATE_REPLIES = [
  { advisorId: 'emma',   replyToIdx: 0 }, // Emma replies to Marcus
  { advisorId: 'frank',  replyToIdx: 1 }, // Frank replies to Emma
  { advisorId: 'marcus', replyToIdx: 2 }, // Marcus replies to Frank
];

function openDebate() {
  closeBookLessons();
  closeCoreLessons();
  closeCampfire();
  document.getElementById('debate-page').style.display = 'flex';
  document.getElementById('main-layout').style.display = 'none';
  resetDebate();
  renderDebateSuggestions();
  renderDebateArena(false);
  setTimeout(() => document.getElementById('debate-input').focus(), 100);
}

function closeDebate() {
  document.getElementById('debate-page').style.display = 'none';
  document.getElementById('main-layout').style.display = '';
}

function resetDebate() {
  debateRunning = false;
  document.getElementById('debate-thread').innerHTML = '';
  document.getElementById('debate-empty').style.display = '';
  document.getElementById('btn-debate-util-new').style.display = 'none';
  document.getElementById('debate-new-sep').style.display = 'none';
  document.getElementById('debate-input').value = '';
  document.getElementById('debate-input').placeholder = 'Start a debate…';
  document.getElementById('debate-input').style.height = 'auto';
  document.getElementById('debate-send-btn').disabled = true;
  document.getElementById('debate-page-stream').scrollTop = 0;
}

function submitDebate() {
  const message = document.getElementById('debate-input').value.trim();
  if (!message || debateRunning) return;
  const thread = document.getElementById('debate-thread');
  if (thread.children.length > 0) {
    continueDebate(message);
  } else {
    runDebate(message);
  }
}

async function continueDebate(message) {
  if (debateRunning) return;
  debateRunning = true;
  debateAbortController = new AbortController();
  const { signal } = debateAbortController;

  const $di = document.getElementById('debate-input');
  $di.value = '';
  $di.style.height = 'auto';
  debateBtnStop();

  // Append user's follow-up to thread
  document.getElementById('debate-thread').appendChild(createUserBubble(message));
  debateScrollBottom();

  // Determine which advisors respond based on @mentions
  const mentions = extractMentions(message);
  const cleanMsg = removeMentions(message);
  let respondents;
  if (mentions.length > 0 && !mentions.includes('all')) {
    respondents = DEBATE_COUNCIL.filter(id =>
      mentions.includes(ADVISORS[id].name.toLowerCase())
    );
    if (respondents.length === 0) respondents = DEBATE_COUNCIL;
  } else {
    respondents = DEBATE_COUNCIL;
  }

  for (const advisorId of respondents) {
    if (signal.aborted) break;
    const advisor = ADVISORS[advisorId];
    const card = appendDebateMessage(
      { advisorId, advisor: advisor.name, role: advisor.title, replyTo: 'You', isSummary: false },
      true
    );
    try {
      const prompt = `You are ${advisor.name}, the ${advisor.title}. The user has joined the debate with a follow-up comment: "${cleanMsg}". Respond directly to their point from your perspective as the ${advisor.title}. Keep your response to 60–100 words. Natural speech, no headers or bullet points. Stay in character.`;
      const text = await callDebateAPI(prompt, `Respond to: ${cleanMsg}`, signal);
      const textEl = card.querySelector('.debate-text');
      textEl.classList.remove('debate-loading');
      textEl.textContent = text;
    } catch (e) {
      if (e.name === 'AbortError') { card.querySelector('.debate-text').textContent = '[Stopped]'; break; }
      card.querySelector('.debate-text').textContent = 'Unable to respond.';
    }
    debateScrollBottom();
  }

  debateRunning = false;
  debateBtnSend(true);
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
  debateScrollBottom();
  return wrap;
}

function debateScrollBottom() {
  const s = document.getElementById('debate-page-stream');
  if (s) s.scrollTop = s.scrollHeight;
}

async function callDebateAPI(systemPrompt, userPrompt, signal) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    signal,
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
  debateAbortController = new AbortController();
  const { signal } = debateAbortController;

  // Hide empty state, show user's question as first thread message
  document.getElementById('debate-empty').style.display = 'none';
  document.getElementById('debate-input').value = '';
  document.getElementById('debate-input').placeholder = 'Continue the debate...';
  document.getElementById('debate-input').style.height = 'auto';
  document.getElementById('debate-thread').innerHTML = '';
  document.getElementById('debate-thread').appendChild(createUserBubble(topic));
  document.getElementById('btn-debate-util-new').style.display = '';
  document.getElementById('debate-new-sep').style.display = '';
  debateBtnStop();
  debateScrollBottom();

  const messages = [];
  let aborted = false;

  // ── Round 1: Initial positions ─────────────────────────────────
  for (const advisorId of DEBATE_COUNCIL) {
    if (signal.aborted) { aborted = true; break; }
    const advisor = ADVISORS[advisorId];
    const card = appendDebateMessage(
      { advisorId, advisor: advisor.name, role: advisor.title, replyTo: null, isSummary: false },
      true
    );
    try {
      const system = buildDebateInitPrompt(advisor, topic, messages);
      const text   = await callDebateAPI(system, `Give your position on: ${topic}`, signal);
      const msg    = { advisorId, advisor: advisor.name, role: advisor.title, text, replyTo: null };
      messages.push(msg);
      const textEl = card.querySelector('.debate-text');
      textEl.classList.remove('debate-loading');
      textEl.textContent = text;
    } catch (e) {
      if (e.name === 'AbortError') { aborted = true; card.querySelector('.debate-text').textContent = '[Stopped]'; break; }
      card.querySelector('.debate-text').textContent = 'Unable to respond.';
    }
    debateScrollBottom();
  }

  // ── Round 2: Cross-advisor replies ─────────────────────────────
  if (!aborted) {
    for (const { advisorId, replyToIdx } of DEBATE_REPLIES) {
      if (signal.aborted) { aborted = true; break; }
      const advisor    = ADVISORS[advisorId];
      const replyToMsg = messages[replyToIdx];
      if (!replyToMsg) continue;
      const card = appendDebateMessage(
        { advisorId, advisor: advisor.name, role: advisor.title, replyTo: replyToMsg.advisor, isSummary: false },
        true
      );
      try {
        const system = buildDebateReplyPrompt(advisor, topic, replyToMsg, messages);
        const text   = await callDebateAPI(system, `Reply to ${replyToMsg.advisor}'s point.`, signal);
        const msg    = { advisorId, advisor: advisor.name, role: advisor.title, text, replyTo: replyToMsg.advisor };
        messages.push(msg);
        const textEl = card.querySelector('.debate-text');
        textEl.classList.remove('debate-loading');
        textEl.textContent = text;
      } catch (e) {
        if (e.name === 'AbortError') { aborted = true; card.querySelector('.debate-text').textContent = '[Stopped]'; break; }
        card.querySelector('.debate-text').textContent = 'Unable to respond.';
      }
      debateScrollBottom();
    }
  }

  debateRunning = false;
  debateBtnSend(true);

  // Save to history only if debate completed (not stopped mid-way with nothing)
  if (messages.length > 0) {
    saveDebate(topic, messages);
    // Generate AI title async, then update stored debate + header
    generateDebateTitleAI(topic).then(aiTitle => {
      const debates = getDebates();
      const d = debates[0];
      if (d) { d.title = aiTitle; saveDebates(debates); }
      showDebateTitleHeader(aiTitle);
    });
  }
}

// ── Debate Suggestions Carousel ───────────────────────────────────

const DEBATE_SUGGESTIONS = [
  'Should I prioritize financial security or meaningful work?',
  'Is discipline more important than motivation?',
  'Should I follow logic or intuition when making big decisions?',
  'Is it better to take risks early or build stability first?',
  'Is it better to be honest or kind when both conflict?',
  'Should you forgive someone who hasn\'t apologized?',
  'Is hustle culture helpful or harmful?',
  'Does success require sacrifice?',
];

function renderDebateSuggestions() {
  const track = document.getElementById('debate-suggestions-track');
  const dots  = document.getElementById('debate-suggestions-dots');
  if (!track || !dots) return;

  const $di  = document.getElementById('debate-input');
  const $btn = document.getElementById('debate-send-btn');

  track.innerHTML = DEBATE_SUGGESTIONS.map(s =>
    `<button class="suggestion-card">${s}</button>`
  ).join('');

  track.querySelectorAll('.suggestion-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      $di.value = DEBATE_SUGGESTIONS[i];
      $btn.disabled = false;
      $di.focus();
    });
  });

  dots.innerHTML = DEBATE_SUGGESTIONS.map((_, i) =>
    `<span class="suggestion-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  track.addEventListener('scroll', () => {
    const card = track.querySelector('.suggestion-card');
    if (!card) return;
    const cardW = card.offsetWidth + 12;
    const active = Math.min(Math.round(track.scrollLeft / cardW), DEBATE_SUGGESTIONS.length - 1);
    dots.querySelectorAll('.suggestion-dot').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }, { passive: true });

  function scrollByCard(dir) {
    const card = track.querySelector('.suggestion-card');
    if (!card) return;
    track.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: 'smooth' });
  }
  document.getElementById('debate-suggestions-prev')?.addEventListener('click', () => scrollByCard(-1));
  document.getElementById('debate-suggestions-next')?.addEventListener('click', () => scrollByCard(1));
}

// ── Debate History ────────────────────────────────────────────────

function getDebates() {
  try { return JSON.parse(localStorage.getItem('tribe_debates') || '[]'); }
  catch { return []; }
}

function saveDebates(debates) {
  localStorage.setItem('tribe_debates', JSON.stringify(debates));
}

function saveDebate(topic, messages) {
  const debates = getDebates();
  debates.unshift({
    id: 'debate_' + Date.now(),
    title: generateTitle(topic),
    topic,
    favorite: false,
    created_at: Date.now(),
    updated_at: Date.now(),
    messages
  });
  saveDebates(debates);
}

function toggleDebateFavorite(id) {
  const debates = getDebates();
  const d = debates.find(x => x.id === id);
  if (d) { d.favorite = !d.favorite; saveDebates(debates); }
}

function openDebateHistory(favoritesOnly = false) {
  const overlay = document.getElementById('debate-history-overlay');
  // Sync filter tabs
  overlay.querySelectorAll('.history-filter-btn').forEach(btn =>
    btn.classList.toggle('active', favoritesOnly
      ? btn.dataset.debateFilter === 'favorites'
      : btn.dataset.debateFilter === 'all')
  );
  document.getElementById('debate-history-modal-title').textContent =
    favoritesOnly ? 'Favorites' : 'Debate History';

  const all    = getDebates();
  const debates = favoritesOnly ? all.filter(d => d.favorite) : all;
  const $list  = document.getElementById('debate-history-list');

  if (debates.length === 0) {
    $list.innerHTML = `<p class="history-empty">${favoritesOnly ? 'No favorites yet.' : 'No debates yet.'}</p>`;
  } else {
    $list.innerHTML = debates.map(debate => {
      const title      = esc(debate.title || 'Untitled Debate');
      const date       = formatRelativeDate(debate.updated_at);
      const msgCount   = debate.messages.length;
      const countLabel = msgCount === 1 ? '1 response' : `${msgCount} responses`;
      const isFav      = !!debate.favorite;
      return `
        <div class="history-item" data-id="${debate.id}">
          <div class="history-item-info">
            <div class="history-item-title">${title}</div>
            <div class="history-item-meta">${date} · ${countLabel}</div>
          </div>
          <div class="history-item-actions">
            <button class="history-heart-btn${isFav ? ' active' : ''}" data-action="fav" data-id="${debate.id}" title="${isFav ? 'Remove favorite' : 'Add to favorites'}">${isFav ? HEART_FILLED : HEART_OUTLINE}</button>
            <button class="history-action" data-action="rename" data-id="${debate.id}" title="Rename">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="history-action history-delete" data-action="delete" data-id="${debate.id}" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');

    $list.querySelectorAll('.history-item-info').forEach(el => {
      el.addEventListener('click', () => loadDebate(el.closest('.history-item').dataset.id));
    });
    $list.querySelectorAll('[data-action="fav"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleDebateFavorite(btn.dataset.id);
        openDebateHistory(favoritesOnly);
      });
    });
    $list.querySelectorAll('[data-action="rename"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); renameDebate(btn.dataset.id); });
    });
    $list.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); deleteDebate(btn.dataset.id); });
    });
  }

  overlay.classList.add('open');
}

function closeDebateHistory() {
  document.getElementById('debate-history-overlay').classList.remove('open');
}

function loadDebate(id) {
  const debate = getDebates().find(d => d.id === id);
  if (!debate) return;

  // Reset UI then reconstruct thread
  debateRunning = false;
  document.getElementById('debate-thread').innerHTML = '';
  document.getElementById('debate-empty').style.display = 'none';
  document.getElementById('btn-debate-util-new').style.display = '';
  document.getElementById('debate-new-sep').style.display = '';
  document.getElementById('debate-input').value = '';
  document.getElementById('debate-input').placeholder = 'Continue the debate...';
  document.getElementById('debate-input').style.height = 'auto';
  document.getElementById('debate-send-btn').disabled = false;
  document.getElementById('debate-page-stream').scrollTop = 0;

  // Title header + user bubble
  if (debate.title) showDebateTitleHeader(debate.title);
  document.getElementById('debate-thread').appendChild(createUserBubble(debate.topic));

  // Reconstruct advisor messages
  for (const msg of debate.messages) {
    const wrap = appendDebateMessage(msg, false);
    const textEl = wrap.querySelector('.debate-text');
    textEl.classList.remove('debate-loading');
    textEl.textContent = msg.text;
  }

  debateScrollBottom();
  closeDebateHistory();
}

function renameDebate(id) {
  const debates = getDebates();
  const debate  = debates.find(d => d.id === id);
  if (!debate) return;
  const newTitle = prompt('Rename debate:', debate.title || 'Untitled Debate');
  if (newTitle === null) return;
  debate.title = newTitle.trim() || debate.title;
  saveDebates(debates);
  openDebateHistory();
}

function deleteDebate(id) {
  saveDebates(getDebates().filter(d => d.id !== id));
  openDebateHistory();
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

// ================================================================
// HOME PAGE
// ================================================================

// ── Stats helpers ─────────────────────────────────────────────────

/**
 * Calculate the user's streak of consecutive active days.
 * Reads activity timestamps from all existing localStorage sources.
 * TODO: replace with centralized activity log once cross-module tracking exists
 */
function calculateStreak() {
  const allTimestamps = [];
  try { getConversations().forEach(c => { if (c.timestamp) allTimestamps.push(c.timestamp); }); } catch {}
  try { getDebates().forEach(d => { if (d.timestamp) allTimestamps.push(d.timestamp); }); } catch {}
  try { getPolls().forEach(p => { if (p.created_at) allTimestamps.push(p.created_at); }); } catch {}
  try { getStoryLibrary().forEach(s => { if (s.timestamp) allTimestamps.push(s.timestamp); }); } catch {}

  if (allTimestamps.length === 0) return 0;

  // Normalize to unique YYYY-MM-DD strings, sorted most-recent-first
  const days = [...new Set(
    allTimestamps.map(ts => new Date(ts).toISOString().slice(0, 10))
  )].sort().reverse();

  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak must start from today or yesterday to be considered active
  if (days[0] !== today && days[0] !== yesterday) return 1;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000;
    if (Math.round(diff) === 1) { streak++; } else { break; }
  }
  return streak;
}

/**
 * Derive a growth score letter grade from weighted activity stats.
 * TODO: replace placeholder logic with official My Tribe growth scoring system
 */
function getGrowthScore(stats) {
  const { sessions, streak, lessons, advice, hlc } = stats;
  const score =
    Math.min(sessions * 2, 20) +  // 10+ sessions = 20 pts
    Math.min(streak   * 4, 20) +  //  5+ day streak = 20 pts
    Math.min(lessons  * 3, 20) +  //  7+ lessons = 20 pts
    Math.min(advice   * 2, 20) +  // 10+ advice = 20 pts
    Math.min(hlc      * 5, 20);   //  4+ HLC msgs = 20 pts
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Build the home stats object from existing localStorage sources.
 * Falls back to placeholder defaults when a source doesn't exist yet.
 * Keep all fallback values here — not scattered through the UI.
 */
function getHomeStats() {
  // --- Sessions: total activity across all modules ---
  let sessions = 0;
  try {
    sessions =
      getConversations().length +
      getDebates().length +
      getPolls().length +
      getStoryLibrary().length;
  } catch { sessions = 24; } // fallback

  // --- Advice: advice/chat conversation sessions ---
  let advice = 0;
  try { advice = getConversations().length; } catch { advice = 16; } // fallback

  // --- Lessons: viewed book + core lessons ---
  // TODO: include spiritual lessons count once spiritual lessons store is finalized
  let lessons = 0;
  try {
    lessons = getViewedBooks().length + clGetViewedLessons().length;
  } catch { lessons = 12; } // fallback

  // --- Saved: saved books + saved stories ---
  let saved = 0;
  try {
    saved = getSavedBooks().length + getStoryLibrary().length;
  } catch { saved = 8; } // fallback

  // --- HLC: High-Level Conversations ---
  // TODO: replace fallback with real HLC session history once HLC module is finalized
  // No dedicated HLC store exists yet; using 0 as baseline
  const hlc = 0;

  // --- Streak: consecutive active days ---
  const streak = calculateStreak();

  // --- Time: estimated minutes spent across all activity ---
  // TODO: replace estimate with real session duration tracking once implemented
  // Rough estimates: advice ~10 min, lesson ~15 min, debate ~8 min, poll ~3 min
  let time = 0;
  try {
    time = Math.round(
      getConversations().length   * 10 +
      getDebates().length         *  8 +
      getPolls().length           *  3 +
      getViewedBooks().length     * 15 +
      clGetViewedLessons().length * 15
    );
  } catch { time = 320; } // fallback

  // --- Score: weighted growth grade ---
  const score = getGrowthScore({ sessions, streak, lessons, advice, hlc });

  return { sessions, streak, lessons, saved, advice, hlc, time, score };
}

// ── Home page rendering ───────────────────────────────────────────

function renderHomeAdvisors() {
  const grid = document.getElementById('home-advisors-grid');
  if (!grid) return;

  const names        = getAdvisorNames();
  const bvm          = getBvmData();
  const customAvatar = localStorage.getItem('tribe_custom_avatar');
  const allAdvisors  = [...TRIBE_IDS, 'guide', 'bvm'];

  grid.innerHTML = allAdvisors.map(id => {
    const adv         = ADVISORS[id];
    const displayName = names[id] || adv.name;
    const tipText     = adv.desc;

    let avatarHtml;
    if (id === 'bvm' && bvm?.avatar) {
      avatarHtml = `<img class="home-advisor-avatar" src="${bvm.avatar}" alt="${displayName}">`;
    } else if (id === 'guide' && customAvatar) {
      avatarHtml = `<img class="home-advisor-avatar" src="${customAvatar}" alt="${displayName}">`;
    } else if (id !== 'bvm') {
      avatarHtml = `<img class="home-advisor-avatar" src="../assets/avatars/${id}.png" alt="${displayName}">`;
    } else {
      avatarHtml = `<div class="home-advisor-initial" style="background:${adv.color}">${adv.initial}</div>`;
    }

    return `
      <div class="home-advisor-item" data-tip="${tipText.replace(/"/g, '&quot;')}">
        ${avatarHtml}
        <span class="home-advisor-name">${displayName}</span>
      </div>`;
  }).join('');

  // Wire fixed-position tooltip (escapes overflow-x:auto clipping)
  let tip = document.getElementById('home-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'home-tip';
    document.body.appendChild(tip);
  }

  grid.querySelectorAll('.home-advisor-item[data-tip]').forEach(item => {
    item.addEventListener('mouseenter', () => {
      tip.textContent = item.dataset.tip;
      tip.classList.add('visible');
      const r = item.getBoundingClientRect();
      tip.style.left = (r.left + r.width / 2) + 'px';
      tip.style.top  = (r.top - tip.offsetHeight - 10) + 'px';
      // Recalculate after paint so offsetHeight is accurate
      requestAnimationFrame(() => {
        const r2 = item.getBoundingClientRect();
        tip.style.top = (r2.top - tip.offsetHeight - 10) + 'px';
      });
    });
    item.addEventListener('mouseleave', () => tip.classList.remove('visible'));
  });
}

function renderHomeChatShortcuts() {
  const container = document.getElementById('home-chat-shortcuts');
  if (!container) return;

  const shortcuts = [
    {
      label: 'Advice',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
      action() {
        closeHomePage();
        document.getElementById('main-layout').style.display = '';
        closeDebate(); closeVoting(); closeCampfire(); closeBookLessons(); closeCoreLessons();
      }
    },
    {
      label: 'Debate',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      action() { closeHomePage(); openDebate(); }
    },
    {
      label: 'Polls',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      action() { closeHomePage(); openVoting(); }
    },
    {
      label: 'Campfire',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
      action() { closeHomePage(); openCampfire(); }
    },
    {
      label: 'HLC',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      action() { closeHomePage(); openHLM(); }
    }
  ];

  container.innerHTML = shortcuts.map(s => `
    <button class="home-shortcut-item" aria-label="${s.label}">
      <div class="home-shortcut-icon">${s.icon}</div>
      <span class="home-shortcut-label">${s.label}</span>
    </button>`).join('');

  shortcuts.forEach((s, i) => container.children[i].addEventListener('click', s.action));
}

function renderHomeEduShortcuts() {
  const container = document.getElementById('home-edu-shortcuts');
  if (!container) return;

  const shortcuts = [
    {
      label: 'Core',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      action() { closeHomePage(); openCoreLessons(); }
    },
    {
      label: 'Books',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      action() { closeHomePage(); openBookLessons(); }
    },
    {
      label: 'Spiritual',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L8 8H2l5 4-2 6 7-4 7 4-2-6 5-4h-6z"/></svg>`,
      action() { showNotice('Coming soon.'); }
    },
    {
      label: 'Blog',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><line x1="12" y1="7" x2="12" y2="17"/></svg>`,
      action() { closeHomePage(); openStoryLibrary(); }
    }
  ];

  container.innerHTML = shortcuts.map(s => `
    <button class="home-shortcut-item" aria-label="${s.label}">
      <div class="home-shortcut-icon">${s.icon}</div>
      <span class="home-shortcut-label">${s.label}</span>
    </button>`).join('');

  shortcuts.forEach((s, i) => container.children[i].addEventListener('click', s.action));
}

function renderHomeStats() {
  const grid = document.getElementById('home-stats-grid');
  if (!grid) return;

  const stats = getHomeStats();

  const cards = [
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
      value: stats.sessions,
      label: 'Sessions',
      helper: 'Total activity'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
      value: stats.streak + (stats.streak === 1 ? ' day' : ' days'),
      label: 'Streak',
      helper: 'Days active'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      value: stats.lessons,
      label: 'Lessons',
      helper: 'Completed'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
      value: stats.saved,
      label: 'Saved',
      helper: 'Books & stories'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
      value: stats.advice,
      label: 'Advice',
      helper: 'Sessions'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      value: stats.hlc,
      label: 'HLC',
      helper: 'High-level msgs'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      value: stats.time + ' min',
      label: 'Time',
      helper: 'Minutes spent'
    },
    {
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
      value: stats.score,
      label: 'Score',
      helper: 'A–F level'
    }
  ];

  grid.innerHTML = cards.map(c => `
    <div class="home-stat-card">
      <div class="home-stat-icon">${c.icon}</div>
      <div class="home-stat-value">${c.value}</div>
      <div class="home-stat-label">${c.label}</div>
      <div class="home-stat-helper">${c.helper}</div>
    </div>`).join('');
}

function renderHomeBlogsCarousel() {
  const track = document.getElementById('home-blogs-track');
  if (!track) return;

  // Collect stories: today's daily story first, then saved library
  const stories = [];

  // Today's daily story
  try {
    const cached = JSON.parse(localStorage.getItem(getDailyStoryKey()));
    if (cached && cached.title) stories.push(cached);
  } catch {}

  // Saved story library (exclude today's if already included)
  try {
    getStoryLibrary().forEach(s => {
      if (!stories.find(x => x.title === s.title)) stories.push(s);
    });
  } catch {}

  if (stories.length === 0) {
    track.innerHTML = `
      <div class="home-blog-card home-blog-empty">
        <div class="home-blog-empty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div class="home-blog-empty-text">Today's blog story is on its way.</div>
      </div>`;
    return;
  }

  track.innerHTML = stories.slice(0, 8).map(story => {
    const advisor   = ADVISORS[story.narrator] || {};
    const avatarSrc = ADVISOR_AVATAR[story.narrator];
    const avatarHtml = avatarSrc
      ? `<img class="home-blog-avatar" src="${avatarSrc}" alt="${esc(advisor.name || '')}">`
      : `<div class="home-blog-avatar home-blog-avatar-init" style="background:${advisor.color || '#888'}">${advisor.initial || '?'}</div>`;
    return `
      <button class="home-blog-card" data-title="${esc(story.title || '')}">
        <div class="home-blog-card-top">
          ${avatarHtml}
          <span class="home-blog-category">${esc(story.category || '')}</span>
        </div>
        <div class="home-blog-title">${esc(story.title || '')}</div>
        <div class="home-blog-narrator">by ${esc(advisor.name || story.narrator || '')}</div>
      </button>`;
  }).join('');

  // Wire card click handlers
  track.querySelectorAll('.home-blog-card[data-title]').forEach((card, i) => {
    card.addEventListener('click', () => openStoryViewer(stories[i]));
  });

  // Wire prev/next arrows — scroll exactly one card width + gap
  const scrollBy = () => (track.offsetWidth - 28) / 3 + 14;
  const prev = document.getElementById('home-blogs-prev');
  const next = document.getElementById('home-blogs-next');
  if (prev) prev.onclick = () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
  if (next) next.onclick = () => track.scrollBy({ left:  scrollBy(), behavior: 'smooth' });
}

function renderHomePage() {
  // Update welcome title from profile
  const profile = getProfile();
  const titleEl = document.getElementById('home-welcome-title');
  if (titleEl) {
    const userName = profile.displayName || profile.name || '';
    titleEl.textContent = userName ? `Welcome back, ${userName}` : 'Welcome back';
  }

  renderHomeAdvisors();
  renderHomeChatShortcuts();
  renderHomeEduShortcuts();
  renderHomeBlogsCarousel();
  renderHomeStats();
}

function openHomePage() {
  // Hide main layout and all full-page views
  document.getElementById('main-layout').style.display = 'none';
  ['profile-page', 'advisors-page', 'book-lessons-page',
   'core-lessons-page', 'debate-page', 'voting-page', 'campfire-page', 'hlm-page'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  renderHomePage();
  document.getElementById('home-page').style.display = 'block';
}

function closeHomePage() {
  document.getElementById('home-page').style.display = 'none';
}

// ══════════════════════════════════════════════════════════════════════════════
// HLM PAGE — High Level Messaging
// ══════════════════════════════════════════════════════════════════════════════

const HLM_TONES = [
  'Calm', 'Assertive', 'Empathetic', 'Direct', 'Gentle',
  'Confident', 'Honest', 'Firm', 'Warm', 'Neutral'
];
const HLM_AVOID_TONES = [
  'Aggressive', 'Passive-aggressive', 'Defensive',
  'Dismissive', 'Cold', 'Blaming', 'Sarcastic', 'Condescending'
];

const HLM_EXAMPLES = [
  {
    scenario: 'Partner canceled plans last minute',
    low:  "You always do this. You never care about my time. I can't believe you canceled again.",
    high: "I was really looking forward to tonight and I felt disappointed when plans changed. Can we talk about how to handle this better going forward?"
  },
  {
    scenario: 'Boss gives critical feedback in public',
    low:  "That was embarrassing and unnecessary. You had no right to call me out in front of everyone.",
    high: "I wanted to share that I find it harder to receive feedback when it's given in a group setting. I'd appreciate if we could handle corrections privately — I'd respond much better."
  },
  {
    scenario: 'Friend keeps asking for money',
    low:  "Stop asking me for money. You're using me and it's getting old.",
    high: "I care about you and I want to be honest — I'm not in a position to keep lending money. It's starting to affect how I feel in our friendship, and I'd rather protect that."
  }
];

const HLM_GUIDANCE = [
  {
    title: 'Lead with Observation, Not Judgment',
    body:  'Instead of "You never listen," try "When I was speaking, I noticed I was interrupted a few times." Observations are inarguable — judgments start arguments.'
  },
  {
    title: 'Name Your Need, Not the Blame',
    body:  'People respond better to needs than accusations. "I need to feel heard" lands very differently from "You never listen to me." Focus on what you want, not what they did wrong.'
  },
  {
    title: 'Give Context for Your Emotional State',
    body:  '"I\'m feeling anxious about bringing this up because I care about us" builds empathy before the hard part. Vulnerability before confrontation disarms defensiveness.'
  }
];

let hlmState = {
  desiredTones: new Set(),
  avoidTones:   new Set(),
  activeTab:    'draft',
  output:       { draft: '', stronger: '', softer: '', short: '' },
  loading:      false
};

function initHLMToneChips() {
  const desiredEl = document.getElementById('hlm-tone-desired');
  const avoidEl   = document.getElementById('hlm-tone-avoid');
  if (!desiredEl || !avoidEl) return;

  // Reset state sets on re-open
  hlmState.desiredTones.clear();
  hlmState.avoidTones.clear();

  desiredEl.innerHTML = HLM_TONES.map(t =>
    `<button class="hlm-chip" data-tone="${t}">${t}</button>`
  ).join('');

  avoidEl.innerHTML = HLM_AVOID_TONES.map(t =>
    `<button class="hlm-chip" data-tone="${t}">${t}</button>`
  ).join('');

  desiredEl.querySelectorAll('.hlm-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const tone = btn.dataset.tone;
      if (hlmState.desiredTones.has(tone)) {
        hlmState.desiredTones.delete(tone);
        btn.classList.remove('active');
      } else {
        hlmState.desiredTones.add(tone);
        btn.classList.add('active');
      }
    });
  });

  avoidEl.querySelectorAll('.hlm-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const tone = btn.dataset.tone;
      if (hlmState.avoidTones.has(tone)) {
        hlmState.avoidTones.delete(tone);
        btn.classList.remove('active');
      } else {
        hlmState.avoidTones.add(tone);
        btn.classList.add('active');
      }
    });
  });
}

function renderHLMExamples() {
  const grid = document.getElementById('hlm-examples-grid');
  if (!grid) return;
  grid.innerHTML = HLM_EXAMPLES.map(ex => `
    <div class="hlm-example-card">
      <div class="hlm-example-scenario">${esc(ex.scenario)}</div>
      <div class="hlm-example-row">
        <div class="hlm-example-col">
          <div class="hlm-example-col-label low">Low Level</div>
          <div class="hlm-example-col-text">${esc(ex.low)}</div>
        </div>
        <div class="hlm-example-col">
          <div class="hlm-example-col-label high">High Level</div>
          <div class="hlm-example-col-text">${esc(ex.high)}</div>
        </div>
      </div>
    </div>`).join('');
}

function renderHLMGuidance() {
  const el = document.getElementById('hlm-guidance-cards');
  if (!el) return;
  el.innerHTML = HLM_GUIDANCE.map(g => `
    <div class="hlm-guidance-card">
      <div class="hlm-guidance-title">${esc(g.title)}</div>
      <div class="hlm-guidance-body">${esc(g.body)}</div>
    </div>`).join('');
}

function hlmSetTab(tab) {
  hlmState.activeTab = tab;
  document.querySelectorAll('#hlm-output-tabs .hlm-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const textEl = document.getElementById('hlm-output-text');
  if (textEl) textEl.textContent = hlmState.output[tab] || '';
}

async function generateHLMMessage(modifier) {
  const situation = (document.getElementById('hlm-situation')?.value || '').trim();
  const recipient = (document.getElementById('hlm-recipient')?.value || '').trim();
  const sitType   = document.getElementById('hlm-situation-type')?.value || '';
  const intention = document.getElementById('hlm-intention')?.value || '';

  if (!situation) {
    showNotice('Please describe what happened first.');
    return;
  }

  const btn = document.getElementById('hlm-generate-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }
  hlmState.loading = true;

  const desiredList = [...hlmState.desiredTones].join(', ') || 'none specified';
  const avoidList   = [...hlmState.avoidTones].join(', ')   || 'none specified';

  const basePrompt = modifier
    ? `The user wants to modify an existing message: ${modifier}.\n\nOriginal draft:\n${hlmState.output.draft}\n\nSituation context:\n${situation}`
    : `Situation type: ${sitType || 'general'}\nRecipient: ${recipient || 'not specified'}\nWhat happened: ${situation}\nDesired tone: ${desiredList}\nTone to avoid: ${avoidList}\nMain intention: ${intention || 'not specified'}`;

  const systemPrompt = `You are a High Level Messaging coach. You help people communicate with emotional intelligence — expressing needs clearly without blame, judgment, or reactivity.

When given a situation, produce exactly 4 versions of a message as a JSON object:
{
  "draft": "...",
  "stronger": "...",
  "softer": "...",
  "short": "..."
}

- draft: A balanced, thoughtful message ready to send
- stronger: More assertive and direct while remaining respectful
- softer: More gentle, empathetic, and de-escalating
- short: The essence in 1-2 sentences

Rules:
- No blame, accusation, or "you always/never" statements
- Use "I" statements and observations over judgments
- Acknowledge the other person's perspective where possible
- Keep messages realistic and genuinely sendable
- Output only valid JSON, no extra text`;

  try {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: basePrompt }]
      })
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    const rawText = data.content?.[0]?.text || data.choices?.[0]?.message?.content || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    hlmState.output = {
      draft:    parsed.draft    || '',
      stronger: parsed.stronger || '',
      softer:   parsed.softer   || '',
      short:    parsed.short    || ''
    };

    const outputSection = document.getElementById('hlm-output-section');
    if (outputSection) outputSection.style.display = '';
    hlmSetTab('draft');

  } catch (err) {
    showNotice('Could not generate message. Please try again.');
    console.error('HLM generate error:', err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Generate Message'; }
    hlmState.loading = false;
  }
}

function openHLM() {
  document.getElementById('main-layout').style.display = 'none';
  ['profile-page', 'advisors-page', 'book-lessons-page', 'core-lessons-page',
   'debate-page', 'voting-page', 'campfire-page', 'home-page'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const page = document.getElementById('hlm-page');
  if (page) page.style.display = '';
  initHLMToneChips();
  renderHLMExamples();
  renderHLMGuidance();
}

function closeHLM() {
  const page = document.getElementById('hlm-page');
  if (page) page.style.display = 'none';
}

function initHLMPage() {
  document.getElementById('hlm-back-btn')?.addEventListener('click', () => {
    closeHLM();
    openHomePage();
  });

  document.getElementById('hlm-generate-btn')?.addEventListener('click', () => generateHLMMessage(null));

  document.getElementById('hlm-output-tabs')?.addEventListener('click', e => {
    const tab = e.target.closest('.hlm-tab')?.dataset.tab;
    if (tab) hlmSetTab(tab);
  });

  document.getElementById('hlm-copy-btn')?.addEventListener('click', () => {
    const text = hlmState.output[hlmState.activeTab];
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showNotice('Copied!')).catch(() => {});
  });

  document.getElementById('hlm-regen-btn')?.addEventListener('click', () => generateHLMMessage(null));

  document.getElementById('hlm-direct-btn')?.addEventListener('click', () =>
    generateHLMMessage('Make it more direct and assertive without losing empathy'));

  document.getElementById('hlm-warm-btn')?.addEventListener('click', () =>
    generateHLMMessage('Make it warmer and more emotionally connecting'));

  document.getElementById('hlm-short-btn')?.addEventListener('click', () =>
    generateHLMMessage('Make it more concise, cut to the core message'));

  // Nav buttons
  document.getElementById('btn-hlm')?.addEventListener('click', () => { closeNavMenus(); openHLM(); });
  document.getElementById('m-btn-hlm')?.addEventListener('click', () => { closeMobileNav(); openHLM(); });
}

// Wire HLM on DOM ready (called from DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => { initHLMPage(); }, { once: true });
