/* ==========================================================================
   SashiBa Ed-Tech SaaS / LMS Central Data Store (data.js)
   Centralized datasets for subjects, chapter outlines, flashcards, shop, & leaderboards
   ========================================================================== */

const SASHIBA_DATA = {
  
  // 1. SUBJECT CATALOG WITH FULL CHAPTER OUTLINES
  subjectCatalog: {
    ssc: [
      {
        id: 'physics',
        name: 'পদার্থবিজ্ঞান',
        code: '১৭৪',
        category: 'science',
        progress: 75,
        icon: 'fa-atom',
        color: '#4f46e5',
        description: 'পদার্থের গুণাবলি, বলবিদ্যা, তরঙ্গ, আলোকবিজ্ঞান ও আধুনিক পদার্থবিজ্ঞান।',
        chapters: [
          {
            id: 1,
            title: 'অধ্যায় ১: ভৌত রাশি ও পরিমাপ',
            desc: 'ভৌত রাশির প্রকারভেদ, পরিমাপের একক, পরিমাপের যন্ত্রপাতি ও ত্রুটি।',
            duration: '৪৫ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 100,
            completed: true,
            topics: ['ভৌত রাশি ও পরিমাপের স্কেল', 'ভার্নিয়ার স্কেল ও স্কু-গজ', 'পরিমাপের ত্রুটি ও সূক্ষ্মতা']
          },
          {
            id: 2,
            title: 'অধ্যায় ২: গতি (Motion)',
            desc: 'গতিবিদ্যা, সমরেখ গতি, গতির সমীকরণমালা ও লেখচিত্র।',
            duration: '৬০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 100,
            completed: true,
            topics: ['দূরত্ব, সরণ ও বেগ', 'ত্বরণ ও মন্দন', 'গতির সমীকরণ ($v = u + at$)', 'পরন্ত বস্তুর সূত্র']
          },
          {
            id: 3,
            title: 'অধ্যায় ৩: বল (Force)',
            desc: 'নিউটনের গতিসূত্র, জড়তা, ভরবেগ, ঘর্ষণ বল ও মহাকর্ষ বল।',
            duration: '৫৫ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 80,
            completed: false,
            topics: ['নিউটনের ১ম ও ২য় গতিসূত্র ($F = ma$)', 'ভরবেগের সংরক্ষণ সূত্র', 'ঘর্ষণ বল ও গুণাঙ্ক', 'নিউটনের ৩য় গতিসূত্র']
          },
          {
            id: 4,
            title: 'অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি',
            desc: 'কাজের পরিমাপ, গতিশক্তি, বিভবশক্তি ও শক্তির সংরক্ষণশীলতা নীতি।',
            duration: '৫০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 40,
            completed: false,
            topics: ['কাজের সংজ্ঞা ও পরিমাপ', 'গতিশক্তি ($E_k = \\frac{1}{2}mv^2$)', 'বিভবশক্তি ও ক্ষমতা']
          },
          {
            id: 5,
            title: 'অধ্যায় ৫: পদার্থের অবস্থা ও চাপ',
            desc: 'চাপ, ঘনত্ব, আর্কিমিডিসের নীতি, প্লবতা ও প্যাস্কালের সূত্র।',
            duration: '৬৫ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 0,
            completed: false,
            topics: ['চাপ ও ঘনত্ব ($P = h\\rho g$)', 'আর্কিমিডিসের নীতি ও প্লবতা', 'প্যাস্কালের পাত্র ও বল বৃদ্ধিকরণ নীতি']
          }
        ]
      },
      {
        id: 'hmath',
        name: 'উচ্চতর গণিত',
        code: '১২৬',
        category: 'science',
        progress: 90,
        icon: 'fa-calculator',
        color: '#7c3aed',
        description: 'সেট ও ফাংশন, বীজগণিতীয় রাশি, জ্যামিতি, ত্রিকোণমিতি ও সম্ভাবনা।',
        chapters: [
          {
            id: 1,
            title: 'অধ্যায় ১: সেট ও ফাংশন',
            desc: 'সসীম ও অসীম সেট, ভেনচিত্র, ডোমেন ও রেঞ্জ।',
            duration: '৫০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 100,
            completed: true,
            topics: ['ভেনচিত্র ও সেটের উপাদান', 'ফাংশনের ডোমেন ও রেঞ্জ নির্ণয়', 'এক-এক ও অনটু ফাংশন']
          },
          {
            id: 7,
            title: 'অধ্যায় ৭: ত্রিকোণমিতি (Trigonometry)',
            desc: 'রেডিয়ান পরিমাপ, ত্রিকোণমিতিক অনুপাত ও অভেদাবলী।',
            duration: '৭০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 85,
            completed: false,
            topics: ['ষাটমূলক ও বৃত্তীয় কোণ', 'ত্রিকোণমিতিক অনুপাতের মান নির্ণয়', 'বৃত্তচাপের দৈর্ঘ্য ($s = r\\theta$)']
          }
        ]
      },
      {
        id: 'chemistry',
        name: 'রসায়ন',
        code: '১৭৬',
        category: 'science',
        progress: 60,
        icon: 'fa-flask',
        color: '#059669',
        description: 'পদার্থের গঠন, পর্যায় সারণি, রাসায়নিক বন্ধন ও দ্রবণ।',
        chapters: [
          {
            id: 1,
            title: 'অধ্যায় ১: রসায়নের ধারণা',
            desc: 'রসায়নের পরিধি, পরীক্ষাগারে নিরাপত্তা ও রাসায়নিক দ্রব্যাদি।',
            duration: '৩৫ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 100,
            completed: true,
            topics: ['রসায়নের ইতিহাস ও পরিধি', 'রাসায়নিক দ্রব্যের ঝুঁকির মাত্রা ও প্রতীক']
          },
          {
            id: 4,
            title: 'অধ্যায় ৪: পর্যায় সারণি (Periodic Table)',
            desc: 'পর্যায় সারণির বৈশিষ্ট্য, ইলেকট্রন বিন্যাস ও পর্যায়বৃত্ত ধর্ম।',
            duration: '৬০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 60,
            completed: false,
            topics: ['ইলেকট্রন বিন্যাস থেকে পর্যায় ও গ্রুপ নির্ণয়', 'আয়নীকরণ শক্তি ও ইলেকট্রন আসক্তি', 'ধাতব ও অধাতব ধর্ম']
          }
        ]
      },
      {
        id: 'biology',
        name: 'জীববিজ্ঞান',
        code: '১৭৮',
        category: 'science',
        progress: 45,
        icon: 'fa-dna',
        color: '#d97706',
        description: 'জীবকোষ, টিস্যু, জীবনীশক্তি, উদ্ভিদের খাদ্য ও পরিপাক।',
        chapters: [
          {
            id: 5,
            title: 'অধ্যায় ৫: খাদ্য, পুষ্টি ও পরিপাক',
            desc: 'খাদ্যের উপাদান, ভিটামিন, পরিপাকতন্ত্র ও পৌষ্টিকনালী।',
            duration: '৫৫ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 45,
            completed: false,
            topics: ['শর্করা, আমিষ ও স্নেহ পদার্থের পরিপাক', 'পরিপাক গ্রন্থি ও এনজাইমের কাজ', 'BMI ও BMR নির্ণয়']
          }
        ]
      },
      {
        id: 'ict',
        name: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        code: '১৫৪',
        category: 'general',
        progress: 95,
        icon: 'fa-laptop-code',
        color: '#0891b2',
        description: 'তথ্য প্রযুক্তি, ডাটাবেস, HTML ওয়েব ডিজাইন ও সি পোগ্রামিং।',
        chapters: [
          {
            id: 3,
            title: 'অধ্যায় ৩: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
            desc: 'বাইনারি, অকটাল, হেক্সাডেসিমেল ও লজিক গেট।',
            duration: '৫০ মিনিট',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            progress: 95,
            completed: true,
            topics: ['সংখ্যা পদ্ধতির রূপান্তর', 'AND, OR, NOT গেট', 'ডি-মরগানের উপপাদ্য']
          }
        ]
      }
    ]
  },

  // 2. AI FLASHCARD DECKS (FOR INTERACTIVE STUDY REVISION)
  flashcards: {
    physics: [
      {
        id: 1,
        term: 'নিউটনের ২য় গতিসূত্র ($F = ma$)',
        definition: 'বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকে ঘটে।',
        formula: 'F = m \\times a',
        category: 'গতিবিদ্যা'
      },
      {
        id: 2,
        term: 'ভরবেগের সংরক্ষণ সূত্র',
        definition: 'কোনো ব্যবস্থার ওপর বাইরে থেকে কোনো বল প্রয়োগ না করলে ব্যবস্থাটির মোট ভরবেগ অপরিবর্তিত বা সংরক্ষিত থাকে।',
        formula: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2',
        category: 'বলবিদ্যা'
      },
      {
        id: 3,
        term: 'স্থিতি ঘর্ষণ ও চল ঘর্ষণ',
        definition: 'একটি বস্তু অপর বস্তুর ওপর গতিশীল হওয়ার চেষ্টা করলে যে বাধা তৈরি হয় তা স্থিতি ঘর্ষণ, আর গতিশীল অবস্থায় বাধাটি চল ঘর্ষণ।',
        formula: 'F_f = \\mu R',
        category: 'ঘর্ষণ'
      }
    ],
    chemistry: [
      {
        id: 1,
        term: 'আয়নীকরণ শক্তি (Ionization Energy)',
        definition: 'গ্যাসীয় অবস্থায় ১ মোল পরমাণু থেকে ১ মোল ইলেকট্রন অপসারণ করে ক্যাটায়নে পরিণত করতে যে পরিমাণ শক্তির প্রয়োজন হয়।',
        formula: 'পর্যায়ে বাম থেকে ডানে বাড়ে',
        category: 'পর্যায় সারণি'
      },
      {
        id: 2,
        term: 'জারণ-বিজারণ (Redox Reaction)',
        definition: 'যে রাসায়নিক বিক্রিয়ায় ইলেকট্রন বর্জন ঘটে তাকে জারণ এবং যে বিক্রিয়ায় ইলেকট্রন গ্রহণ ঘটে তাকে বিজারণ বলে।',
        formula: 'Oil Rig (Oxidation Is Loss, Reduction Is Gain)',
        category: 'রাসায়নিক বিক্রিয়া'
      }
    ]
  },

  // 3. VIRTUAL REWARDS SHOP CATALOG
  shopItems: [
    {
      id: 'theme_cyber_dark',
      name: 'Cyber Dark OLED Theme',
      type: 'theme',
      cost: 500,
      icon: 'fa-moon',
      desc: 'চোখের সুরক্ষায় রাতকালীন পড়াশোনার জন্য স্পেশাল ওলেড ডার্ক কালার থিম।',
      unlocked: true
    },
    {
      id: 'theme_sepia_reader',
      name: 'Warm Eye-Care Sepia Mode',
      type: 'theme',
      cost: 350,
      icon: 'fa-book-open-reader',
      desc: 'বইয়ের মতো উষ্ণ কাগজের কালার যা দীর্ঘ সময় পড়লেও চোখে ক্লান্তি আনে না।',
      unlocked: true
    },
    {
      id: 'badge_vip_ai',
      name: 'VIP AI Tutor Access',
      type: 'vip',
      cost: 800,
      icon: 'fa-robot',
      desc: '২৪/৭ আনলিমিটেড AI অঙ্ক সমাধান ও তাৎক্ষণিক গাণিতিক ব্যাখ্যা আনলক করুন।',
      unlocked: false
    },
    {
      id: 'frame_gold_crown',
      name: 'Gold Crown Avatar Frame',
      type: 'avatar',
      cost: 600,
      icon: 'fa-crown',
      desc: 'লিডারবোর্ড ও প্রোফাইলে ব্যবহারের জন্য শাইনিং গোল্ড ক্রাউন ফ্রেম।',
      unlocked: false
    }
  ],

  // 4. LEADERBOARD DATASETS (GLOBAL VS SCHOOL FRIENDS)
  leaderboards: {
    global: [
      { rank: 1, name: 'সাদিয়া সুলতানা', school: 'ভিকারুননিসা নূন স্কুল', xp: 3200, coins: 1800, isUser: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
      { rank: 2, name: 'রাহাত খান (আপনি)', school: 'ঢাকা রেসিডেনশিয়াল মডেল কলেজ', xp: 2450, coins: 1250, isUser: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { rank: 3, name: 'আরিফ আহমেদ', school: 'নটর ডেম কলেজ', xp: 2100, coins: 950, isUser: false, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
      { rank: 4, name: 'তানজিনা আক্তার', school: 'আইডিয়াল স্কুল অ্যান্ড কলেজ', xp: 1950, coins: 880, isUser: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      { rank: 5, name: 'মেহেদী হাসান', school: 'রাজউক উত্তরা মডেল কলেজ', xp: 1800, coins: 790, isUser: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ],
    school: [
      { rank: 1, name: 'রাহাত খান (আপনি)', school: 'ঢাকা রেসিডেনশিয়াল মডেল কলেজ (১০ম বিজ্ঞান)', xp: 2450, coins: 1250, isUser: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { rank: 2, name: 'মাহিন চৌধুরী', school: 'ঢাকা রেসিডেনশিয়াল মডেল কলেজ (রোল ১০২)', xp: 2310, coins: 1100, isUser: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { rank: 3, name: 'সাকিব রহমান', school: 'ঢাকা রেসিডেনশিয়াল মডেল কলেজ (রোল ১০৫)', xp: 1890, coins: 820, isUser: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' }
    ]
  }
};
