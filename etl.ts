export type Difficulty = "easy" | "medium" | "hard";

export interface AIQuestionResponse {
  id: string;
  topic: string;
  difficulty: Difficulty;
  explanation: string;
}

export interface EnrichmentResult {
  results: AIQuestionResponse[];
  provider: "groq" | "gemini";
}

export interface ProcessingQuestion {
  id: string;
  question_text: string;
  options: string[];
  subject: string;
}
