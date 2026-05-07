import type { School, Course, Question, Quiz, Bookmark, LeaderboardEntry, ScoreOverTime, TopicAnalytics, UserCourseProgress } from "@/types";

export const SCHOOLS: School[] = [
  { id: "unilag", name: "University of Lagos", short_name: "UNILAG", type: "university", state: "Lagos" },
  { id: "ui", name: "University of Ibadan", short_name: "UI", type: "university", state: "Oyo" },
  { id: "oau", name: "Obafemi Awolowo University", short_name: "OAU", type: "university", state: "Osun" },
  { id: "unn", name: "University of Nigeria, Nsukka", short_name: "UNN", type: "university", state: "Enugu" },
  { id: "abu", name: "Ahmadu Bello University", short_name: "ABU", type: "university", state: "Kaduna" },
  { id: "covenant", name: "Covenant University", short_name: "CU", type: "university", state: "Ogun" },
  { id: "futa", name: "Federal University of Technology, Akure", short_name: "FUTA", type: "university", state: "Ondo" },
  { id: "uniben", name: "University of Benin", short_name: "UNIBEN", type: "university", state: "Edo" },
  { id: "unilorin", name: "University of Ilorin", short_name: "UNILORIN", type: "university", state: "Kwara" },
  { id: "babcock", name: "Babcock University", short_name: "Babcock", type: "university", state: "Ogun" },
];

