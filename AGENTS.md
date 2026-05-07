# AI Agent Guide for ExamQuest

ExamQuest is a **Next.js 14 exam preparation platform** for Nigerian students. This guide helps AI agents understand the codebase architecture, patterns, and conventions.

## Quick Start

**Build & Run:**
```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint checks
```

**Setup:** Node.js 18+, Supabase project with `.env.local` containing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. See [SUPABASE_README.md](SUPABASE_README.md) for database schema.

---

## Architecture

### Route Groups (No URL Impact)
The app uses Next.js App Router with route groups for organization. Groups like `(marketing)` don't affect URLs—only the path after the group does.

```
/app
├── (marketing)/          → Public pages: /, /about, /features, /pricing, /how-it-works
├── (auth)/              → Auth pages: /login, /signup  
├── (app)/               → Protected pages: /dashboard, /courses, /practice, /quiz/[id], /leaderboard
└── (onboarding)/        → Onboarding flow
```

**Layout inheritance:** Each route group has its own `layout.tsx` providing different UI shells (Navbar/Footer for marketing, Sidebar for app).

### State Management (Zustand)

Three stores in `/store/` using Zustand—not Redux or Context API:

- **`authStore.ts`** - User profile, loading state, profile updates. Use `const user = useAuthStore(s => s.user)` to read state.
- **`quizStore.ts`** - Active quiz state, questions, current question index, user answers, submission status. Complex state with validation logic.
- **`uiStore.ts`** - Sidebar visibility, modal state. Global UI toggles.

**Pattern:** Use `set(state => ({ ...state, field: value }))` for functional updates. Avoid direct mutations.

### Authentication & Database

- **Supabase client** initialized in `supabase/client.ts` with environment variables
- **Auth functions** in `supabase/auth.ts`: signUp, signIn, signOut, getProfile
- **useAuth hook** (in `hooks/useAuth.ts`) syncs Supabase auth state to `authStore` on mount
- **Row Level Security (RLS)** policies protect all tables—users can only access their own data

**Critical:** Always use the `useAuth` hook or check `authStore` for user state. Don't call Supabase auth directly in components.

### UI Components

**Design System:**
- Primitive components in `/components/ui/` (Button, Input, Card, Badge, Avatar, Modal, ProgressBar)
- Layout components in `/components/shared/` (Sidebar, Navbar, Footer, Topbar)
- Tailwind CSS with custom purple/indigo theme in `tailwind.config.ts`
- Use `cn()` utility from `/utils/cn.ts` for conditional class merging

**Button Variants:** primary (filled), secondary (ghost), outline, danger. See `Button.tsx` for all options.

---

## Common Patterns

### 1. Protected Pages (App Routes)
Pages in `/(app)/` require authentication. Use the `useAuth` hook to access user:

```typescript
"use client";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  if (!user) return <div>Loading...</div>;
  return <div>Welcome {user.email}</div>;
}
```

### 2. Data Fetching from Supabase
Use the Supabase client directly in components or fetch data at the route level:

```typescript
import { supabase } from "@/supabase/client";

const { data, error } = await supabase
  .from("courses")
  .select("*")
  .eq("id", courseId);
```

### 3. Quiz Flow
Quiz state is centralized in `quizStore`. Actions include:
- `setQuestions()` - Load questions
- `setCurrentQuestionIndex()` - Navigate questions
- `setAnswer()` - Store user answer
- `submitQuiz()` - Finalize answers and calculate results

See `store/quizStore.ts` for full interface.

### 4. Form Inputs
Use the `Input` component from `components/ui/Input.tsx`:

```typescript
<Input 
  type="email" 
  placeholder="Enter email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### 5. Toast Notifications
Use `react-hot-toast`:

```typescript
import toast from "react-hot-toast";

toast.success("Quiz submitted!");
toast.error("Failed to save");
```

---

## Key Conventions

1. **TypeScript:** All files use TypeScript. See `/types/index.ts` for domain types (Quiz, Course, Question, etc.).
2. **"use client":** Components with interactivity need `"use client"` directive (Supabase client-side, state, event handlers).
3. **Nigerian Context:** App targets Nigerian exams (WAEC, JAMB UTME, Post-UTME). Dates, currency, and content reflect this.
4. **Error Handling:** Wrap Supabase calls in try/catch. Show user-friendly toast messages on errors.
5. **Dynamic Routes:** Use `[id]` folders for dynamic segments. Access via `useParams()` or route params passed to page.

---

## Common Pitfalls

- **❌ Direct auth calls in components.** Always use `useAuth()` hook or read from `authStore`.
- **❌ Forgetting "use client" in interactive components.** Pages with hooks, event handlers, or Supabase calls need this.
- **❌ Mutating store state directly.** Use `set()` with functional updates: `set(state => ({ ...state, count: state.count + 1 }))`.
- **❌ Route group conflicts.** Two route groups cannot have pages resolving to the same path (e.g., both `/(app)/courses` and `/(marketing)/courses` → `/courses`). Rename one.
- **❌ Missing RLS policies.** Database queries fail if row-level security policies aren't configured for the user.

---

## Project Structure Essentials

```
examquest/
├── app/
│   ├── (app)/           → Authenticated pages with Sidebar
│   ├── (auth)/          → Login/signup pages
│   ├── (marketing)/     → Public pages (landing, about, pricing)
│   ├── (onboarding)/    → Onboarding flow
│   ├── layout.tsx       → Root layout
│   └── globals.css      → Global styles
├── components/
│   ├── ui/              → Reusable primitives (Button, Input, Card, etc.)
│   └── shared/          → Layout components (Sidebar, Navbar, Footer, Topbar)
├── hooks/
│   └── useAuth.ts       → Auth state hook (syncs Supabase → authStore)
├── store/
│   ├── authStore.ts     → User profile, auth state
│   ├── quizStore.ts     → Quiz questions, answers, results
│   └── uiStore.ts       → Sidebar, modal visibility
├── supabase/
│   ├── client.ts        → Supabase client initialization
│   ├── auth.ts          → Auth functions
│   └── db.ts            → Database utilities
├── types/               → TypeScript interfaces (Quiz, Course, Question, etc.)
├── utils/               → Helpers (cn, format, etc.)
└── constants/mockData.ts → Mock data for development
```

---

## When to Ask for Help

- How does the quiz state management work?
- Where should I add a new page?
- How do I protect a page from unauthenticated users?
- How do I add a new database table?
- What's the data flow for [specific feature]?

See [README.md](README.md) for detailed documentation on every file, every page, and how data flows through the app.
