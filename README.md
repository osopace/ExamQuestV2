# ExamQuest — Product Documentation

> Nigeria's #1 exam preparation platform. Built with Next.js 14, Supabase, TypeScript, and Tailwind CSS.

---

## Table of Contents

1. [Overview](#1-what-is-examquest)
2. [Technology Stack](#2-tech-stack)
3. [Installation & Setup](#3-getting-started)
4. [Project Architecture](#4-project-folder-structure)
5. [File Reference](#5-every-file-explained)
6. [Module Reference](#6-every-page-explained)
7. [System Data Flow](#7-how-data-flows)
8. [Design Specification](#8-the-design-system)
9. [Core Concepts](#9-key-concepts-for-beginners)
10. [Extensibility Guide](#10-how-to-extend-the-app)
11. [Support & Troubleshooting](#11-troubleshooting)

---

## 1. Overview

ExamQuest is a **full-stack web application** that helps Nigerian students prepare for:

- **WAEC / NECO** — West African high school exams
- **JAMB UTME** — University entrance exam
- **Post-UTME** — University screening tests
- **University exams** — Semester and end-of-year exams

### What students can do on ExamQuest:

| Feature            | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| Practice Quizzes   | Answer timed multiple-choice questions in simulated exam mode         |
| Study Mode         | Interactive learning with instant feedback and AI-guided explanations |
| Advanced Analytics | Data-rich visualizations for score tracking and topic mastery         |
| Question Bookmarks | Save complex questions for future review                              |
| Global Leaderboard | Performance-based rankings across the student community               |
| Study Streaks      | Gamified consistency tracking to improve retention                    |
| Profile Management | Personalized exam preferences and academic settings                   |

---

## 2. Tech Stack

These are the tools used to build ExamQuest and what each one does:

### Next.js 14 (App Router)

**What it is:** The main framework the app is built with. Next.js is built on top of React and adds features like file-based routing, server-side rendering, and more.

**What it does in ExamQuest:** Every page you see (`/dashboard`, `/practice`, `/login`, etc.) is a file inside the `app/` folder. Next.js reads those files and turns them into web pages automatically.

**Think of it like:** The engine of the car — everything else plugs into it.

---

### TypeScript

**What it is:** A version of JavaScript that adds "types" — rules about what kind of data a variable can hold.

**What it does in ExamQuest:** Prevents bugs. For example, TypeScript makes sure that a `score` is always a number, never accidentally a text string. All files end in `.ts` or `.tsx` instead of `.js` or `.jsx`.

**Think of it like:** Spell-check for your code.

---

### Tailwind CSS

**What it is:** A CSS framework that lets you style things using short class names directly in your HTML/JSX.

**What it does in ExamQuest:** All the colours, spacing, rounded corners, shadows, and layouts are done with Tailwind classes like `bg-primary-600`, `rounded-2xl`, `flex`, `gap-4`, etc.

**Think of it like:** Instead of writing a separate CSS file, you style things inline using pre-made class names.

**Example:**

```jsx
// Without Tailwind (traditional CSS)
<div class="my-card">Hello</div>
/* then in a CSS file: .my-card { background: white; padding: 24px; border-radius: 16px; } */

// With Tailwind
<div className="bg-white p-6 rounded-2xl">Hello</div>
```

---

### Supabase

**What it is:** The back-end service that stores all the data (users, quizzes, scores, bookmarks, etc.) and handles login/signup.

**What it does in ExamQuest:** When a user signs up, Supabase saves their account. When they complete a quiz, Supabase saves their score. When they log back in later, Supabase retrieves everything.

**Think of it like:** The filing cabinet at the back of the app that remembers everything.

> 📖 See `SUPABASE_README.md` for the full Supabase setup guide.

---

### Zustand

**What it is:** A small, simple library for managing "state" — the data your app holds in memory while it's running.

**What it does in ExamQuest:** Stores things like "which user is logged in" and "what quiz is currently happening" so that every page in the app can access that information without having to pass it around manually.

**Think of it like:** A shared whiteboard that all pages of the app can read and write to.

---

### Recharts

**What it is:** A library for drawing charts and graphs using React.

**What it does in ExamQuest:** Draws the "Score Over Time" line chart and the "Accuracy by Topic" bar chart on the Analytics page.

---

### React Hot Toast

**What it is:** A library that shows small notification popups ("toasts") that appear at the top-right corner.

**What it does in ExamQuest:** Shows messages like "Quiz saved!", "Profile updated!", or "Invalid password" as small pop-up notifications.

---

### Lucide React

**What it is:** A library of clean, consistent icons.

**What it does in ExamQuest:** Every icon you see (the BarChart icon, the BookOpen icon, the Trophy icon, etc.) comes from Lucide.

---

## 3. Getting Started

### Requirements

Before running this app, make sure you have:

- **Node.js** version 18 or higher — download at [nodejs.org](https://nodejs.org)
- **A Supabase account** — free at [supabase.com](https://supabase.com)
- A code editor like **VS Code**

---

### Step-by-Step Setup

**Step 1 — Unzip and open the project**

```bash
unzip examquest.zip
cd examquest
code .   # opens VS Code (optional)
```

**Step 2 — Install all the libraries**

```bash
npm install
```

This reads `package.json` and downloads all the tools the app needs. It creates a `node_modules/` folder. This takes 1-3 minutes.

**Step 3 — Set up your Supabase project**

Follow the full guide in `SUPABASE_README.md`. In short:

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Run the SQL schema from `SUPABASE_README.md` in the Supabase SQL Editor
3. Run the RLS policies SQL from `SUPABASE_README.md`
4. Copy your Project URL and anon key

**Step 4 — Create your environment file**

```bash
# Create a new file called .env.local
# (this is different from .env.example — .env.local is the real one)
```

Inside `.env.local`, paste:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your real Supabase credentials.

**Step 5 — Start the development server**

```bash
npm run dev
```

Open your browser and go to **http://localhost:3000**

---

### Available Commands

| Command         | What it does                                                   |
| --------------- | -------------------------------------------------------------- |
| `npm run dev`   | Starts the app in development mode (auto-refreshes on changes) |
| `npm run build` | Builds the app for production (makes it faster)                |
| `npm start`     | Runs the production build                                      |
| `npm run lint`  | Checks for code quality issues                                 |

---

## 4. Project Folder Structure

```
examquest/
│
├── 📄 README.md                  all← You are here
├── 📄 SUPABASE_README.md         ← Supabase setup guide
├── 📄 package.json               ← Lists  the libraries the app needs
├── 📄 tsconfig.json              ← TypeScript configuration
├── 📄 tailwind.config.ts         ← Tailwind CSS colours and settings
├── 📄 next.config.js             ← Next.js configuration
├── 📄 postcss.config.js          ← Processes CSS (needed for Tailwind)
├── 📄 .env.example               ← Template for your secret keys
├── 📄 .gitignore                 ← Files Git should NOT track
│
├── 📁 supabase/                  ← Everything that talks to Supabase
│   ├── client.ts                 ← Creates the Supabase connection
│   ├── auth.ts                   ← Login, signup, logout functions
│   └── db.ts                     ← Read/write functions for the database
│
├── 📁 types/
│   └── index.ts                  ← Shared TypeScript types (shapes of data)
│
├── 📁 utils/
│   ├── cn.ts                     ← Helper to combine CSS class names
│   └── format.ts                 ← Helper functions (format dates, scores, etc.)
│
├── 📁 constants/
│   └── mockData.ts               ← Sample data for testing the UI
│
├── 📁 store/                     ← Zustand global state stores
│   ├── authStore.ts              ← Stores the logged-in user's data
│   ├── quizStore.ts              ← Stores the active quiz state
│   └── uiStore.ts                ← Stores sidebar open/close, modal state
│
├── 📁 hooks/
│   └── useAuth.ts                ← Listens for login/logout events
│
├── 📁 components/
│   ├── 📁 ui/                    ← Reusable building blocks
│   │   ├── Button.tsx            ← Button component
│   │   ├── Input.tsx             ← Text input component
│   │   └── index.tsx             ← Card, Badge, Avatar, Modal, etc.
│   └── 📁 shared/               ← Layout components used across pages
│       ├── Navbar.tsx            ← Top navigation for marketing pages
│       ├── Footer.tsx            ← Footer for marketing pages
│       ├── Sidebar.tsx           ← Left sidebar for app pages
│       └── Topbar.tsx            ← Top bar for app pages
│
└── 📁 app/                       ← All the pages (Next.js App Router)
    ├── layout.tsx                ← Root layout (applies to entire app)
    ├── globals.css               ← Global CSS styles
    │
    ├── 📁 (marketing)/           ← Public-facing pages (no login needed)
    │   ├── layout.tsx            ← Adds Navbar + Footer to all pages here
    │   ├── page.tsx              ← Homepage ( / )
    │   ├── courses/page.tsx      ← Browse courses ( /courses )
    │   ├── features/page.tsx     ← Features page ( /features )
    │   ├── how-it-works/page.tsx ← How it works ( /how-it-works )
    │   ├── pricing/page.tsx      ← Pricing plans ( /pricing )
    │   └── about/page.tsx        ← About us ( /about )
    │
    ├── 📁 (auth)/                ← Login and signup pages
    │   ├── layout.tsx            ← Split-screen layout (left panel + form)
    │   ├── login/page.tsx        ← Login form ( /login )
    │   └── signup/page.tsx       ← Signup form ( /signup )
    │
    ├── 📁 (onboarding)/
    │   └── page.tsx              ← Setup wizard ( /onboarding )
    │
    └── 📁 (app)/                 ← Protected pages (login required)
        ├── layout.tsx            ← Adds Sidebar to all pages here
        ├── dashboard/page.tsx    ← Main dashboard ( /dashboard )
        ├── courses/page.tsx      ← My courses ( /courses )
        ├── course/[id]/page.tsx  ← Course detail ( /course/csc101 )
        ├── practice/page.tsx     ← Start a quiz ( /practice )
        ├── quiz/active/page.tsx  ← Quiz in progress ( /quiz/active )
        ├── quiz/result/page.tsx  ← Quiz results ( /quiz/result )
        ├── quiz/review/page.tsx  ← Review answers ( /quiz/review )
        ├── analytics/page.tsx    ← Analytics charts ( /analytics )
        ├── quiz-history/page.tsx ← Past quizzes ( /quiz-history )
        ├── bookmarks/page.tsx    ← Saved questions ( /bookmarks )
        ├── leaderboard/page.tsx  ← National rankings ( /leaderboard )
        ├── profile/page.tsx      ← Edit profile ( /profile )
        ├── settings/page.tsx     ← App settings ( /settings )
        └── help/page.tsx         ← Help & FAQ ( /help )
```

### Why are some folders in parentheses like `(app)` and `(marketing)`?

In Next.js App Router, folders with names in parentheses like `(app)` are called **Route Groups**. The parentheses tell Next.js:

> "Group these pages together so they can share a layout, but do NOT include the folder name in the URL."

So `/app/(marketing)/page.tsx` becomes the URL `/` — not `/marketing/`.
And `/app/(app)/dashboard/page.tsx` becomes `/dashboard` — not `/app/dashboard`.

This lets us give different layouts to different sections:

- Marketing pages get `Navbar` + `Footer`
- App pages get the `Sidebar`
- Auth pages get a split-screen panel layout

---

## 5. Every File Explained

### Configuration Files

#### `package.json`

The "shopping list" of the project. It lists every library the app depends on and the commands you can run (`npm run dev`, etc.). When you run `npm install`, npm reads this file and downloads everything listed here.

#### `tailwind.config.ts`

Customises Tailwind CSS for this project. Defines the brand's specific colours (`primary-600` = `#4F46E5`), custom shadow values, and animation keyframes. If you want to change the main colour of the app, you change it here.

#### `tsconfig.json`

Configures the TypeScript compiler. The most important setting here is the path alias `"@/*": ["./*"]`, which means you can write `import Button from "@/components/ui/Button"` anywhere in the project instead of having to figure out relative paths like `../../components/ui/Button`.

#### `.env.example`

A template file showing which environment variables the app needs. You copy this to `.env.local` and fill in your real values. The `.env.local` file is listed in `.gitignore` so it never gets pushed to Git (keeping your keys secret).

---

### `supabase/` Folder

#### `supabase/client.ts`

Creates a single, shared Supabase connection that the whole app uses. It reads your project URL and API key from the `.env.local` file and initialises the Supabase JavaScript client. Every other Supabase file imports `supabase` from here.

```typescript
// This is what it does, simplified:
export const supabase = createClient(YOUR_URL, YOUR_KEY);
```

#### `supabase/auth.ts`

Contains all authentication functions. These are the functions called when users sign up, log in, and log out.

| Function                            | What it does                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `signUp(email, password, fullName)` | Creates a new Supabase Auth user, then inserts a row into the `profiles` table |
| `signIn(email, password)`           | Logs in and returns a session object containing the user's info                |
| `signOut()`                         | Clears the user's session                                                      |
| `getSession()`                      | Checks if there is a currently logged-in session                               |
| `getProfile(userId)`                | Fetches the user's row from the `profiles` table                               |
| `onAuthStateChange(callback)`       | Fires a callback function whenever the user logs in or out                     |

#### `supabase/db.ts`

Contains all database read/write functions. This is the only place in the app that directly queries the Supabase database. All pages import functions from here instead of writing database queries directly.

| Function                                    | What it does                                       |
| ------------------------------------------- | -------------------------------------------------- |
| `updateProfile(userId, data)`               | Updates a user's profile row                       |
| `getCourses()`                              | Fetches all courses from the `courses` table       |
| `getCourse(courseId)`                       | Fetches a single course                            |
| `getQuestions(courseId, count, difficulty)` | Fetches questions for a quiz                       |
| `createQuiz(quiz)`                          | Inserts a new quiz row when a user starts a quiz   |
| `updateQuiz(quizId, data)`                  | Updates the quiz row when the user finishes        |
| `getUserQuizzes(userId)`                    | Fetches all of a user's past quizzes               |
| `addBookmark(...)`                          | Saves a bookmarked question                        |
| `removeBookmark(id)`                        | Deletes a bookmark                                 |
| `getUserBookmarks(userId)`                  | Fetches all bookmarks with the full question data  |
| `getUserSettings(userId)`                   | Reads notification and privacy settings            |
| `upsertUserSettings(...)`                   | Saves settings (updates if exists, creates if not) |

---

### `types/index.ts`

Defines TypeScript "interfaces" — blueprints that describe the exact shape of every piece of data in the app.

**Why this matters:** If a quiz object must always have a `score_percent` field, TypeScript will show an error anywhere in the app that tries to use a quiz without that field. This prevents a huge class of bugs.

Key types defined here:

| Type               | What it describes                                         |
| ------------------ | --------------------------------------------------------- |
| `Profile`          | A user's account data (name, email, school, streak, etc.) |
| `Course`           | A course (code, name, description, total questions, etc.) |
| `Question`         | A single exam question with its options and explanation   |
| `QuestionOption`   | One of the A/B/C/D choices for a question                 |
| `Quiz`             | A quiz session (user ID, score, time taken, status, etc.) |
| `QuizAnswer`       | A single answer a user gave for one question              |
| `Bookmark`         | A saved question                                          |
| `UserSettings`     | Notification and privacy toggle states                    |
| `LeaderboardEntry` | One row of the leaderboard                                |

---

### `utils/` Folder

#### `utils/cn.ts`

A tiny helper function called `cn()` that merges Tailwind class names intelligently. It uses two libraries (`clsx` and `tailwind-merge`) to combine classes and handle conflicts.

```typescript
// Example: without cn(), conflicting classes cause bugs
<div className={`text-red-500 ${isActive ? "text-blue-500" : ""}`} />
// Both text-red and text-blue apply — unpredictable result

// With cn(), the last class always wins cleanly
<div className={cn("text-red-500", isActive && "text-blue-500")} />
// If isActive: only text-blue-500 applies. Clean!
```

#### `utils/format.ts`

Helper functions for formatting data for display:

| Function                           | Example output                                |
| ---------------------------------- | --------------------------------------------- |
| `formatTime(90)`                   | `"1:30"` (for quiz timer)                     |
| `formatDuration(3660)`             | `"1h 1m"`                                     |
| `formatDate("2026-04-29")`         | `"Apr 29, 2026"`                              |
| `formatRelativeDate("2026-04-28")` | `"Yesterday"`                                 |
| `getInitials("Chukwu Obi")`        | `"CO"` (for avatar)                           |
| `getScoreColor(85)`                | `"text-green-600"`                            |
| `getScoreBg(45)`                   | `"bg-red-100 text-red-600"`                   |
| `getResultMessage(72)`             | `{ emoji: "💪", title: "Good Effort!", ... }` |

---

### `constants/mockData.ts`

Contains all the sample data used to make the app's UI look real while the Supabase database is being set up. It includes:

- **10 Nigerian universities** (UNILAG, UI, OAU, UNN, ABU, etc.)
- **10 courses** (Data Structures, Operating Systems, Algorithms, etc.)
- **10 sample questions** with full A/B/C/D options and explanations
- **6 quiz history records**
- **10 leaderboard entries** (with Nigerian names)
- **4 bookmarks**
- **5 testimonials**
- **6 FAQ items**

> **When you connect real Supabase data:** Replace the `mockData` imports in each page with calls to the functions in `supabase/db.ts`.

---

### `store/` Folder — Zustand State

#### `store/authStore.ts`

Stores the currently logged-in user's profile so every page can access it without having to fetch it from Supabase again.

```typescript
// Any page can get the current user like this:
const { profile } = useAuthStore();
console.log(profile.full_name); // "Chukwuemeka Obi"
```

Fields stored: `profile` (full Profile object), `loading` (boolean)
Methods: `setProfile`, `setLoading`, `updateProfile` (partial update), `logout`

#### `store/quizStore.ts`

Stores the entire state of the currently active quiz. This is how the Practice page, Quiz Active page, Result page, and Review page all share data without needing Supabase on every page transition.

Fields stored: `quiz` (the Quiz object), `questions` (array of Question), `answers` (a map of question ID → answer), `currentIndex` (which question you're on)

Methods: `startQuiz`, `setAnswer`, `toggleFlag`, `goToIndex`, `nextQuestion`, `prevQuestion`, `reset`

#### `store/uiStore.ts`

Stores small UI state like whether the sidebar is open and which modal (popup) is currently open. Used to control UI interactions without passing props down through multiple components.

---

### `hooks/useAuth.ts`

A React hook that runs when the app first loads. It:

1. Calls `onAuthStateChange()` from Supabase
2. When Supabase reports a logged-in user, fetches their profile
3. Saves it to `authStore`
4. When Supabase reports logout, clears the store

This hook is what keeps the user "logged in" across page refreshes — Supabase stores the session in the browser's localStorage and this hook picks it up.

---

### `components/ui/` — UI Building Blocks

These are reusable components used throughout the app. Instead of rewriting a button every time, you use `<Button>` once.

#### `Button.tsx`

A fully featured button with 5 visual styles (variants) and 3 sizes:

| Variant     | Looks like                             |
| ----------- | -------------------------------------- |
| `primary`   | Filled indigo button (main actions)    |
| `secondary` | Light indigo button                    |
| `outline`   | White button with indigo border        |
| `ghost`     | No border, just text with hover effect |
| `danger`    | Red button (destructive actions)       |

Also supports: `loading` (shows spinner), `leftIcon`, `rightIcon`, `fullWidth`, `disabled`.

#### `Input.tsx`

A styled text input that supports: `label`, `error` message, `hint` text, `leftIcon`, `rightIcon`. Automatically handles focus states and error styling.

#### `components/ui/index.tsx`

Exports several components:

| Component     | What it does                                                 |
| ------------- | ------------------------------------------------------------ |
| `Card`        | White rounded box with a shadow. Wraps content into a card.  |
| `Badge`       | Small coloured label (like "Active", "Easy", "New")          |
| `Avatar`      | Circular user icon — shows initials if no image is uploaded  |
| `ProgressBar` | Horizontal progress bar with colour variants                 |
| `Modal`       | A popup dialog that overlays the page (closes on Escape key) |
| `Stepper`     | Multi-step progress indicator (used on the Onboarding page)  |

---

### `components/shared/` — Layout Components

#### `Navbar.tsx`

The top navigation bar shown on marketing pages (Homepage, Pricing, etc.). Contains the logo, nav links, and Login/Sign Up buttons. Has a mobile hamburger menu that slides down.

#### `Footer.tsx`

The bottom footer on marketing pages. Contains links to Product, Company, and Support pages, social media icons, and the "Made in Nigeria 🇳🇬" badge.

#### `Sidebar.tsx`

The left navigation panel shown on all app pages (Dashboard, Analytics, etc.). Shows the main nav items (Dashboard, Practice, Analytics, etc.) and user profile at the bottom. Handles logout.

#### `Topbar.tsx`

The top bar shown inside the app. Shows the current page title, a search bar, a notification bell with a red dot, and the user's avatar.

---

## 6. Every Page Explained

### Marketing Pages (no login required)

#### `/` — Homepage

The main landing page. Contains:

- **Hero section** — headline, two CTA buttons, trust badges
- **Stats bar** — 500K+ students, 10K+ questions (indigo background)
- **Features grid** — 6 feature cards with icons
- **Courses preview** — 6 course cards from `mockData`
- **How it works** — 3 numbered steps
- **Testimonials** — 5 student review cards with star ratings
- **FAQ** — 6 frequently asked questions
- **CTA section** — final sign-up call to action (indigo background)

#### `/features`

Shows all 8 product features in a 3-column grid. Each card has an icon, title, tag badge, and description. Ends with a full-width CTA banner.

#### `/courses`

Displays all courses in a responsive grid with search bar and exam type filters. Each card shows the course code, name, description, star rating, and question count.

#### `/how-it-works`

Shows the 4-step process: Create Account → Choose Courses → Practice → Track Progress. Uses a vertical timeline layout with icons and numbered steps.

#### `/pricing`

Shows 3 pricing plans side by side: Free (₦0), Pro (₦1,500/month), Premium (₦2,500/month). The Pro plan is highlighted with a "Most Popular" badge and a primary-coloured border.

#### `/about`

Short about page with the company story, mission, values, and team description.

---

### Auth Pages

#### `/login`

Login form with email and password fields. Features:

- Show/hide password toggle
- Client-side validation (checks email format, required fields)
- Calls `signIn()` from `supabase/auth.ts`
- Fetches user profile after login
- Redirects to `/dashboard` (or `/onboarding` if first time)
- Shows toast notification on success or error

#### `/signup`

Registration form with full name, email, password, and confirm password. Features:

- Password length validation (minimum 8 characters)
- Password match validation
- Calls `signUp()` from `supabase/auth.ts`
- Creates both Auth user and profile row in one step
- Redirects to `/onboarding`

The auth pages use a split-screen layout: the left side is a decorative indigo panel with stats, the right side is the form.

---

### Onboarding Page (`/onboarding`)

A 2-step wizard that runs after a user first signs up:

**Step 1 — Exam Type**
The user picks one of 4 exam types (WAEC, UTME, Post-UTME, University). Each option is a large card with an emoji, label, and description. A checkmark appears when selected.

**Step 2 — School & Courses**
The user optionally selects their school from a dropdown (10 Nigerian universities). Then they select which courses to enrol in — shown as a scrollable grid of checkable cards.

When the user clicks "Finish Setup":

- `updateProfile()` is called to save exam type, school, and enrolled courses to Supabase
- `onboarding_complete` is set to `true`
- User is redirected to `/dashboard`

---

### App Pages (login required)

All these pages use the `(app)` layout which wraps them in the `Sidebar`.

#### `/dashboard`

The main home screen after login. Contains:

- **Welcome header** with the user's name and streak message
- **4 stat cards** — Streak, Avg Score, Quizzes Taken, Leaderboard Rank
- **Continue Learning** — enrolled courses with progress bars and Play buttons
- **Daily Streak calendar** — 7 days of the week, ticked for active days
- **Recommended** — 2 smart course recommendations with reasons
- **Recent Quizzes** — last 4 quizzes with scores

#### `/courses` (app)

Shows two sections:

1. **Enrolled Courses** — cards with a colour accent strip, progress bar, quiz count, and "Last practiced" date. Has Play and Detail buttons.
2. **Browse More Courses** — courses not yet enrolled in, shown as compact list items.

#### `/course/[id]`

Detail page for a single course. Shows:

- Course hero with name, description, stats, and progress bar
- 3 quick stat badges (Avg Score, Best Score, Quizzes)
- Topic breakdown list — each topic with an accuracy progress bar and colour coding (green/amber/red)
- "Start Practice" button that links to `/practice?course=[id]`

The `[id]` in the folder name means this is a **dynamic route** — the URL `/course/csc101` and `/course/alg101` both use this same file, but `params.id` will be `csc101` or `alg101` respectively.

#### `/practice`

The quiz setup page. The user configures:

- **Mode** — Quiz Mode (timed, scored) or Study Mode (no timer, instant feedback)
- **Course** — dropdown of all available courses
- **Difficulty** — Easy, Medium, Hard, or Mixed
- **Question Count** — 10, 20, 30, 40, or 50
- **Timer toggle** — only shown in Quiz Mode (1 minute per question)

Clicking "Start Quiz":

1. Pulls the right questions from `SAMPLE_QUESTIONS` (later from Supabase)
2. Creates a quiz object
3. Calls `startQuiz()` on the Zustand `quizStore`
4. Navigates to `/quiz/active`

#### `/quiz/active`

The main quiz-taking screen. Features:

- **Progress bar** at the top showing how far through the quiz you are
- **X button** to quit (shows a confirmation modal)
- **Timer** counting down (if timed mode)
- **Question text** with topic tag and difficulty badge
- **4 answer buttons** (A/B/C/D) — selecting one highlights it in indigo
- In **Study Mode**: after selecting an answer, options turn green/red and an explanation panel appears
- **Flag button** — turns amber when flagged, marks the question for review
- **Bookmark button** — opens a confirmation modal
- **Previous / Next buttons**
- **Question navigator** at the bottom — coloured squares for each question (grey = unanswered, indigo = answered, amber = flagged, current = filled)

When the user clicks "Finish":

- Navigates to `/quiz/result`

#### `/quiz/result`

The results screen shown after finishing a quiz. Shows:

- **Score hero** — large emoji + title (e.g. "Excellent Work! 🏆") + percentage score + course name
- **Correct / Incorrect / Skipped** breakdown in 3 coloured boxes
- **Topics to Review** — automatically identifies topics where accuracy was below 70%
- Two action buttons: **Review Answers** and **Try Again**

#### `/quiz/review`

Shows each question one by one with the user's answers colour-coded:

- ✅ Green border = correct option
- ❌ Red border = selected wrong answer
- **Explanation** panel shown under every question
- **Question navigator** at the top (green squares for correct, red for wrong)
- Previous / Next navigation

#### `/analytics`

Data visualisation page with:

- **4 stat cards** — Avg Score, Total Quizzes, Best Score, Study Time
- **Line chart** — score over the last 10 days (Recharts `LineChart`)
- **Bar chart** — accuracy percentage per topic, bars coloured green/amber/red based on score
- **Expandable course table** — each course row expands to show Best Score, Avg Score, Progress

#### `/quiz-history`

Full list of all past quizzes. Features:

- **3 summary cards** at the top (Total Quizzes, Avg Score, Best Score)
- **Filter tabs** — All / Quiz Mode / Study Mode
- **List rows** — each row shows course name, mode badge, date, time taken, correct/wrong counts, and score badge

#### `/bookmarks`

Shows all saved questions. Features:

- **Search bar** — filters by question text
- **Filter tabs** — All / Questions / Explanations
- **Cards** — each card shows the question text, topic tag, bookmark type, optional note, and date
- **Hover-to-reveal delete button** — the trash icon only appears on hover

#### `/leaderboard`

National rankings page. Features:

- **Podium visual** — top 3 students shown in a raised podium layout with medal icons
- **Full table** — all 10 students with rank emoji, name, quiz count, streak, and score
- Current user row is highlighted in indigo

#### `/profile`

User profile page. Features:

- **Avatar section** — circular avatar with a camera button for photo upload (UI only), name, email, and plan badges
- **4 quick stats** — Streak, Quizzes, Best Score, Avg Score
- **Edit form** — full name, email, school dropdown, exam type selector, bio textarea
- **Save button** with loading spinner

#### `/settings`

Settings page with 3 tabs:

**Notifications tab:**

- Daily Quiz Reminder, Study Reminders, Performance Updates
- Push Notifications, Email Notifications
- Each is a toggle switch

**Privacy tab:**

- Public Profile, Show Progress on Leaderboard, Allow Direct Messages
- Usage Analytics, Personalised Recommendations
- Each is a toggle switch

**Account tab:**

- Change Password button
- Two-Factor Authentication button
- Delete Account button (opens a confirmation modal with a warning)

#### `/help`

Help centre page. Features:

- **Search hero** — indigo banner with a search bar
- **Category cards** — 4 help categories (Practice, Account, Analytics, Profile)
- **FAQ accordion** — 6 questions that expand on click to show the answer
- **Contact section** — Live Chat card and Email Support card

---

## 7. How Data Flows

Here is exactly what happens from the moment a user opens the app:

```
Browser loads the app
        ↓
app/layout.tsx loads → sets up font, Toaster
        ↓
useAuth() hook starts (listens for Supabase auth events)
        ↓
Supabase checks localStorage for a saved session
        ↓
  ┌─────────────────────────┬────────────────────────┐
  │  Session exists          │  No session            │
  │  (returning user)        │  (first visit)         │
  ↓                          ↓                        │
getProfile() called         User sees the            │
Saves to authStore          marketing pages          │
User sees dashboard         or login/signup          │
  └─────────────────────────┴────────────────────────┘
```

### Quiz Flow

```
User fills in /practice form
        ↓
startQuiz() called on quizStore
  → saves quiz config + questions to memory
        ↓
Navigate to /quiz/active
  → reads questions from quizStore
  → as user answers: setAnswer() updates quizStore
        ↓
User clicks Finish
        ↓
Navigate to /quiz/result
  → reads answers from quizStore
  → calculates score, weak topics
  → (in production: saves to Supabase via updateQuiz())
        ↓
User clicks Review Answers
        ↓
Navigate to /quiz/review
  → reads questions + answers from quizStore
  → shows colour-coded review
        ↓
User clicks Done
  → reset() clears quizStore
  → Navigate back to /dashboard
```

---

## 8. The Design System

### Colours

| Name          | Hex       | Usage                                    |
| ------------- | --------- | ---------------------------------------- |
| `primary-600` | `#4F46E5` | Buttons, active states, links            |
| `primary-50`  | `#EEF2FF` | Backgrounds of icon boxes, hover states  |
| `background`  | `#F8F9FF` | App background (slightly off-white blue) |
| `success`     | `#22C55E` | Correct answers, completed states        |
| `warning`     | `#F59E0B` | Flagged questions, medium scores         |
| `error`       | `#EF4444` | Wrong answers, destructive actions       |
| `info`        | `#3B82F6` | Informational callouts and explanations  |

### Spacing and Sizing

The app uses Tailwind's default 4px spacing scale. Common sizes used:

- Card padding: `p-5` or `p-6` (20–24px)
- Button height: `h-9` (sm), `h-11` (md), `h-12` (lg)
- Border radius: `rounded-xl` (12px) for inputs, `rounded-2xl` (16px) for cards

### Typography

- Font: **Inter** (loaded via `next/font/google`)
- Headings: `font-bold` with sizes `text-2xl` to `text-4xl`
- Body: `text-sm` or `text-base` with `text-gray-600` or `text-gray-700`
- Labels: `text-xs` with `text-gray-500`

### Shadows

- `shadow-card` — subtle shadow for white cards
- `shadow-hover` — slightly larger shadow used on hover
- `shadow-modal` — deep shadow for modals

### Animations

- `animate-fade-in` — fades in from transparent to opaque
- `animate-slide-up` — slides up 12px while fading in
  Both take 0.3 seconds and use `ease-out` timing.

---

## 9. Key Concepts for Beginners

### What is a "component"?

A component is a reusable piece of UI. Instead of writing the same button HTML 50 times, you write it once as `Button.tsx` and use `<Button>` everywhere. If you change the button's design in one place, it updates everywhere.

### What is "state"?

State is data that can change over time, which causes the UI to re-render. For example, `currentIndex` in `quizStore` is state — when it changes (user clicks Next), the quiz page re-renders to show the new question.

### What is a "hook"?

A hook is a special React function that lets you "hook into" React features inside a component. Hooks always start with `use`. Examples:

- `useState` — local component state
- `useEffect` — run code when something changes
- `useRouter` — navigate to a different page
- `useAuthStore()` — get the logged-in user from Zustand

### What is "routing"?

Routing is how the app decides which page to show based on the URL. In Next.js App Router, this is automatic — every `page.tsx` file becomes a URL. `/app/(app)/dashboard/page.tsx` → `http://localhost:3000/dashboard`.

### What does `"use client"` mean?

By default in Next.js, files run on the server. Adding `"use client"` at the top of a file tells Next.js: "This file uses browser features (like `useState`, event handlers, `window`) — run it on the client."

Any file that uses interactivity (clicks, form inputs, Zustand, Recharts) needs `"use client"`.

### What is `async/await`?

Fetching data from Supabase takes time (it's a network request). `async/await` lets us wait for that data without freezing the browser:

```typescript
// Without async/await (confusing)
supabase.from("profiles").select("*").then(result => {
  supabase.from("quizzes").select("*").then(quizResult => { ... });
});

// With async/await (clear and readable)
async function loadData() {
  const profile = await supabase.from("profiles").select("*");
  const quizzes = await supabase.from("quizzes").select("*");
}
```

---

## 10. How to Extend the App

### Add a new page

1. Create a new folder inside `app/(app)/` with the page name
2. Create a `page.tsx` file inside it
3. Start with `"use client";` if it has interactivity
4. Export a default function with the page's JSX
5. The URL is automatically `/your-page-name`

Example — adding a `/notes` page:

```bash
mkdir "app/(app)/notes"
touch "app/(app)/notes/page.tsx"
```

```tsx
// app/(app)/notes/page.tsx
"use client";
import Topbar from "@/components/shared/Topbar";

export default function NotesPage() {
  return (
    <div>
      <Topbar title="My Notes" />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Notes</h1>
      </div>
    </div>
  );
}
```

Then add it to the Sidebar in `components/shared/Sidebar.tsx` by adding an entry to the `NAV` array.

---

### Connect real data instead of mockData

Right now pages import from `constants/mockData.ts`. To use real Supabase data:

```typescript
// BEFORE (mock data)
import { COURSES } from "@/constants/mockData";

// AFTER (real Supabase data)
import { getCourses } from "@/supabase/db";

// Then in the component:
const [courses, setCourses] = useState([]);

useEffect(() => {
  getCourses().then(setCourses);
}, []);
```

---

### Add a new question to the database

1. Open Supabase → Table Editor → `questions` table
2. Click "Insert Row"
3. Fill in: `course_id`, `topic_id`, `question_text`, `difficulty`, `explanation`
4. Then go to the `options` table and add 4 rows (A, B, C, D) with the same `question_id`

Or use the SQL Editor:

```sql
INSERT INTO questions (id, course_id, topic_id, topic_name, question_text, difficulty, explanation)
VALUES ('q11', 'csc101', 'trees', 'Trees', 'What is an AVL tree?', 'hard', 'An AVL tree is a self-balancing BST...');

INSERT INTO options (id, question_id, label, text, is_correct) VALUES
  ('q11a', 'q11', 'A', 'A tree that automatically balances itself', TRUE),
  ('q11b', 'q11', 'B', 'A tree with only 2 children', FALSE),
  ('q11c', 'q11', 'C', 'A tree sorted by alphabet', FALSE),
  ('q11d', 'q11', 'D', 'A tree with infinite depth', FALSE);
```

---

## 11. Troubleshooting

### "Module not found" error

Run `npm install` — a library is missing.

### "NEXT_PUBLIC_SUPABASE_URL is not defined"

Your `.env.local` file is missing or incorrectly formatted. Make sure:

- The file is called `.env.local` (not `.env.example`)
- It's in the root folder (same level as `package.json`)
- You restart the dev server after creating/editing it (`Ctrl+C` then `npm run dev`)

### Users can't log in

- Check your Supabase project URL and anon key are correct
- Check the Supabase Auth settings (under Authentication → Settings) — make sure email auth is enabled

### Data isn't saving to Supabase

- Make sure you ran the full RLS policies SQL from `SUPABASE_README.md`
- Without RLS policies, all writes are blocked by default
- Check the Supabase Table Editor to confirm rows are being created

### "Cannot read properties of null"

Usually means `profile` is `null` (user not logged in) but the page is trying to use it. Wrap the page with a login check, or add a `loading` state.

### Page shows old/cached data

Run `npm run dev` again (or hard refresh the browser with `Ctrl+Shift+R`).

### Charts not rendering on Analytics page

Make sure the page has `"use client"` at the top — Recharts requires the browser to render.

---

## 📞 Support

- 📧 Email: support@examquest.ng
- 💬 Discord: coming soon
- 📖 Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- 📖 Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- 📖 Tailwind Docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

_Made with ❤️ in Nigeria 🇳🇬 — ExamQuest v1.0_