export const COURSES: Course[] = [
  { id: "csc101", code: "CSC101", name: "Data Structures", description: "Arrays, stacks, queues, trees, graphs and their applications.", exam_type: "university", department: "Computer Science", icon: "BookOpen", color: "#4F46E5", total_questions: 120, total_quizzes: 26, rating: 4.8 },
  { id: "csc201", code: "CSC201", name: "Operating Systems", description: "Process management, memory, file systems, concurrency.", exam_type: "university", department: "Computer Science", icon: "Cpu", color: "#22C55E", total_questions: 95, total_quizzes: 18, rating: 4.7 },
  { id: "csc301", code: "CSC301", name: "Database Systems", description: "Relational databases, SQL, normalization, transactions.", exam_type: "university", department: "Computer Science", icon: "Database", color: "#8B5CF6", total_questions: 110, total_quizzes: 22, rating: 4.8 },
  { id: "csc401", code: "CSC401", name: "Computer Networks", description: "TCP/IP, OSI model, routing and network security.", exam_type: "university", department: "Computer Science", icon: "Globe", color: "#F97316", total_questions: 80, total_quizzes: 16, rating: 4.6 },
  { id: "csc501", code: "CSC501", name: "Web Development", description: "HTML, CSS, JavaScript, React and modern frameworks.", exam_type: "university", department: "Computer Science", icon: "Code", color: "#10B981", total_questions: 100, total_quizzes: 20, rating: 4.9 },
  { id: "alg101", code: "ALG101", name: "Algorithms", description: "Sorting, searching, dynamic programming, complexity.", exam_type: "university", department: "Computer Science", icon: "GitBranch", color: "#EC4899", total_questions: 95, total_quizzes: 19, rating: 4.8 },
  { id: "mth101", code: "MTH101", name: "Discrete Mathematics", description: "Logic, sets, combinatorics, graph theory and proofs.", exam_type: "university", department: "Mathematics", icon: "Calculator", color: "#A855F7", total_questions: 75, total_quizzes: 15, rating: 4.5 },
  { id: "phy101", code: "PHY101", name: "Physics", description: "Mechanics, thermodynamics, waves and electromagnetism.", exam_type: "university", department: "Physics", icon: "Atom", color: "#F59E0B", total_questions: 90, total_quizzes: 12, rating: 4.4 },
  { id: "se101", code: "SE101", name: "Software Engineering", description: "SDLC, design patterns, agile and project management.", exam_type: "university", department: "Computer Science", icon: "Settings", color: "#6366F1", total_questions: 70, total_quizzes: 14, rating: 4.6 },
  { id: "ai101", code: "AI101", name: "Artificial Intelligence", description: "Search algorithms, machine learning, neural networks.", exam_type: "university", department: "Computer Science", icon: "Brain", color: "#0EA5E9", total_questions: 85, total_quizzes: 17, rating: 4.9 },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1", course_id: "csc101", topic_id: "stacks", topic_name: "Stacks & Queues",
    question_text: "Which data structure uses the LIFO (Last In First Out) principle?",
    difficulty: "easy",
    explanation: "A Stack follows LIFO — the last element inserted is the first one removed. Think of a stack of plates: you always take from the top.",
    options: [
      { id: "q1a", label: "A", text: "Queue", is_correct: false },
      { id: "q1b", label: "B", text: "Stack", is_correct: true },
      { id: "q1c", label: "C", text: "Linked List", is_correct: false },
      { id: "q1d", label: "D", text: "Tree", is_correct: false },
    ], exam_source: "JAMB 2022",
  },
  {
    id: "q2", course_id: "csc101", topic_id: "complexity", topic_name: "Time Complexity",
    question_text: "What is the time complexity of binary search on a sorted array?",
    difficulty: "medium",
    explanation: "Binary search divides the search interval in half each step. With n elements, it takes at most log₂(n) steps — hence O(log n).",
    options: [
      { id: "q2a", label: "A", text: "O(1)", is_correct: false },
      { id: "q2b", label: "B", text: "O(log n)", is_correct: true },
      { id: "q2c", label: "C", text: "O(n)", is_correct: false },
      { id: "q2d", label: "D", text: "O(n²)", is_correct: false },
    ],
  },
  {
    id: "q3", course_id: "csc101", topic_id: "arrays", topic_name: "Arrays",
    question_text: "Which operation is O(n) on a dynamic array?",
    difficulty: "easy",
    explanation: "Inserting at the beginning of an array requires shifting all n elements one position to the right, making it an O(n) operation.",
    options: [
      { id: "q3a", label: "A", text: "Access by index", is_correct: false },
      { id: "q3b", label: "B", text: "Update by index", is_correct: false },
      { id: "q3c", label: "C", text: "Insert at beginning", is_correct: true },
      { id: "q3d", label: "D", text: "Get length", is_correct: false },
    ],
  },
  {
    id: "q4", course_id: "csc101", topic_id: "trees", topic_name: "Trees",
    question_text: "In a Binary Search Tree, where are values smaller than the root stored?",
    difficulty: "easy",
    explanation: "In a BST, all values in the left subtree are less than the root, and all values in the right subtree are greater.",
    options: [
      { id: "q4a", label: "A", text: "Right subtree", is_correct: false },
      { id: "q4b", label: "B", text: "Left subtree", is_correct: true },
      { id: "q4c", label: "C", text: "Root level", is_correct: false },
      { id: "q4d", label: "D", text: "Randomly placed", is_correct: false },
    ],
  },
  {
    id: "q5", course_id: "csc101", topic_id: "graphs", topic_name: "Graphs",
    question_text: "Which algorithm is best suited for finding the shortest path in an unweighted graph?",
    difficulty: "medium",
    explanation: "Breadth-First Search (BFS) explores nodes level by level, guaranteeing the shortest path in unweighted graphs.",
    options: [
      { id: "q5a", label: "A", text: "Depth-First Search", is_correct: false },
      { id: "q5b", label: "B", text: "Breadth-First Search", is_correct: true },
      { id: "q5c", label: "C", text: "Dijkstra's Algorithm", is_correct: false },
      { id: "q5d", label: "D", text: "Prim's Algorithm", is_correct: false },
    ],
  },
  {
    id: "q6", course_id: "csc101", topic_id: "complexity", topic_name: "Time Complexity",
    question_text: "What is the worst-case time complexity of QuickSort?",
    difficulty: "hard",
    explanation: "QuickSort's worst case occurs when the pivot always picks the largest or smallest element (e.g., already sorted array). This results in O(n²) comparisons.",
    options: [
      { id: "q6a", label: "A", text: "O(n log n)", is_correct: false },
      { id: "q6b", label: "B", text: "O(n)", is_correct: false },
      { id: "q6c", label: "C", text: "O(n²)", is_correct: true },
      { id: "q6d", label: "D", text: "O(log n)", is_correct: false },
    ],
  },
  {
    id: "q7", course_id: "csc101", topic_id: "stacks", topic_name: "Stacks & Queues",
    question_text: "A queue follows which principle?",
    difficulty: "easy",
    explanation: "A Queue follows FIFO (First In First Out) — elements are added to the back and removed from the front.",
    options: [
      { id: "q7a", label: "A", text: "LIFO", is_correct: false },
      { id: "q7b", label: "B", text: "FIFO", is_correct: true },
      { id: "q7c", label: "C", text: "Random access", is_correct: false },
      { id: "q7d", label: "D", text: "Sorted order", is_correct: false },
    ],
  },
  {
    id: "q8", course_id: "csc101", topic_id: "trees", topic_name: "Trees",
    question_text: "What is the maximum number of nodes in a binary tree of height h?",
    difficulty: "medium",
    explanation: "A full binary tree of height h has 2^(h+1) - 1 nodes. Each level i can have at most 2^i nodes.",
    options: [
      { id: "q8a", label: "A", text: "2h", is_correct: false },
      { id: "q8b", label: "B", text: "2^h", is_correct: false },
      { id: "q8c", label: "C", text: "2^(h+1) - 1", is_correct: true },
      { id: "q8d", label: "D", text: "h²", is_correct: false },
    ],
  },
  {
    id: "q9", course_id: "csc101", topic_id: "arrays", topic_name: "Arrays",
    question_text: "Which sorting algorithm has the best average-case time complexity?",
    difficulty: "medium",
    explanation: "Merge Sort and HeapSort both guarantee O(n log n) in all cases. QuickSort also averages O(n log n) but can degrade to O(n²).",
    options: [
      { id: "q9a", label: "A", text: "Bubble Sort — O(n²)", is_correct: false },
      { id: "q9b", label: "B", text: "Merge Sort — O(n log n)", is_correct: true },
      { id: "q9c", label: "C", text: "Selection Sort — O(n²)", is_correct: false },
      { id: "q9d", label: "D", text: "Insertion Sort — O(n²)", is_correct: false },
    ],
  },
  {
    id: "q10", course_id: "csc101", topic_id: "graphs", topic_name: "Graphs",
    question_text: "Which data structure is typically used to implement BFS?",
    difficulty: "easy",
    explanation: "BFS uses a Queue (FIFO) to track which node to visit next. Nodes are enqueued when discovered and dequeued when processed.",
    options: [
      { id: "q10a", label: "A", text: "Stack", is_correct: false },
      { id: "q10b", label: "B", text: "Queue", is_correct: true },
      { id: "q10c", label: "C", text: "Priority Queue", is_correct: false },
      { id: "q10d", label: "D", text: "Linked List", is_correct: false },
    ],
  },
];

