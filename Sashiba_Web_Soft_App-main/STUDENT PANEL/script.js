/* ==========================================================================
   SashiBa Ed-Tech SaaS / LMS Master JavaScript Engine (v8.0)
   Data-driven LMS logic with Course Outlines, AI Flashcards, & Rewards Shop
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. APPLICATION STATE =================
  const state = {
    currentLevel: 'ssc',
    currentView: 'home',
    activeSubjectId: 'physics',
    activeChapterId: 3,
    activeSubjectTab: 'overview',
    theme: localStorage.getItem('sashiba_theme') || 'light',
    blueLightShield: false,
    fontScale: 1.1,

    // Student Progress & Currency
    xp: 2450,
    level: 12,
    coins: 1250,
    completedGoals: 3,
    totalGoals: 5,

    // Practice & Flashcard State
    practiceMode: 'mcq', // 'mcq' | 'flashcard' | 'short'
    isTimedMode: true,
    flashcardIndex: 0,
    activeLeaderboard: 'global',

    // Pomodoro Timer
    pomoTimeRemaining: 25 * 60,
    pomoTotalTime: 25 * 60,
    pomoInterval: null,
    isPomoRunning: false,
    ambientSound: 'off',

    // Quotes
    quotes: [
      '"জ্ঞান অর্জনের কোনো বিকল্প নেই, আজকের পরিশ্রমই আগামীকালের সাফল্যের ভিত্তি।"',
      '"কঠিন অধ্যবসায় ও ধারাবাহিকতাই সফলতার মূল চাবিকাঠি।"',
      '"প্রতিটি ছোট প্র্যাকটিসই আপনাকে চূড়ান্ত পরীক্ষার কাছাকাছি নিয়ে যায়।"'
    ],
    quoteIndex: 0
  };

  // ================= 2. INITIALIZATION =================
  initTheme();
  initNavigation();
  initLevelSelector();
  initDashboardEvents();
  initSubjectWorkspace();
  initPracticeLab();
  initExamPrep();
  initPomodoroTimer();
  initAiAssistant();
  initAchievementsAndShop();
  initSettings();

  // Initial render of home view
  updateBreadcrumbs(['হোম', 'ড্যাশবোর্ড']);
  updateXpDisplay();

  // ================= 3. THEME & EYE CARE ENGINE =================
  function initTheme() {
    document.body.className = `mode-${state.theme}`;
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    if (state.theme === 'light') icon.className = 'fa-solid fa-sun';
    else if (state.theme === 'sepia') icon.className = 'fa-solid fa-book-open-reader';
    else icon.className = 'fa-solid fa-moon';
  }

  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    if (state.theme === 'light') state.theme = 'sepia';
    else if (state.theme === 'sepia') state.theme = 'dark';
    else state.theme = 'light';

    localStorage.setItem('sashiba_theme', state.theme);
    initTheme();
  });

  const blueLightShield = document.getElementById('blueLightOverlay');
  document.getElementById('blueLightToggleBtn')?.addEventListener('click', () => {
    state.blueLightShield = !state.blueLightShield;
    if (state.blueLightShield) blueLightShield?.classList.add('active');
    else blueLightShield?.classList.remove('active');
  });

  // ================= 4. NAVIGATION & SKELETON LOADER =================
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('active');
    });

    // Accordion Toggle for "More Tools" Sidebar Section
    const accordionToggle = document.getElementById('moreToolsToggle');
    accordionToggle?.addEventListener('click', () => {
      const accordion = accordionToggle.parentElement;
      accordion.classList.toggle('open');
    });
  }

  window.switchView = function(viewName) {
    triggerSkeletonLoader(() => {
      state.currentView = viewName;
      
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`view-${viewName}`);
      if (targetPanel) targetPanel.classList.add('active');

      document.querySelectorAll('.nav-item').forEach(nav => {
        if (nav.getAttribute('data-view') === viewName) nav.classList.add('active');
        else nav.classList.remove('active');
      });

      // Update Breadcrumbs
      const viewNamesBn = {
        'home': ['হোম', 'ড্যাশবোর্ড'],
        'subjects': ['হোম', 'আমার বিষয়সমূহ'],
        'subject-inner': ['হোম', 'বিষয়সমূহ', getActiveSubject().name, `অধ্যায় ${state.activeChapterId}`],
        'daily-planner': ['হোম', 'আজকের পড়া (Planner)'],
        'practice': ['হোম', 'অনুশীলন ও AI কুইজ'],
        'exams': ['হোম', 'পরীক্ষা প্রস্তুতি'],
        'progress': ['অন্যান্য টুলস', 'আমার অগ্রগতি'],
        'achievements': ['অন্যান্য টুলস', 'অর্জন ও রিওয়ার্ড শপ'],
        'resources': ['অন্যান্য টুলস', 'রিসোর্স হাব'],
        'ai-assistant': ['হোম', 'AI স্টাডি টিউটর'],
        'study-manager': ['অন্যান্য টুলস', 'Smart Study Manager'],
        'settings': ['অন্যান্য টুলস', 'সেটিংস']
      };

      updateBreadcrumbs(viewNamesBn[viewName] || ['হোম', viewName]);

      if (viewName === 'subjects') renderSubjectsGrid();
      if (viewName === 'achievements') renderAchievementsAndShop();
    });
  };

  function triggerSkeletonLoader(callback) {
    const loader = document.getElementById('skeletonLoader');
    if (loader) {
      loader.classList.add('active');
      setTimeout(() => {
        loader.classList.remove('active');
        if (callback) callback();
      }, 220);
    } else if (callback) {
      callback();
    }
  }

  function updateBreadcrumbs(items) {
    const bcBar = document.getElementById('breadcrumbsBar');
    if (!bcBar) return;

    bcBar.innerHTML = items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return `
        <span class="bc-item ${isLast ? 'active' : ''}">${idx === 0 ? '<i class="fa-solid fa-house"></i> ' : ''}${item}</span>
        ${!isLast ? '<span class="bc-sep"><i class="fa-solid fa-chevron-right"></i></span>' : ''}
      `;
    }).join('');
  }

  // ================= 5. XP & CURRENCY SYSTEM =================
  window.toggleGoalItem = function(checkbox, xpAmount) {
    const label = checkbox.closest('.goal-item');
    if (checkbox.checked) {
      label.classList.add('done');
      addRewards(xpAmount, 25, 'আজকের লক্ষ্য পূরণের জন্য দারুণ!');
      state.completedGoals = Math.min(state.totalGoals, state.completedGoals + 1);
    } else {
      label.classList.remove('done');
      state.xp = Math.max(0, state.xp - xpAmount);
      state.completedGoals = Math.max(0, state.completedGoals - 1);
      updateXpDisplay();
    }
  };

  window.addRewards = function(xpAmount, coinsAmount, subtitle) {
    state.xp += xpAmount;
    state.coins += coinsAmount;
    updateXpDisplay();
    showXpToast(`+${xpAmount} XP | +${coinsAmount} 🪙 কয়েন অর্জিত!`, subtitle);
  };

  function showXpToast(title, subtitle) {
    const toast = document.getElementById('xpRewardToast');
    if (!toast) return;
    toast.querySelector('.xp-title').textContent = title;
    toast.querySelector('.xp-sub').textContent = subtitle;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function updateXpDisplay() {
    const sidebarXp = document.getElementById('sidebarXp');
    const sidebarCoins = document.getElementById('sidebarCoins');
    const xpVal = document.getElementById('xpVal');
    const coinsVal = document.getElementById('coinsVal');
    const goalText = document.getElementById('goalProgressText');
    const goalBadge = document.getElementById('goalPercentBadge');

    if (sidebarXp) sidebarXp.textContent = `${state.xp.toLocaleString()} XP`;
    if (sidebarCoins) sidebarCoins.textContent = `🪙 ${state.coins.toLocaleString()}`;
    if (xpVal) xpVal.textContent = `XP: ${state.xp.toLocaleString()}`;
    if (coinsVal) coinsVal.textContent = `কয়েন: ${state.coins.toLocaleString()}`;

    if (goalText) goalText.textContent = `${state.completedGoals}/${state.totalGoals}`;
    if (goalBadge) {
      const pct = Math.round((state.completedGoals / state.totalGoals) * 100);
      goalBadge.textContent = `${pct}% সম্পন্ন`;
    }
  }

  // ================= 6. CLASS LEVEL SELECTOR =================
  function initLevelSelector() {
    const levelPills = document.querySelectorAll('.level-pill');
    levelPills.forEach(pill => {
      pill.addEventListener('click', () => {
        levelPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.currentLevel = pill.getAttribute('data-level');
        if (state.currentView === 'subjects') renderSubjectsGrid();
      });
    });
  }

  // ================= 7. DASHBOARD EVENTS & QUOTES =================
  function initDashboardEvents() {
    document.getElementById('nextQuoteBtn')?.addEventListener('click', () => {
      state.quoteIndex = (state.quoteIndex + 1) % state.quotes.length;
      const quoteEl = document.getElementById('dailyQuote');
      if (quoteEl) quoteEl.textContent = state.quotes[state.quoteIndex];
    });
  }

  // ================= 8. SUBJECT CATALOG & COURSE OUTLINE FLOW =================
  function getActiveSubject() {
    const catalog = SASHIBA_DATA.subjectCatalog[state.currentLevel] || SASHIBA_DATA.subjectCatalog.ssc;
    return catalog.find(s => s.id === state.activeSubjectId) || catalog[0];
  }

  function renderSubjectsGrid() {
    const grid = document.getElementById('subjectsGrid');
    const outlineContainer = document.getElementById('subjectCourseOutlineContainer');
    if (!grid) return;

    if (outlineContainer) outlineContainer.style.display = 'none';

    const catalog = SASHIBA_DATA.subjectCatalog[state.currentLevel] || SASHIBA_DATA.subjectCatalog.ssc;
    grid.innerHTML = catalog.map(sub => `
      <div class="subject-card">
        <div class="subject-card-header">
          <div class="subject-icon" style="background: ${sub.color}">
            <i class="fa-solid ${sub.icon}"></i>
          </div>
          <div class="subject-info">
            <h3>${sub.name}</h3>
            <p>বিষয় কোড: ${sub.code} • ${sub.chapters.length}টি অধ্যায়</p>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">${sub.description}</p>
        <div class="subject-progress-bar">
          <div class="p-bar-track">
            <div class="p-bar-fill" style="width: ${sub.progress}%; background: ${sub.color}"></div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted);">মোট সিলেবাস অগ্রগতি: ${sub.progress}%</span>
        </div>
        <button class="btn-primary btn-block" onclick="openSubjectOutline('${sub.id}')">
          <i class="fa-solid fa-list-ol"></i> অধ্যায়ের তালিকা (Course Outline)
        </button>
      </div>
    `).join('');
  }

  // COURSE OUTLINE VIEW (SHOWS ALL CHAPTERS OF A SUBJECT FIRST)
  window.openSubjectOutline = function(subjId) {
    state.activeSubjectId = subjId;
    const subject = getActiveSubject();

    const outlineContainer = document.getElementById('subjectCourseOutlineContainer');
    if (!outlineContainer) return;

    outlineContainer.style.display = 'block';
    outlineContainer.innerHTML = `
      <div style="background: var(--bg-card); border: 2px solid var(--primary); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 900; color: var(--text-main);"><i class="fa-solid ${subject.icon} text-primary"></i> ${subject.name} - কোর্স আউটলাইন ও অধ্যায়সমূহ</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted);">যেকোনো অধ্যায়ে ক্লিক করে ভিডিও লেকচার, নোটস ও অনুশীলনে প্রবেশ করুন</p>
          </div>
          <span class="badge-code">কোড: ${subject.code}</span>
        </div>

        <div class="chapters-outline-list">
          ${subject.chapters.map(chap => `
            <div class="course-outline-card">
              <div class="co-info">
                <h4>${chap.title} ${chap.completed ? '<span class="badge-pill" style="background: var(--success-light); color: var(--success);"><i class="fa-solid fa-check"></i> সম্পন্ন</span>' : ''}</h4>
                <p>${chap.desc} • ⏱️ ${chap.duration}</p>
                <div class="co-topics-list">
                  ${chap.topics.map(t => `<span class="co-topic-pill"><i class="fa-solid fa-hashtag text-primary"></i> ${t}</span>`).join('')}
                </div>
              </div>
              <button class="btn-primary" onclick="openSubjectWorkspace('${subject.id}', ${chap.id})">
                <i class="fa-solid fa-book-open"></i> অধ্যায়ে প্রবেশ করুন
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    updateBreadcrumbs(['হোম', 'আমার বিষয়সমূহ', subject.name, 'কোর্স আউটলাইন']);
    outlineContainer.scrollIntoView({ behavior: 'smooth' });
  };

  window.openSubjectWorkspace = function(subjId, chapId = 3) {
    state.activeSubjectId = subjId;
    state.activeChapterId = chapId;
    switchView('subject-inner');
    renderSubjectWorkspaceContent();
  };

  function initSubjectWorkspace() {
    document.getElementById('backToOutlineBtn')?.addEventListener('click', () => {
      switchView('subjects');
      openSubjectOutline(state.activeSubjectId);
    });

    const subjNavItems = document.querySelectorAll('.subj-nav-item');
    subjNavItems.forEach(item => {
      item.addEventListener('click', () => {
        subjNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        state.activeSubjectTab = item.getAttribute('data-tab');
        renderSubjectWorkspaceContent();
      });
    });
  }

  function renderSubjectWorkspaceContent() {
    const tagsContainer = document.getElementById('autoSuggestedTags');
    const contentArea = document.getElementById('subjTabContent');
    const subject = getActiveSubject();
    const chapter = subject.chapters.find(c => c.id === state.activeChapterId) || subject.chapters[0];

    document.getElementById('activeSubjectTitle').textContent = `${subject.name}: ${chapter.title}`;
    document.getElementById('activeSubjectCode').textContent = `কোড: ${subject.code}`;
    document.getElementById('activeSubjectProgressText').textContent = `${chapter.progress}%`;

    if (tagsContainer) {
      tagsContainer.innerHTML = chapter.topics.map(t => `
        <span class="ast-tag hot"><i class="fa-solid fa-fire"></i> ${t}</span>
      `).join('');
    }

    if (!contentArea) return;

    if (state.activeSubjectTab === 'videos') {
      renderVideoPlayerTab(contentArea, chapter);
    } else if (state.activeSubjectTab === 'discussion') {
      renderChapterDiscussionChat(contentArea);
    } else if (state.activeSubjectTab === 'notes') {
      contentArea.innerHTML = `
        <div style="background: var(--bg-card); padding: 1.75rem; border-radius: var(--radius-xl); border: 2px solid var(--border);">
          <h3 style="margin-bottom: 1rem;"><i class="fa-solid fa-file-pdf text-danger"></i> ${chapter.title} - শিক্ষকের সম্পূর্ণ পিডিএফ নোটস</h3>
          <p style="margin-bottom: 1.5rem;">বোর্ড পরীক্ষার জন্য প্রস্তুতিমূলক নোট ও বিগত বছরের গাণিতিক প্রশ্নের সমাধান।</p>
          <button class="btn-primary" onclick="alert('pdf ডাউনলোড হচ্ছে...')"><i class="fa-solid fa-download"></i> PDF ডাউনলোড করুন (3.2 MB)</button>
        </div>
      `;
    } else {
      contentArea.innerHTML = `
        <div style="background: var(--bg-card); padding: 1.75rem; border-radius: var(--radius-xl); border: 2px solid var(--border);">
          <h3 style="margin-bottom: 1rem;"><i class="fa-solid fa-book-open text-primary"></i> ${chapter.title}</h3>
          <p style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--text-main); font-weight: 600;">${chapter.desc}</p>
          <div style="background: var(--bg-input); padding: 1.25rem; border-radius: var(--radius-md); font-family: monospace; font-size: 1.2rem; margin-bottom: 1.5rem; border: 1.5px solid var(--border);">
            $$F = m \\times a$$
          </div>
          <button class="btn-primary" onclick="switchView('practice')"><i class="fa-solid fa-pen-clip"></i> এই অধ্যায়ের AI কুইজ সেশন শুরু করুন</button>
        </div>
      `;
    }
  }

  // VIDEO PLAYER TAB WITH WATCH XP REWARD
  function renderVideoPlayerTab(container, chapter) {
    container.innerHTML = `
      <div style="background: var(--bg-card); border: 2px solid var(--border); border-radius: var(--radius-xl); padding: 1.5rem;">
        <h3 style="font-size: 1.2rem; font-weight: 900; margin-bottom: 1rem;"><i class="fa-solid fa-circle-play text-primary"></i> ${chapter.title} - এইচডি ভিডিও ক্লাস</h3>
        
        <div class="video-player-container">
          <iframe class="video-iframe" src="${chapter.videoUrl}" title="Lecture Video" allowfullscreen></iframe>
        </div>

        <div class="lesson-progress-meter">
          <div>
            <h5 style="font-size: 0.95rem; font-weight: 800;">ভিডিও লেসন ওয়াচ প্রোগ্রেস: ${chapter.progress}%</h5>
            <p style="font-size: 0.8rem; color: var(--text-muted);">সম্পূর্ণ ভিডিওটি দেখলে পাবেন +১০ XP এবং ৫ কয়েন</p>
          </div>
          <button class="btn-primary" onclick="addRewards(10, 5, 'ভিডিও লেকচার দেখার জন্য ধন্যবাদ!')">
            <i class="fa-solid fa-circle-check"></i> দেখা শেষ (+10 XP & 5 🪙)
          </button>
        </div>
      </div>
    `;
  }

  // CHAPTER DISCUSSION CHAT
  function renderChapterDiscussionChat(container) {
    container.innerHTML = `
      <div class="chapter-chat-box">
        <div class="chat-header">
          <i class="fa-solid fa-comments text-primary"></i> 
          <span>সহপাঠীদের সাথে যৌথ আলোচনা ও চ্যাট রুম</span>
        </div>
        <div class="chat-messages" id="chapterChatMsgBox">
          <div class="chat-msg">
            <div class="msg-avatar">স</div>
            <div class="msg-body">
              <strong>সাদিয়া সুলতানা • ১০:১৫ AM</strong>
              <p>নিউটনের ২য় সূত্রের $F=ma$ ম্যাথটিতে $a$ কিভাবে বের করতে হয় কেউ একটু বুঝিয়ে বলবে?</p>
            </div>
          </div>
          <div class="chat-msg student-msg">
            <div class="msg-avatar">র</div>
            <div class="msg-body">
              <strong>রাহাত খান (আপনি) • ১০:২০ AM</strong>
              <p>বল $F = m \\times \\frac{v - u}{t}$ সূত্র ব্যবহার করে সহজেই ত্বরণ $a$ বের করতে পারবে!</p>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chapterChatInput" placeholder="অধ্যায়ের যেকোনো প্রশ্ন বা মতামত লিখুন...">
          <button class="btn-primary" onclick="sendChapterMessage()"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    `;
  }

  window.sendChapterMessage = function() {
    const input = document.getElementById('chapterChatInput');
    const msgBox = document.getElementById('chapterChatMsgBox');
    if (!input || !input.value.trim() || !msgBox) return;

    msgBox.innerHTML += `
      <div class="chat-msg student-msg">
        <div class="msg-avatar">র</div>
        <div class="msg-body">
          <strong>রাহাত খান (আপনি) • এখন</strong>
          <p>${input.value.trim()}</p>
        </div>
      </div>
    `;
    input.value = '';
    msgBox.scrollTop = msgBox.scrollHeight;
  };

  // ================= 9. PRACTICE LAB, AI QUIZ & FLASHCARDS =================
  function initPracticeLab() {
    renderPracticeContainer();

    document.getElementById('generateAiQuizBtn')?.addEventListener('click', generateAiQuizQuestions);

    document.getElementById('modeTimedBtn')?.addEventListener('click', (e) => {
      state.isTimedMode = true;
      document.getElementById('modeTimedBtn').classList.add('active');
      document.getElementById('modeCasualBtn').classList.remove('active');
      showXpToast('⏱️ Timed Mode সক্রিয়', 'কুইজে সময়সীমা বজায় থাকবে!');
    });

    document.getElementById('modeCasualBtn')?.addEventListener('click', (e) => {
      state.isTimedMode = false;
      document.getElementById('modeCasualBtn').classList.add('active');
      document.getElementById('modeTimedBtn').classList.remove('active');
      showXpToast('☕ Casual Mode সক্রিয়', 'নিশ্চিন্তে সময় ছাড়া অনুশীলন করুন!');
    });

    const catCards = document.querySelectorAll('.p-cat-card');
    catCards.forEach(card => {
      card.addEventListener('click', () => {
        catCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.practiceMode = card.getAttribute('data-ptype');
        renderPracticeContainer();
      });
    });
  }

  function renderPracticeContainer() {
    const container = document.getElementById('practiceContainer');
    if (!container) return;

    if (state.practiceMode === 'flashcard') {
      renderAiFlashcards(container);
    } else {
      renderDefaultPracticeQuestions(container);
    }
  }

  // INTERACTIVE 3D AI FLASHCARDS
  function renderAiFlashcards(container) {
    const deck = SASHIBA_DATA.flashcards[state.activeSubjectId] || SASHIBA_DATA.flashcards.physics;
    const card = deck[state.flashcardIndex % deck.length];

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <h3 style="font-size: 1.3rem; font-weight: 900;"><i class="fa-solid fa-layer-group text-primary"></i> ✨ AI ফ্ল্যাশকার্ডস (কার্ড উল্টে উত্তর দেখুন)</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted);">কার্ডে ক্লিক করলে ৩D উল্টে উত্তর ও সূত্র দেখা যাবে</p>
      </div>

      <div class="flashcard-wrapper" id="flashcardWrap" onclick="this.classList.toggle('flipped')">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <span class="fc-badge">${card.category} • কার্ড ${state.flashcardIndex + 1}/${deck.length}</span>
            <div class="fc-term">${card.term}</div>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);"><i class="fa-solid fa-hand-pointer"></i> উত্তর দেখতে ক্লিক করুন</span>
          </div>
          <div class="flashcard-back">
            <span class="fc-badge">AI ব্যাখ্যা ও সূত্র</span>
            <div class="fc-def">${card.definition}</div>
            <div style="font-family: monospace; font-size: 1.1rem; background: rgba(0,0,0,0.2); padding: 0.5rem 1rem; border-radius: var(--radius-md);">
              ${card.formula}
            </div>
          </div>
        </div>
      </div>

      <div class="flashcard-controls">
        <button class="btn-outline" onclick="prevFlashcard()"><i class="fa-solid fa-arrow-left"></i> আগের কার্ড</button>
        <button class="btn-primary" onclick="nextFlashcard(true)"><i class="fa-solid fa-check"></i> বুঝেছি (+15 XP & 5 🪙)</button>
        <button class="btn-outline" onclick="nextFlashcard(false)">পরের কার্ড <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    `;
  }

  window.nextFlashcard = function(isLearned) {
    if (isLearned) addRewards(15, 5, 'ফ্ল্যাশকার্ড পড়া সম্পন্ন!');
    const deck = SASHIBA_DATA.flashcards[state.activeSubjectId] || SASHIBA_DATA.flashcards.physics;
    state.flashcardIndex = (state.flashcardIndex + 1) % deck.length;
    renderPracticeContainer();
  };

  window.prevFlashcard = function() {
    const deck = SASHIBA_DATA.flashcards[state.activeSubjectId] || SASHIBA_DATA.flashcards.physics;
    state.flashcardIndex = (state.flashcardIndex - 1 + deck.length) % deck.length;
    renderPracticeContainer();
  };

  function renderDefaultPracticeQuestions(container) {
    container.innerHTML = `
      <div class="question-card">
        <div class="q-header">
          <span>প্রশ্ন ১: ৫ কেজি ভরের বস্তুর ওপর ১০ নিউটন বল প্রয়োগ করা হলে ত্বরণ কত হবে?</span>
          <span class="badge-pill">পদার্থবিজ্ঞান</span>
        </div>
        <div class="q-options">
          <div class="q-option" onclick="checkAnswerWithAiAnalysis(this, false, '১ m/s^2', '১০/৫ = ২ m/s^2 হবে, ভুল হিসাব করা হয়েছে।')">ক) ১ $m/s^2$</div>
          <div class="q-option" onclick="checkAnswerWithAiAnalysis(this, true, '২ m/s^2', 'সঠিক! F = ma সূত্রানুসারে a = F/m = 10/5 = 2 m/s^2')">খ) ২ $m/s^2$ (সঠিক উত্তর)</div>
          <div class="q-option" onclick="checkAnswerWithAiAnalysis(this, false, '৩ m/s^2', 'ভুল উত্তর। সূত্রের ভাগ সঠিক হয়নি।')">গ) ৩ $m/s^2$</div>
        </div>
        <div id="aiAnalysisOutput_1"></div>
      </div>
    `;
  }

  window.checkAnswerWithAiAnalysis = function(element, isCorrect, chosenText, aiExplanation) {
    const options = element.parentElement.querySelectorAll('.q-option');
    options.forEach(o => o.classList.remove('correct', 'wrong'));

    const outputBox = document.getElementById('aiAnalysisOutput_1');

    if (isCorrect) {
      element.classList.add('correct');
      addRewards(20, 10, 'সঠিক উত্তর!');
      if (outputBox) {
        outputBox.innerHTML = `
          <div class="ai-eval-result-card">
            <div class="ai-eval-header">
              <span><i class="fa-solid fa-circle-check"></i> 🤖 Gemini AI Analysis: সঠিক উত্তর!</span>
            </div>
            <p>${aiExplanation}</p>
          </div>
        `;
      }
    } else {
      element.classList.add('wrong');
      if (outputBox) {
        outputBox.innerHTML = `
          <div class="ai-eval-result-card" style="background: var(--danger-light); border-color: var(--danger);">
            <div class="ai-eval-header" style="color: var(--danger);">
              <span><i class="fa-solid fa-triangle-exclamation"></i> 🤖 Gemini AI Error Analysis (ভুল উত্তর বিশ্লেষণ)</span>
            </div>
            <p><strong>আপনি বেছে নিয়েছেন:</strong> "${chosenText}"</p>
            <p><strong>ভুলের কারণ বিশ্লেষণ:</strong> ${aiExplanation}</p>
            <p style="color: var(--primary); font-weight: 800;">💡 পরামর্শ: অধ্যায় ৩ এর "নিউটনের ২য় গতিসূত্র" গাণিতিক টপিকটি রিভিশন দিন।</p>
          </div>
        `;
      }
    }
  };

  function generateAiQuizQuestions() {
    const subjVal = document.getElementById('aiQuizSubject').value;
    const topicVal = document.getElementById('aiQuizTopic').value || 'সাধারণ সিলেবাস';
    const typeVal = document.getElementById('aiQuizType').value;
    const countVal = parseInt(document.getElementById('aiQuizCount').value, 10);

    const container = document.getElementById('practiceContainer');
    if (!container) return;

    if (typeVal === 'flashcards') {
      state.practiceMode = 'flashcard';
      renderPracticeContainer();
      return;
    }

    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 2px dashed var(--primary);">
        <i class="fa-solid fa-wand-magic-sparkles fa-spin text-primary" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.3rem; font-weight: 900;">✨ Gemini AI আপনার জন্য ${countVal}টি কাস্টম কুইজ তৈরি করছে...</h3>
      </div>
    `;

    setTimeout(() => {
      renderDefaultPracticeQuestions(container);
      showXpToast('✨ AI কুইজ সফলভাবে তৈরি হয়েছে!', `${countVal}টি প্রশ্ন প্রস্তুত।`);
    }, 1200);
  }

  // ================= 10. ACHIEVEMENTS, LEADERBOARD & REWARDS SHOP =================
  function initAchievementsAndShop() {
    document.getElementById('lbGlobalTab')?.addEventListener('click', () => {
      state.activeLeaderboard = 'global';
      document.getElementById('lbGlobalTab').classList.add('active');
      document.getElementById('lbSchoolTab').classList.remove('active');
      renderLeaderboards();
    });

    document.getElementById('lbSchoolTab')?.addEventListener('click', () => {
      state.activeLeaderboard = 'school';
      document.getElementById('lbSchoolTab').classList.add('active');
      document.getElementById('lbGlobalTab').classList.remove('active');
      renderLeaderboards();
    });
  }

  function renderAchievementsAndShop() {
    renderLeaderboards();
    renderShopItems();
  }

  function renderLeaderboards() {
    const podiumGrid = document.getElementById('podiumCards');
    if (!podiumGrid) return;

    const list = SASHIBA_DATA.leaderboards[state.activeLeaderboard] || SASHIBA_DATA.leaderboards.global;
    podiumGrid.innerHTML = list.slice(0, 3).map((user, idx) => {
      const crowns = ['gold', 'silver', 'bronze'];
      const bgClasses = ['gold-bg', 'silver-bg', 'bronze-bg'];
      return `
        <div class="podium-card rank-${idx + 1}">
          <div class="podium-crown ${crowns[idx]}"><i class="fa-solid fa-crown"></i></div>
          <img src="${user.avatar}" alt="${user.name}">
          <h4>${user.name}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${user.school}</span>
          <span class="podium-xp">${user.xp} XP</span>
          <span class="podium-badge ${bgClasses[idx]}">${idx + 1}st Place</span>
        </div>
      `;
    }).join('');
  }

  function renderShopItems() {
    const shopGrid = document.getElementById('shopItemsGrid');
    if (!shopGrid) return;

    shopGrid.innerHTML = SASHIBA_DATA.shopItems.map(item => `
      <div class="shop-item-card">
        <div class="s-ic"><i class="fa-solid ${item.icon}"></i></div>
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="shop-cost"><i class="fa-solid fa-coins"></i> ${item.cost} কয়েন</div>
        ${item.unlocked 
          ? `<button class="btn-outline-sm" style="background: var(--success-light); color: var(--success); border-color: var(--success);" disabled><i class="fa-solid fa-check"></i> আনলক করা হয়েছে</button>`
          : `<button class="btn-primary btn-block" onclick="buyShopItem('${item.id}', ${item.cost})"><i class="fa-solid fa-cart-shopping"></i> কিনুন</button>`
        }
      </div>
    `).join('');
  }

  window.buyShopItem = function(itemId, cost) {
    if (state.coins >= cost) {
      state.coins -= cost;
      const item = SASHIBA_DATA.shopItems.find(i => i.id === itemId);
      if (item) item.unlocked = true;
      updateXpDisplay();
      renderShopItems();
      showXpToast('🛍️ রিওয়ার্ড আনলক সফল!', `${item.name} আনলক করা হয়েছে।`);
    } else {
      alert(`দুঃখিত! আপনার পর্যাপ্ত কয়েন নেই। প্রয়োজন: ${cost} কয়েন।`);
    }
  };

  // ================= 11. EXAM PREP =================
  function initExamPrep() {
    renderExamsGrid();
  }

  function renderExamsGrid() {
    const grid = document.getElementById('examsGrid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="exam-card">
        <h4>সাধারণ গণিত SSC পূর্ণাঙ্গ মডেল টেস্ট - ০০১</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">মোট নম্বর: ৫০ | সময়: ৩০ মিনিট</p>
        <button class="btn-primary btn-block" onclick="startExamModal()"><i class="fa-solid fa-pen-to-square"></i> পরীক্ষা শুরু করুন</button>
      </div>
    `;
  }

  window.startExamModal = function() { document.getElementById('examModal')?.classList.add('active'); };
  window.closeModal = function(id) { document.getElementById(id)?.classList.remove('active'); };

  document.getElementById('cancelExamBtn')?.addEventListener('click', () => closeModal('examModal'));
  document.getElementById('submitExamBtn')?.addEventListener('click', () => {
    closeModal('examModal');
    addRewards(50, 30, 'পরীক্ষা জমা দেওয়া সম্পন্ন হয়েছে!');
    document.getElementById('examResultModal')?.classList.add('active');
  });

  // ================= 12. POMODORO & CALENDAR EXPORT =================
  function initPomodoroTimer() {
    const pomoTimerDisplay = document.getElementById('pomoTimer');
    const timerDisplayMini = document.getElementById('timerDisplayMini');

    document.getElementById('pomoStartBtn')?.addEventListener('click', () => {
      if (state.isPomoRunning) {
        clearInterval(state.pomoInterval);
        state.isPomoRunning = false;
        document.getElementById('pomoStartBtn').innerHTML = '<i class="fa-solid fa-play"></i> শুরু করুন';
      } else {
        state.isPomoRunning = true;
        document.getElementById('pomoStartBtn').innerHTML = '<i class="fa-solid fa-pause"></i> বিরতি দিন';
        state.pomoInterval = setInterval(() => {
          if (state.pomoTimeRemaining > 0) {
            state.pomoTimeRemaining--;
            updateTimerDisplay();
          } else {
            clearInterval(state.pomoInterval);
            addRewards(100, 50, 'পমোদোরো সেশন সম্পন্ন!');
          }
        }, 1000);
      }
    });

    function updateTimerDisplay() {
      const mins = Math.floor(state.pomoTimeRemaining / 60).toString().padStart(2, '0');
      const secs = (state.pomoTimeRemaining % 60).toString().padStart(2, '0');
      const str = `${mins}:${secs}`;
      if (pomoTimerDisplay) pomoTimerDisplay.textContent = str;
      if (timerDisplayMini) timerDisplayMini.textContent = str;
    }

    document.getElementById('launchFocusModeBtn')?.addEventListener('click', () => {
      document.getElementById('focusModeOverlay')?.classList.add('active');
    });
    document.getElementById('closeFocusModeBtn')?.addEventListener('click', () => {
      document.getElementById('focusModeOverlay')?.classList.remove('active');
    });
  }

  window.exportStudyScheduleCalendar = function() {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SashiBa LMS//Student Portal Schedule//BN
BEGIN:VEVENT
SUMMARY:SashiBa Study Session - Physics Chapter 3
DESCRIPTION:নিউটনের গতিসূত্র ও গাণিতিক রিভিশন সেশন
DTSTART:20260724T040000Z
DTEND:20260724T050000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SashiBa_Study_Schedule.ics';
    link.click();
    showXpToast('📅 ক্যালেন্ডার সিঙ্ক সফল!', 'Google Calendar-এ যোগ করার ফাইল ডাউনলোড হয়েছে।');
  };

  window.toggleAmbientSound = function(soundType, buttonEl) {
    document.querySelectorAll('.btn-sound-opt').forEach(b => b.classList.remove('active'));
    buttonEl.classList.add('active');
    state.ambientSound = soundType;
    if (soundType !== 'off') {
      showXpToast('🎧 ব্যাকগ্রাউন্ড সাউন্ড সক্রিয়', `${soundType.toUpperCase()} ফোকাস সাউন্ড চলছে...`);
    }
  };

  // ================= 13. AI ASSISTANT =================
  function initAiAssistant() {
    document.getElementById('aiSendBtn')?.addEventListener('click', handleAiQuery);
    document.getElementById('quickAiBtn')?.addEventListener('click', () => {
      const val = document.getElementById('quickAiInput')?.value;
      if (val) {
        switchView('ai-assistant');
        setAiPrompt(val);
      }
    });
  }

  window.setAiPrompt = function(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = text;
      handleAiQuery();
    }
  };

  function handleAiQuery() {
    const input = document.getElementById('aiChatInput');
    const msgBox = document.getElementById('aiChatMessages');
    if (!input || !input.value.trim() || !msgBox) return;

    const userText = input.value.trim();
    msgBox.innerHTML += `
      <div class="chat-msg student-msg">
        <div class="msg-avatar">র</div>
        <div class="msg-body"><p>${userText}</p></div>
      </div>
    `;
    input.value = '';

    setTimeout(() => {
      msgBox.innerHTML += `
        <div class="chat-msg ai-msg">
          <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="msg-body">
            <p><strong>SashiBa AI Tution Result:</strong></p>
            <p>"${userText}" এর উত্তর: নিউটনের দ্বিতীয় গতিসূত্র অনুযায়ী প্রযুক্ত বল $F = m \\times a$। ভরের একক কেজি (kg) ও ত্বরণের একক $m/s^2$ হলে বলের একক নিউটন (N)।</p>
          </div>
        </div>
      `;
      msgBox.scrollTop = msgBox.scrollHeight;
    }, 1000);
  }

  // ================= 14. SETTINGS =================
  function initSettings() {
    document.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.theme = btn.getAttribute('data-theme');
        localStorage.setItem('sashiba_theme', state.theme);
        initTheme();
      });
    });

    document.getElementById('fontIncBtn')?.addEventListener('click', () => {
      state.fontScale += 0.05;
      document.documentElement.style.setProperty('--font-scale', state.fontScale);
      document.getElementById('fontValDisplay').textContent = `${Math.round(state.fontScale * 100)}%`;
    });
    document.getElementById('fontDecBtn')?.addEventListener('click', () => {
      if (state.fontScale > 0.85) {
        state.fontScale -= 0.05;
        document.documentElement.style.setProperty('--font-scale', state.fontScale);
        document.getElementById('fontValDisplay').textContent = `${Math.round(state.fontScale * 100)}%`;
      }
    });
  }

});
