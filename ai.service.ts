import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ProcessingQuestion,
  EnrichmentResult,
  AIQuestionResponse,
} from "./etl";
import { logger } from "./logger";

export class AIService {
  private groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  private gemini = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!,
  ).getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  private generatePrompt(questions: ProcessingQuestion[]): string {
    return `You are a professional Nigerian teacher. Analyze these 10 exam questions.
    For each, provide: 
    1. Topic (from NERDC syllabus)
    2. Difficulty (easy, medium, hard)
    3. A clear explanation.
    
    Return ONLY a JSON array:
    ${JSON.stringify(questions.map((q) => ({ id: q.id, text: q.question_text })))}
    
    Expected format: [{"id": "...", "topic": "...", "difficulty": "...", "explanation": "..."}]`;
  }

  async enrichBatch(
    questions: ProcessingQuestion[],
  ): Promise<EnrichmentResult> {
    const prompt = this.generatePrompt(questions);

    // Attempt 1: Groq
    try {
      const res = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      const results = JSON.parse(
        res.choices[0].message.content!,
      ) as AIQuestionResponse[];
      return { results, provider: "groq" };
    } catch (e) {
      logger.warn("Groq failed, switching to Gemini...");
    }

    // Attempt 2: Gemini
    try {
      const result = await this.gemini.generateContent(prompt);
      const results = JSON.parse(
        result.response.text(),
      ) as AIQuestionResponse[];
      return { results, provider: "gemini" };
    } catch (e) {
      logger.error("All AI providers failed.");
      throw new Error("AI_CHAIN_BROKEN");
    }
  }
}