export const MOCK_QUIZ_HISTORY: Quiz[] = [
  { id: "qz1", user_id: "u1", course_id: "csc101", course_name: "Data Structures", status: "completed", mode: "quiz", total_questions: 20, time_limit_seconds: 1200, time_taken_seconds: 1125, difficulty: "medium", score_percent: 85, correct_count: 17, incorrect_count: 3, skipped_count: 0, started_at: "2026-04-29T10:00:00Z", completed_at: "2026-04-29T10:18:45Z" },
  { id: "qz2", user_id: "u1", course_id: "csc201", course_name: "Operating Systems", status: "completed", mode: "quiz", total_questions: 20, time_limit_seconds: 1200, time_taken_seconds: 930, difficulty: "medium", score_percent: 72, correct_count: 14, incorrect_count: 6, skipped_count: 0, started_at: "2026-04-28T14:00:00Z", completed_at: "2026-04-28T14:15:30Z" },
  { id: "qz3", user_id: "u1", course_id: "csc301", course_name: "Database Systems", status: "completed", mode: "quiz", total_questions: 20, time_limit_seconds: 1200, time_taken_seconds: 1210, difficulty: "hard", score_percent: 65, correct_count: 13, incorrect_count: 7, skipped_count: 0, started_at: "2026-04-27T16:00:00Z", completed_at: "2026-04-27T16:20:10Z" },
  { id: "qz4", user_id: "u1", course_id: "csc101", course_name: "Data Structures", status: "completed", mode: "study", total_questions: 15, difficulty: "easy", score_percent: 93, correct_count: 14, incorrect_count: 1, skipped_count: 0, started_at: "2026-04-26T09:00:00Z", completed_at: "2026-04-26T09:25:00Z" },
  { id: "qz5", user_id: "u1", course_id: "alg101", course_name: "Algorithms", status: "completed", mode: "quiz", total_questions: 20, time_limit_seconds: 1200, time_taken_seconds: 1050, difficulty: "hard", score_percent: 58, correct_count: 11, incorrect_count: 8, skipped_count: 1, started_at: "2026-04-25T11:00:00Z", completed_at: "2026-04-25T11:17:30Z" },
  { id: "qz6", user_id: "u1", course_id: "csc401", course_name: "Computer Networks", status: "completed", mode: "quiz", total_questions: 20, time_limit_seconds: 1200, time_taken_seconds: 800, difficulty: "medium", score_percent: 78, correct_count: 15, incorrect_count: 4, skipped_count: 1, started_at: "2026-04-24T15:00:00Z", completed_at: "2026-04-24T15:13:20Z" },
];

