export type HelpArticle = {
  id: string;
  category: string;
  title: string;
  readTime: string;
  steps: { heading?: string; body: string }[];
};

export type FAQItem = {
  q: string;
  a: string;
  category: string;
};

export const HELP_ARTICLES: HelpArticle[] = [
  // ─── Practice & Quizzes ───────────────────────────────────────────────────
  {
    id: "start-practice",
    category: "Practice & Quizzes",
    title: "How to start a practice session",
    readTime: "2 min read",
    steps: [
      { body: "Click Practice in the left sidebar to open the practice hub." },
      { heading: "Choose your exam", body: "Select WAEC, NECO, JAMB UTME, or Post-UTME from the exam type tabs at the top." },
      { heading: "Pick a subject", body: "Browse or search for the subject you want to practice — e.g. Mathematics, English, Biology." },
      { heading: "Set your options", body: "Choose the number of questions (10, 20, 40, or custom) and whether you want a timed or untimed session." },
      { heading: "Start", body: "Click Start Practice. Your session begins immediately — good luck!" },
    ],
  },
  {
    id: "timed-quiz",
    category: "Practice & Quizzes",
    title: "How to take a timed quiz",
    readTime: "2 min read",
    steps: [
      { body: "A countdown timer appears at the top of the screen once your quiz begins." },
      { heading: "Answering questions", body: "Click the option you believe is correct. Your answer is saved automatically — there is no confirm button." },
      { heading: "Flagging for review", body: "Tap the flag icon on any question you want to revisit. Flagged questions are highlighted in the question navigator." },
      { heading: "Navigating questions", body: "Use the Previous / Next buttons or click any number in the navigator panel to jump directly to a question." },
      { heading: "Submitting", body: "Click Submit Quiz when you are done. If you run out of time, the quiz auto-submits and you are taken to the results page." },
    ],
  },
  {
    id: "timer-ran-out",
    category: "Practice & Quizzes",
    title: "What happens if the timer runs out",
    readTime: "1 min read",
    steps: [
      { body: "When the countdown reaches zero, ExamQuest automatically submits your quiz — you don't need to do anything." },
      { heading: "Answered questions", body: "All questions you answered before time ran out are scored normally." },
      { heading: "Unanswered questions", body: "Any question you left blank counts as an incorrect answer in your score." },
      { heading: "Results", body: "You are immediately redirected to the Results page where you can see your score and review every answer." },
      { heading: "Tip", body: "Keep an eye on the timer colour — it turns amber at 5 minutes and red at 2 minutes to warn you." },
    ],
  },
  {
    id: "pause-resume",
    category: "Practice & Quizzes",
    title: "How to pause and resume a quiz",
    readTime: "2 min read",
    steps: [
      { body: "ExamQuest automatically saves your progress every time you answer a question." },
      { heading: "If you close the app", body: "Your quiz is preserved exactly as you left it — your answers, flagged questions, and remaining time are all saved." },
      { heading: "Resuming", body: "Open ExamQuest and go to Practice. You will see a Continue Quiz banner at the top — click it to pick up where you stopped." },
      { heading: "Important", body: "The timer does NOT pause when you close the app. It keeps counting down. If time runs out while you're away, the quiz auto-submits with your answers so far." },
    ],
  },
  {
    id: "review-answers",
    category: "Practice & Quizzes",
    title: "How to review answers after a quiz",
    readTime: "2 min read",
    steps: [
      { body: "After submitting a quiz, you land on the Results page showing your score and a question-by-question breakdown." },
      { heading: "Opening review mode", body: "Click the Review Answers button on the Results page." },
      { heading: "Colour coding", body: "Green highlights show the correct answer. If your selection was wrong, it is shown in red alongside the correct answer in green." },
      { heading: "Explanations", body: "Tap any question card to expand a detailed explanation written by our content team — great for understanding why an answer is correct." },
      { heading: "Navigation", body: "Use the arrow buttons or the mini navigator to move between questions. You can also filter to show only wrong answers." },
    ],
  },
  {
    id: "bookmarks",
    category: "Practice & Quizzes",
    title: "How to bookmark questions",
    readTime: "1 min read",
    steps: [
      { heading: "During a quiz", body: "Tap the bookmark icon (ribbon icon) in the top-right corner of any question card to save it." },
      { heading: "During review", body: "You can also bookmark questions while reviewing your results — same bookmark icon." },
      { heading: "Accessing your bookmarks", body: "Go to Bookmarks in the sidebar. All your saved questions appear here, grouped by subject." },
      { heading: "Practice from bookmarks", body: "Click Practice Bookmarked Questions to start a focused session using only your saved questions — perfect for last-minute revision." },
    ],
  },
  {
    id: "score-not-saved",
    category: "Practice & Quizzes",
    title: "What to do if your score didn't save",
    readTime: "2 min read",
    steps: [
      { heading: "Check your internet connection", body: "ExamQuest needs a stable internet connection to save quiz results. A weak or interrupted connection is the most common cause." },
      { heading: "Check Quiz History", body: "Go to Quiz History in the sidebar. Scroll through the list — the quiz may have saved but not appeared on the results page." },
      { heading: "Refresh and retry", body: "If the quiz is missing, try refreshing the page. Sometimes a brief network hiccup delays saving by a few seconds." },
      { heading: "Contact support", body: "If the score still isn't there, message us on WhatsApp or email support with your name, the subject, and the date and time you took the quiz. We can restore your score manually from our server records." },
    ],
  },
  {
    id: "filter-questions",
    category: "Practice & Quizzes",
    title: "Filtering questions by topic or year",
    readTime: "2 min read",
    steps: [
      { body: "ExamQuest lets you narrow your practice to exactly the questions you need." },
      { heading: "Opening filters", body: "On the Practice page, click the Filter button (funnel icon) next to the subject name." },
      { heading: "Filter by year", body: "Select one or more exam years — e.g. only 2019–2023 WAEC questions." },
      { heading: "Filter by topic", body: "Expand the Topic section and select specific subtopics — e.g. Algebra, Quadratic Equations." },
      { heading: "Filters stack", body: "You can combine filters: e.g. 2022 JAMB Mathematics → Trigonometry gives you a very focused set." },
      { heading: "Resetting", body: "Click Clear Filters to return to the full question bank for that subject." },
    ],
  },

  // ─── Account & Billing ───────────────────────────────────────────────────
  {
    id: "create-account",
    category: "Account & Billing",
    title: "How to create your account",
    readTime: "2 min read",
    steps: [
      { body: "Go to examquest.ng and click Get Started or Sign Up in the top navigation." },
      { heading: "Enter your details", body: "Fill in your full name, email address, and a password of at least 8 characters." },
      { heading: "Verify your email", body: "Check your inbox for a verification email from ExamQuest and click the Confirm Email button. Check your spam folder if it doesn't arrive within 2 minutes." },
      { heading: "Complete onboarding", body: "Choose your target exam, select your school (for Post-UTME), and set your target score. This personalises your practice feed." },
      { body: "That's it — your account is ready. You're on the free plan by default and can upgrade to Premium at any time." },
    ],
  },
  {
    id: "free-vs-premium",
    category: "Account & Billing",
    title: "Free plan vs Premium — what's included",
    readTime: "2 min read",
    steps: [
      { heading: "Free plan includes", body: "50 practice questions per day, past questions from the last 2 exam years, basic score tracking, quiz and study modes, and bookmarks." },
      { heading: "Premium plan includes", body: "Unlimited practice questions, the full question bank (10+ years of past questions), AI-powered explanations, detailed topic-level analytics, leaderboard access, and priority support." },
      { heading: "Both plans include", body: "Access to WAEC, NECO, JAMB UTME, and Post-UTME content, quiz history, performance dashboard, and email/WhatsApp support." },
      { heading: "Which should I choose?", body: "If you're more than 3 months from your exam, the free plan is a great start. If you're in the final stretch, Premium gives you the depth and analytics you need to maximise your score." },
    ],
  },
  {
    id: "upgrade-premium",
    category: "Account & Billing",
    title: "How to upgrade to Premium",
    readTime: "2 min read",
    steps: [
      { body: "You can upgrade from anywhere in the app — look for the Upgrade button or go to Settings → Billing." },
      { heading: "Choose a plan", body: "Monthly (₦1,500/month) or Annual (₦12,000/year — you save 33% compared to monthly)." },
      { heading: "Pay", body: "Choose your payment method: debit/credit card, bank transfer, or USSD. All payments are processed securely by Paystack." },
      { heading: "Instant activation", body: "Your account upgrades to Premium immediately after payment is confirmed — no waiting." },
      { heading: "Receipt", body: "A payment receipt is sent to your registered email address automatically." },
    ],
  },
  {
    id: "payment-methods",
    category: "Account & Billing",
    title: "Payment methods we accept",
    readTime: "1 min read",
    steps: [
      { heading: "Debit / Credit cards", body: "Visa, Mastercard, and Verve cards are all accepted. Your card details are never stored on ExamQuest — they are handled entirely by Paystack." },
      { heading: "Bank transfer", body: "At checkout, select Bank Transfer and we'll display a dedicated account number. Transfer the exact amount and your upgrade is confirmed automatically once the bank posts the payment (usually within minutes)." },
      { heading: "USSD", body: "No internet needed for payment. Select USSD at checkout, choose your bank, and dial the code shown on your phone to complete the payment." },
      { heading: "Security", body: "All transactions are secured by Paystack, a PCI-DSS compliant payment processor trusted by thousands of Nigerian businesses." },
    ],
  },
  {
    id: "cancel-subscription",
    category: "Account & Billing",
    title: "How to cancel your subscription",
    readTime: "1 min read",
    steps: [
      { body: "Go to Settings → Billing → Cancel Subscription." },
      { heading: "What happens next", body: "Your Premium access continues until the end of your current billing period. You will not be charged again after that." },
      { heading: "Your data is safe", body: "Cancelling does not delete your account, quiz history, bookmarks, or analytics. Everything is preserved — you just revert to the free plan limits." },
      { heading: "Reactivating", body: "You can upgrade again at any time from Settings → Billing. Your past data will still be there." },
      { heading: "Need help?", body: "If you're cancelling due to a problem, please contact our support team first — we may be able to help resolve the issue." },
    ],
  },
  {
    id: "reset-password",
    category: "Account & Billing",
    title: "How to reset your password",
    readTime: "1 min read",
    steps: [
      { body: "On the login page, click Forgot Password below the sign-in button." },
      { heading: "Enter your email", body: "Type the email address you used to register and click Send Reset Link." },
      { heading: "Check your inbox", body: "You'll receive an email from ExamQuest with a Reset Password button. Also check your spam or junk folder if it doesn't arrive within 2 minutes." },
      { heading: "Set a new password", body: "Click the link in the email and enter a new password. It must be at least 8 characters." },
      { heading: "Link expiry", body: "The reset link expires after 1 hour. If it has expired, simply go back to Forgot Password and request a new one." },
    ],
  },

  // ─── Analytics ───────────────────────────────────────────────────────────
  {
    id: "performance-dashboard",
    category: "Analytics",
    title: "Understanding your performance dashboard",
    readTime: "2 min read",
    steps: [
      { body: "Go to Analytics in the sidebar to open your personal performance dashboard." },
      { heading: "Exam readiness score", body: "Your overall readiness score (0–100%) is calculated from your last 10 quizzes, with more recent quizzes weighted more heavily." },
      { heading: "30-day trend chart", body: "The line chart shows how your average score has moved over the past 30 days. A rising line means you are improving; a flat or falling line is a signal to change your study approach." },
      { heading: "National comparison", body: "A benchmark bar compares your score to the national average for students preparing for the same exam. Use it to gauge where you stand." },
      { heading: "Total activity", body: "Cards at the top show total questions attempted, total quizzes completed, and your current study streak in days." },
    ],
  },
  {
    id: "track-by-subject",
    category: "Analytics",
    title: "Tracking progress by subject",
    readTime: "2 min read",
    steps: [
      { body: "Scroll down on the Analytics page to the Subject Breakdown section." },
      { heading: "Subject cards", body: "Each subject shows your average score, total questions attempted, and a trend arrow (up, down, or flat) based on your last 5 sessions." },
      { heading: "Colour coding", body: "Red = needs urgent attention (below 50%), Amber = improving (50–70%), Green = strong performance (above 70%)." },
      { heading: "Drill down", body: "Click any subject card to see a topic-by-topic breakdown within that subject — great for pinpointing exactly which chapters are dragging your score down." },
      { heading: "Tip", body: "Sort subjects by Lowest Score to quickly identify your highest-priority revision areas." },
    ],
  },
  {
    id: "strengths-weaknesses",
    category: "Analytics",
    title: "Reading your strengths and weaknesses report",
    readTime: "2 min read",
    steps: [
      { body: "Go to Analytics → Strengths & Weaknesses to see your personalised topic report." },
      { heading: "Strengths", body: "Your top 3 performing topics are listed in green. These are areas where you're already scoring above 75% — keep maintaining them with occasional revision." },
      { heading: "Weaknesses", body: "Your 3 weakest topics are highlighted in red. Focusing your practice here will produce the biggest jump in your overall exam score." },
      { heading: "How it updates", body: "The report updates automatically after every quiz you complete. The more you practice, the more accurate it becomes." },
      { heading: "Action step", body: "Click the Practice This Topic button next to any weak topic to immediately start a targeted practice session on it." },
    ],
  },
  {
    id: "improve-with-analytics",
    category: "Analytics",
    title: "Using analytics to improve your exam score",
    readTime: "3 min read",
    steps: [
      { heading: "Start with your weaknesses", body: "Open Strengths & Weaknesses and pick your single weakest topic. Practice it every day until it turns green — usually 3–5 sessions." },
      { heading: "Watch your trend", body: "Check your 30-day trend chart weekly. If your score hasn't improved in 2 weeks despite practising, you may need a different study resource alongside ExamQuest." },
      { heading: "Target the right years", body: "Use your Analytics to see which exam years have the most questions you got wrong, then filter your practice sessions to those years." },
      { heading: "Set a weekly goal", body: "Aim for a minimum of 100 questions per week. Students who hit this target consistently improve their readiness score by an average of 8–12 points per month." },
      { heading: "Share with a teacher", body: "Screenshot your Analytics page and share it with your teacher or tutor. They can use it to guide your sessions and spot patterns you might miss." },
    ],
  },

  // ─── Profile & Settings ───────────────────────────────────────────────────
  {
    id: "update-profile",
    category: "Profile & Settings",
    title: "How to update your profile",
    readTime: "1 min read",
    steps: [
      { body: "Click Profile in the sidebar or tap your avatar at the top of the screen." },
      { heading: "Edit your details", body: "Click the Edit Profile button to update your display name, profile photo, phone number, or bio." },
      { heading: "Profile photo", body: "Click your current photo or avatar and select a new image from your device. Photos are resized automatically." },
      { heading: "Save", body: "Click Save Changes when done. Your profile updates immediately across the app." },
    ],
  },
  {
    id: "change-exam",
    category: "Profile & Settings",
    title: "Changing your target exam",
    readTime: "1 min read",
    steps: [
      { body: "Go to Settings → Exam Preferences." },
      { heading: "Select your exam(s)", body: "Choose one or more exams: WAEC, NECO, JAMB UTME, or Post-UTME. You can select multiple if you're preparing for more than one." },
      { heading: "What changes", body: "Your practice feed, question recommendations, and analytics benchmarks all update to match your selected exams." },
      { body: "Changes take effect immediately — no page refresh needed." },
    ],
  },
  {
    id: "change-school",
    category: "Profile & Settings",
    title: "Changing your school for Post-UTME",
    readTime: "1 min read",
    steps: [
      { body: "Go to Settings → Exam Preferences → Post-UTME School." },
      { heading: "Search for your school", body: "Type your school's full name or abbreviation in the search box — e.g. 'UNILAG' or 'University of Lagos'." },
      { heading: "Select your school", body: "Click your school from the dropdown list. The practice feed updates to include that school's Post-UTME past questions." },
      { heading: "School not listed?", body: "If you can't find your school, contact us via WhatsApp or email. We add new schools within 48 hours of a request." },
    ],
  },
  {
    id: "notifications",
    category: "Profile & Settings",
    title: "Managing notification preferences",
    readTime: "1 min read",
    steps: [
      { body: "Go to Settings → Notifications to control what ExamQuest sends you." },
      { heading: "Available notifications", body: "Daily practice reminders, weekly performance report emails, new question alerts when we add content for your exam, and streak reminders if you're at risk of losing your streak." },
      { heading: "Setting reminder time", body: "For daily reminders, tap the time picker to choose when you'd like to be reminded (default is 7:00 PM)." },
      { heading: "Browser notifications", body: "You may need to allow browser notifications the first time. A browser prompt will appear — click Allow to enable them on desktop." },
    ],
  },
  {
    id: "delete-account",
    category: "Profile & Settings",
    title: "How to delete your account",
    readTime: "2 min read",
    steps: [
      { body: "Account deletion is permanent and cannot be undone. Please read this carefully before proceeding." },
      { heading: "Before you delete", body: "Consider contacting our support team first. If you're having a problem, we may be able to fix it. If you're leaving because of cost, you can downgrade to the free plan instead." },
      { heading: "How to delete", body: "Go to Settings → Account → Delete Account." },
      { heading: "Confirmation", body: "Read the warning message. Type your email address into the confirmation field and click Delete My Account." },
      { heading: "What gets erased", body: "Your profile, quiz history, bookmarks, analytics data, and subscription are permanently deleted. This action cannot be reversed." },
    ],
  },
];

