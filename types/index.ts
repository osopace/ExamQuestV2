export type ExamType = "wassce" | "neco" | "utme" | "post-utme" | "university";
export type Theme = "light" | "dark" | "system";
export type Difficulty = "easy" | "medium" | "hard" | "mixed";
export type QuizStatus = "in_progress" | "completed" | "abandoned";
export type QuizMode = "quiz" | "study";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  exam_type?: ExamType;
  school_id?: string;
  school_name?: string;
  enrolled_course_ids: string[];
  current_streak: number;
  longest_streak: number;
  last_active_date?: string;
  is_premium: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}
export interface StepTwoProps {
  examType: ExamType | null;
  schoolId: string;
  setSchoolId: (id: string) => void;
  selectedCourses: string[];
  filteredCourses: Course[];
  toggleCourse: (id: string) => void;
  loading: boolean;
  onBack: () => void;
  onFinish: () => void;
}

export interface School {
  id: string;
  name: string;
  short_name: string;
  type: "university" | "polytechnic" | "college";
  state: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  exam_type: ExamType;
  icon: string;
  color: string;
  total_questions: number;

  total_quizzes: number;
}

export interface Topic {
  id: string;
  course_id: string;
  name: string;
  total_questions: number;
}

export interface QuestionOption {
  id: string;
  label: "A" | "B" | "C" | "D";
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  course_id: string;
  course_name: string;
  topic_name?: string;
  question_text: string;
  difficulty: Difficulty;
  explanation: string;
  options: QuestionOption[];
  exam_source?: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  course_id: string;
  course_name: string;
  status: QuizStatus;
  mode: QuizMode;
  total_questions: number;
  time_limit_seconds?: number;
  time_taken_seconds?: number;
  difficulty: Difficulty;
  score_percent?: number;
  correct_count: number;
  incorrect_count: number;
  skipped_count: number;
  started_at: string;
  completed_at?: string;
}

export interface QuizAnswer {
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
  is_flagged: boolean;
  question_order: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  question?: Question;
  bookmark_type: "question" | "explanation";
  note?: string;
  created_at: string;
}

export interface UserCourseProgress {
  user_id: string;
  course_id: string;
  course_name: string;
  progress_percent: number;
  total_quizzes: number;
  average_score: number;
  highest_score: number;
  last_practiced_at?: string;
}

export interface UserSettings {
  user_id: string;
  quiz_reminders: boolean;
  study_reminders: boolean;
  performance_updates: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  profile_visibility: boolean;
  show_progress: boolean;
  allow_messages: boolean;
  usage_data: boolean;
  personalized_recs: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  score: number;
  quizzes_completed: number;
  streak: number;
  is_current_user?: boolean;
}

export interface ScoreOverTime {
  date: string;
  score: number;
}

export interface TopicAnalytics {
  course_id: string;
  course_name: string;
  total_questions: number;
  correct: number;
  accuracy: number;
}
export interface SchoolCourse {
  course_id: string;
  name: string;
  description: string;
  exam_type: ExamType;
  department: string;
}