export const SCORE_OVER_TIME: ScoreOverTime[] = [
  { date: "Apr 20", score: 62 }, { date: "Apr 21", score: 58 }, { date: "Apr 22", score: 70 },
  { date: "Apr 23", score: 65 }, { date: "Apr 24", score: 78 }, { date: "Apr 25", score: 58 },
  { date: "Apr 26", score: 93 }, { date: "Apr 27", score: 65 }, { date: "Apr 28", score: 72 },
  { date: "Apr 29", score: 85 },
];

export const TOPIC_ANALYTICS: TopicAnalytics[] = [
  { topic_id: "arrays", topic_name: "Arrays", total_questions: 24, correct: 20, accuracy: 83 },
  { topic_id: "stacks", topic_name: "Stacks & Queues", total_questions: 18, correct: 16, accuracy: 89 },
  { topic_id: "trees", topic_name: "Trees", total_questions: 20, correct: 14, accuracy: 70 },
  { topic_id: "graphs", topic_name: "Graphs", total_questions: 16, correct: 9, accuracy: 56 },
  { topic_id: "complexity", topic_name: "Time Complexity", total_questions: 22, correct: 15, accuracy: 68 },
];

export const COURSE_PROGRESS: UserCourseProgress[] = [
  { user_id: "u1", course_id: "csc101", course_name: "Data Structures", progress_percent: 72, total_quizzes: 12, average_score: 78, highest_score: 93, last_practiced_at: "2026-04-29T10:00:00Z" },
  { user_id: "u1", course_id: "csc201", course_name: "Operating Systems", progress_percent: 45, total_quizzes: 6, average_score: 68, highest_score: 72, last_practiced_at: "2026-04-28T14:00:00Z" },
  { user_id: "u1", course_id: "csc301", course_name: "Database Systems", progress_percent: 30, total_quizzes: 4, average_score: 62, highest_score: 65, last_practiced_at: "2026-04-27T16:00:00Z" },
  { user_id: "u1", course_id: "alg101", course_name: "Algorithms", progress_percent: 20, total_quizzes: 3, average_score: 55, highest_score: 58, last_practiced_at: "2026-04-25T11:00:00Z" },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: "l1", full_name: "Chukwuemeka Obi", score: 9850, quizzes_completed: 48, streak: 21 },
  { rank: 2, user_id: "l2", full_name: "Amara Nwosu", score: 9210, quizzes_completed: 42, streak: 18 },
  { rank: 3, user_id: "l3", full_name: "Tunde Adeleke", score: 8790, quizzes_completed: 39, streak: 14 },
  { rank: 4, user_id: "l4", full_name: "Ngozi Eze", score: 8340, quizzes_completed: 36, streak: 12 },
  { rank: 5, user_id: "l5", full_name: "Bola Fashola", score: 7980, quizzes_completed: 33, streak: 10 },
  { rank: 6, user_id: "u1", full_name: "You", score: 7540, quizzes_completed: 30, streak: 7, is_current_user: true },
  { rank: 7, user_id: "l7", full_name: "Kemi Adeyemi", score: 7210, quizzes_completed: 28, streak: 8 },
  { rank: 8, user_id: "l8", full_name: "Emeka Okafor", score: 6890, quizzes_completed: 25, streak: 5 },
  { rank: 9, user_id: "l9", full_name: "Sola Adebayo", score: 6540, quizzes_completed: 22, streak: 4 },
  { rank: 10, user_id: "l10", full_name: "Funmi Olawale", score: 6100, quizzes_completed: 20, streak: 3 },
];

