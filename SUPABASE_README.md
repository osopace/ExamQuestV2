# 🟢 ExamQuest — Supabase Setup Guide

A complete, beginner-friendly guide to connecting ExamQuest to Supabase. Read this before running the app.

---

## 📖 What is Supabase?

Supabase is a free, open-source alternative to Firebase. It gives your app:

| Feature                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| **Database**           | A real PostgreSQL database (like Excel, but for apps) |
| **Auth**               | Login / signup with email, Google, etc.               |
| **Storage**            | Store files and images                                |
| **Row Level Security** | Rules that protect who can read/write data            |
| **Auto-generated API** | Your database becomes an instant REST API             |

Think of it like this: Supabase is the "back end" of your app — it stores all the data, handles logins, and makes sure only the right people can access the right information.

---

## 🚀 Step 1 — Create a Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `examquest`
   - **Database password**: Choose a strong password (save it somewhere!)
   - **Region**: Choose the closest one to Nigeria (e.g. `eu-west-2 London` or `us-east-1`)
5. Click **"Create new project"**
6. Wait ~2 minutes for the project to be ready

---

## 🔑 Step 2 — Get Your API Keys

Once your project is ready:

1. In the left sidebar, click **"Project Settings"** (the gear icon)
2. Click **"API"**
3. You'll see two important values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string of characters

4. Copy these into your `.env.local` file:

```bash
# Create a file called .env.local in the root of your project
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Important**: Never share the `service_role` key. Only use the `anon` key in your frontend.

---

## 🗄️ Step 3 — Create the Database Tables

This is where you set up all the "tables" (like spreadsheet sheets) that store your data.

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the SQL below, then click **"Run"**

### Full SQL Schema

```sql
-- ─────────────────────────────────────────
-- PROFILES TABLE
-- Stores each user's personal information
-- ─────────────────────────────────────────
-- CREATE TABLE profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   full_name TEXT NOT NULL,
--   email TEXT NOT NULL,
--   exam_type TEXT CHECK (exam_type IN ('waec', 'utme', 'post_utme', 'university')),
--   school_id TEXT,
--   school_name TEXT,
--   enrolled_course_ids TEXT[] DEFAULT '{}',
--   current_streak INTEGER DEFAULT 0,
--   longest_streak INTEGER DEFAULT 0,
--   last_active_date DATE,
--   is_premium BOOLEAN DEFAULT FALSE,
--   onboarding_complete BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW(),

--   CONSTRAINT university_fields_only CHECK (
--     (exam_type = 'university') OR (school_id IS NULL AND school_name IS NULL)
--   ),
--   CONSTRAINT school_fields_complete CHECK (
--     school_id IS NULL = (school_name IS NULL)
--   )
-- );

-- ─────────────────────────────────────────
-- COURSES TABLE
-- Stores all available courses (subjects)
-- ─────────────────────────────────────────
-- CREATE TABLE courses (
--   id TEXT PRIMARY KEY,
--   code TEXT NOT NULL,
--   name TEXT NOT NULL,
--   description TEXT,
--   exam_type TEXT CHECK (exam_type IN ('waec', 'utme', 'post_utme', 'university')),

--   icon TEXT,
--   color TEXT,
--   total_questions INTEGER DEFAULT 0,


--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
Name	Type	Constraints
id

text

Primary
Non-nullable

Edit

code

text

Unique
Non-nullable

Edit

name

text

Non-nullable

Edit

description

text

Nullable

Edit

exam_type

text

Non-nullable

Edit

icon

text

Nullable

Edit

color

text

Nullable

Edit

total_questions

int4

Nullable

Edit

created_at


-- ─────────────────────────────────────────
-- TOPICS TABLE
-- Stores topics within each course
-- ─────────────────────────────────────────
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- QUESTIONS TABLE
-- Stores all exam questions
-- ─────────────────────────────────────────
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  explanation TEXT,
  exam_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- OPTIONS TABLE
-- Stores the A/B/C/D answer choices per question
-- ─────────────────────────────────────────
CREATE TABLE options (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT CHECK (label IN ('A', 'B', 'C', 'D')),
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

-- ─────────────────────────────────────────
-- QUIZZES TABLE
-- Records each quiz session a user takes
-- ─────────────────────────────────────────
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES courses(id),
  course_name TEXT,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
  mode TEXT CHECK (mode IN ('quiz', 'study')) DEFAULT 'quiz',
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER,
  time_taken_seconds INTEGER,
  difficulty TEXT,
  score_percent INTEGER,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────
-- QUIZ ANSWERS TABLE
-- Stores each answer a user gave in a quiz
-- ─────────────────────────────────────────
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id),
  selected_option_id TEXT,
  is_correct BOOLEAN,
  is_flagged BOOLEAN DEFAULT FALSE,
  question_order INTEGER
);