export const EXPANDED_FAQ: FAQItem[] = [
  // General
  {
    q: "Is ExamQuest free to use?",
    a: "Yes! ExamQuest has a free tier with 50 questions per day, basic analytics, and the last 2 years of past questions. Premium (₦1,500/month or ₦12,000/year) unlocks unlimited practice, the full question bank, AI explanations, and detailed analytics.",
    category: "Account & Billing",
  },
  {
    q: "Which exams does ExamQuest cover?",
    a: "We cover WAEC, NECO, JAMB UTME, Post-UTME, and University-level courses across all major Nigerian universities.",
    category: "Practice & Quizzes",
  },
  {
    q: "How up-to-date are the questions?",
    a: "Our question bank is updated after every exam season with the latest past questions. We also add new likely questions reviewed by experienced Nigerian teachers.",
    category: "Practice & Quizzes",
  },
  {
    q: "Can I use ExamQuest offline?",
    a: "Not yet — ExamQuest requires an internet connection to load questions and save your results. Offline mode is on our roadmap for a future update.",
    category: "Practice & Quizzes",
  },
  {
    q: "How is my score calculated?",
    a: "Your score is the percentage of correct answers out of total questions. In timed quiz mode, unanswered questions count as incorrect. In study mode, you can retry questions without it affecting your recorded score.",
    category: "Practice & Quizzes",
  },
  {
    q: "Which universities are supported for Post-UTME?",
    a: "We currently support 50+ universities including UNILAG, UI, OAU, UNN, ABU, UNIBEN, FUTA, and Covenant University. We add new schools every month — contact us if yours isn't listed yet.",
    category: "Practice & Quizzes",
  },
  {
    q: "My score didn't save after I finished a quiz. What do I do?",
    a: "First, check your internet connection — scores require a stable connection to save. Then go to Quiz History in the sidebar to see if it was recorded. If it's still missing, contact us on WhatsApp or email with the subject, date, and approximate time of the quiz and we'll restore it manually.",
    category: "Practice & Quizzes",
  },
  {
    q: "The timer ran out before I could finish. Did my answers save?",
    a: "Yes — when the timer hits zero, your quiz auto-submits and all the answers you gave are saved and scored. Only questions you left blank are marked as incorrect.",
    category: "Practice & Quizzes",
  },
  {
    q: "Can I pause a quiz and come back to it?",
    a: "Your progress is saved automatically, so you can close the app and resume later via the Continue Quiz banner on the Practice page. However, the timer keeps running while you're away — it does not pause.",
    category: "Practice & Quizzes",
  },
  {
    q: "How do I know which topics to focus on for JAMB?",
    a: "Go to Analytics → Strengths & Weaknesses. Your 3 weakest topics are highlighted in red. Click Practice This Topic next to any of them to start a targeted session immediately.",
    category: "Analytics",
  },
  {
    q: "How many questions are in the question bank?",
    a: "The ExamQuest question bank currently contains over 50,000 past questions and practice questions spanning 10+ years across WAEC, NECO, JAMB, and Post-UTME. We add hundreds of new questions every month.",
    category: "Practice & Quizzes",
  },
  {
    q: "Is there an app I can download?",
    a: "A dedicated Android app is coming soon. For now, ExamQuest works as a mobile-friendly web app — open it in your phone's browser and it works just like an app. You can also add it to your home screen for quick access.",
    category: "Profile & Settings",
  },
  {
    q: "Can I use ExamQuest on my phone?",
    a: "Yes — ExamQuest is fully optimised for mobile browsers. Open it in Chrome or Safari on your Android or iPhone and it works seamlessly. A dedicated app is on the way.",
    category: "Profile & Settings",
  },
  {
    q: "How do I change my exam type after signing up?",
    a: "Go to Settings → Exam Preferences and update your selection. You can choose multiple exams at once — for example WAEC and JAMB if you're preparing for both.",
    category: "Profile & Settings",
  },
  {
    q: "My school isn't listed for Post-UTME. What do I do?",
    a: "Contact us on WhatsApp or send an email to supportexamquest@gmail.com with your school's full name and abbreviation. We add new schools within 48 hours of a verified request.",
    category: "Practice & Quizzes",
  },
  {
    q: "Does ExamQuest have NECO past questions?",
    a: "Yes — NECO past questions are available for all core subjects including Mathematics, English Language, Biology, Chemistry, Physics, Economics, and more.",
    category: "Practice & Quizzes",
  },
  {
    q: "Can I share my progress with my teacher or parent?",
    a: "Yes — on your Analytics page, click the Share button to generate a shareable link or screenshot of your performance report. You can send it to anyone via WhatsApp, email, or any messaging app.",
    category: "Analytics",
  },
  {
    q: "What is the leaderboard?",
    a: "The leaderboard ranks students by their average score over the past 7 days. It's a fun way to stay motivated and see how you compare to other students preparing for the same exam. Leaderboard access is a Premium feature.",
    category: "Analytics",
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: "On the login page, click Forgot Password, enter your email address, and click Send Reset Link. Check your inbox (and spam folder) for an email from ExamQuest. The reset link expires after 1 hour.",
    category: "Account & Billing",
  },
  {
    q: "How do I contact support?",
    a: "You can reach us on WhatsApp at +234 808 115 9617 (Mon–Fri, 9am–6pm WAT, typically replies within 2 hours) or by email at supportexamquest@gmail.com. We aim to respond to emails within 24 hours.",
    category: "Account & Billing",
  },
  {
    q: "Can I use ExamQuest for university-level courses?",
    a: "Yes — we are building out a university course library. Currently available subjects include 100-level and 200-level courses for Engineering, Sciences, and Social Sciences at select universities. More courses are added monthly.",
    category: "Practice & Quizzes",
  },
];