export const MOCK_BOOKMARKS: Bookmark[] = [
  { id: "bm1", user_id: "u1", question_id: "q1", question: SAMPLE_QUESTIONS[0], bookmark_type: "question", created_at: "2026-04-29T10:30:00Z" },
  { id: "bm2", user_id: "u1", question_id: "q2", question: SAMPLE_QUESTIONS[1], bookmark_type: "explanation", created_at: "2026-04-28T15:00:00Z" },
  { id: "bm3", user_id: "u1", question_id: "q4", question: SAMPLE_QUESTIONS[3], bookmark_type: "question", created_at: "2026-04-27T12:00:00Z" },
  { id: "bm4", user_id: "u1", question_id: "q6", question: SAMPLE_QUESTIONS[5], bookmark_type: "explanation", note: "Review for final exam", created_at: "2026-04-26T09:00:00Z" },
];

export const TESTIMONIALS = [
  { name: "Adaeze Okonkwo", school: "UNILAG", text: "ExamQuest helped me score 287 in UTME. The practice questions are so similar to the real exam!", avatar: "AO" },
  { name: "Tunde Fashola", school: "OAU", text: "I was failing my Data Structures course. After 3 weeks on ExamQuest, I scored a B+. The explanations are excellent.", avatar: "TF" },
  { name: "Chioma Eze", school: "UI", text: "The streak feature keeps me consistent. I haven't missed a day of study in 30 days. My grades improved massively.", avatar: "CE" },
  { name: "Emeka Obi", school: "UNIBEN", text: "Best exam prep platform in Nigeria. The WAEC past questions cover every topic in the syllabus.", avatar: "EO" },
  { name: "Fatima Musa", school: "ABU", text: "The analytics dashboard shows exactly where I'm weak. I know what to study every time I open the app.", avatar: "FM" },
];

export const FAQ = [
  { q: "Is ExamQuest free to use?", a: "Yes! ExamQuest has a free tier with access to past questions and basic analytics. Premium unlocks unlimited practice, AI explanations, and detailed analytics." },
  { q: "Which exams does ExamQuest cover?", a: "We cover WAEC, NECO, JAMB UTME, Post-UTME, and University-level courses across all major Nigerian universities." },
  { q: "How up-to-date are the questions?", a: "Our question bank is updated after every exam season with the latest past questions and new likely questions generated by our content team." },
  { q: "Can I use ExamQuest offline?", a: "Not yet — ExamQuest requires an internet connection. Offline mode is planned for a future update." },
  { q: "How is my score calculated?", a: "Your score is the percentage of correct answers. In quiz mode, unanswered questions count as incorrect. In study mode, you can retry questions." },
  { q: "Which universities are supported for Post-UTME?", a: "We currently support 50+ universities including UNILAG, UI, OAU, UNN, ABU, UNIBEN, FUTA, Covenant University, and more. We add new schools every month." },
];