-- ─────────────────────────────────────────
-- BOOKMARKS TABLE
-- Stores questions a user has bookmarked
-- ─────────────────────────────────────────
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  bookmark_type TEXT CHECK (bookmark_type IN ('question', 'explanation')) DEFAULT 'question',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- ─────────────────────────────────────────
-- USER SETTINGS TABLE
-- Stores notification and privacy settings
-- ─────────────────────────────────────────
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_reminders BOOLEAN DEFAULT TRUE,
  study_reminders BOOLEAN DEFAULT FALSE,
  performance_updates BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  profile_visibility BOOLEAN DEFAULT TRUE,
  show_progress BOOLEAN DEFAULT TRUE,
  allow_messages BOOLEAN DEFAULT FALSE,
  usage_data BOOLEAN DEFAULT TRUE,
  personalized_recs BOOLEAN DEFAULT TRUE
);
```

---

## 🛡️ Step 4 — Set Up Row Level Security (RLS)

RLS is a set of rules that decides **who can read or change which rows** in your database.

**Example without RLS:** Any logged-in user could read everyone else's quiz results. 😱
**Example with RLS:** Users can only read and update their own data. ✅

Run this SQL in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Courses, topics, questions: everyone can read (public content)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ─────────────────────────────
-- Users can only read and update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── PUBLIC CONTENT ───────────────────────
-- Anyone logged in can read courses, topics, questions, options
CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read topics"
  ON topics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read options"
  ON options FOR SELECT TO authenticated USING (true);

-- ─── QUIZZES ──────────────────────────────
CREATE POLICY "Users manage own quizzes"
  ON quizzes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── QUIZ ANSWERS ─────────────────────────
CREATE POLICY "Users manage own quiz answers"
  ON quiz_answers FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM quizzes WHERE id = quiz_id)
  );

-- ─── BOOKMARKS ────────────────────────────
CREATE POLICY "Users manage own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── USER SETTINGS ────────────────────────
CREATE POLICY "Users manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔌 Step 5 — How the App Connects to Supabase

Here's what happens when a user uses the app:

```
User opens app
      ↓
supabase/client.ts creates a Supabase connection using your URL + key
      ↓
hooks/useAuth.ts listens for login/logout events
      ↓
When user logs in → fetch their profile from profiles table
      ↓
Store profile in Zustand (authStore.ts) so all pages can access it
      ↓
Every database operation goes through supabase/db.ts
```

### `supabase/client.ts` — The Connection

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

This file creates **one shared Supabase connection** that the whole app uses.

### `supabase/auth.ts` — Login & Signup

All authentication functions live here:

- `signUp(email, password, fullName)` — creates a new user in Supabase Auth AND a row in the `profiles` table
- `signIn(email, password)` — logs in and returns a session
- `signOut()` — logs out
- `getProfile(userId)` — fetches the user's profile row from the database
- `onAuthStateChange(callback)` — fires whenever the user logs in or out

### `supabase/db.ts` — Database Operations

All database reads and writes live here:

- `updateProfile(userId, data)` — save changes to a user's profile
- `getCourses()` — fetch all courses from the `courses` table
- `getQuestions(courseId, count, difficulty)` — fetch questions for a quiz
- `createQuiz(quiz)` — save a new quiz session when user starts a quiz
- `updateQuiz(quizId, data)` — save results when user finishes a quiz
- `getUserQuizzes(userId)` — fetch all of a user's past quizzes
- `addBookmark / removeBookmark / getUserBookmarks` — manage saved questions
- `getUserSettings / upsertUserSettings` — read and save notification/privacy settings

---

## 📦 Step 6 — Seed Initial Data (Optional)

To pre-fill the database with courses and questions, run this in the SQL Editor:

```sql
-- Insert some sample courses
INSERT INTO courses (id, code, name, description, exam_type, icon, color, total_questions, total_quizzes, rating)
VALUES
  ('csc101', 'CSC101', 'Data Structures', 'Arrays, stacks, queues, trees, graphs and their applications.', 'university', 'BookOpen', '#4F46E5', 120, 26, 4.8),
  ('csc201', 'CSC201', 'Operating Systems', 'Process management, memory, file systems, concurrency.', 'university', 'Cpu', '#22C55E', 95, 18, 4.7),
  ('csc301', 'CSC301', 'Database Systems', 'Relational databases, SQL, normalization, transactions.', 'university', 'Database', '#8B5CF6', 110, 22, 4.8);

-- Insert a sample topic
INSERT INTO topics (id, course_id, name, total_questions)
VALUES
  ('stacks', 'csc101', 'Stacks & Queues', 18),
  ('trees', 'csc101', 'Trees', 20),
  ('arrays', 'csc101', 'Arrays', 24);

-- Insert a sample question
INSERT INTO questions (id, course_id, topic_id, topic_name, question_text, difficulty, explanation)
VALUES
  ('q1', 'csc101', 'stacks', 'Stacks & Queues', 'Which data structure uses the LIFO principle?', 'easy', 'A Stack follows LIFO — the last element inserted is the first one removed.');

-- Insert options for that question
INSERT INTO options (id, question_id, label, text, is_correct)
VALUES
  ('q1a', 'q1', 'A', 'Queue', FALSE),
  ('q1b', 'q1', 'B', 'Stack', TRUE),
  ('q1c', 'q1', 'C', 'Linked List', FALSE),
  ('q1d', 'q1', 'D', 'Tree', FALSE);
```

---

## 🔄 Step 7 — Auth Flow Explained

Here is the complete flow from signup to dashboard, step by step:

```
1. User fills in /signup form
2. signUp() is called → Supabase creates a user in auth.users
3. signUp() then creates a row in the profiles table with the user's name
4. User is redirected to /onboarding
5. User picks exam type, school and courses
6. updateProfile() saves these to Supabase profiles table
7. User is redirected to /dashboard

--- Later visits ---
8. User opens the app
9. useAuth() hook starts listening (onAuthStateChange)
10. Supabase detects an existing session (stored in localStorage)
11. getProfile() fetches the user's profile from the database
12. Profile is saved in the Zustand store
13. All pages can access the profile via useAuthStore()
```

---

## ❓ Common Questions

**Q: Why can't I log in after signing up?**
Make sure you've added your `.env.local` file with the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Restart the dev server after adding them.

**Q: Why is data not saving to the database?**
Check that you ran all the SQL above (both the schema and the RLS policies). Without RLS policies, all writes are blocked.

**Q: I see "policy already exists" errors in the SQL editor**
This just means the policy was already created. You can safely ignore this error or drop and recreate: `DROP POLICY "policy name" ON table_name;`

**Q: How do I view the data in my database?**
In Supabase, click **"Table Editor"** in the left sidebar. You can browse, add and delete rows just like a spreadsheet.

**Q: How do I reset a user's password?**
In Supabase, click **"Authentication"** → **"Users"** → click the user → **"Send Password Recovery"**.

**Q: The app works but shows mock data, not real data from Supabase**
The app currently uses `constants/mockData.ts` for display while Supabase is being set up. Once your Supabase project is ready, update the pages to call the real functions from `supabase/db.ts` instead of importing from `mockData.ts`.

---

## 📁 File Reference

| File                 | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `supabase/client.ts` | Creates the shared Supabase connection               |
| `supabase/auth.ts`   | All signup, login, logout functions                  |
| `supabase/db.ts`     | All database read/write functions                    |
| `store/authStore.ts` | Stores the logged-in user's profile in memory        |
| `hooks/useAuth.ts`   | Listens for login/logout and keeps the store updated |
| `.env.local`         | Your secret API keys (never commit this to Git)      |

---

## 🌐 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript SDK Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

_Made with ❤️ in Nigeria 🇳🇬 — ExamQuest Team_
