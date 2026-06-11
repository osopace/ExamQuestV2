import { createClient } from "@supabase/supabase-js";
import { AIService } from "./ai.service";
import { logger } from "./logger";
import "dotenv/config";

const BATCH_SIZE = 10;
const CONCURRENT_BATCHES = 3; // Reduced for safety; 3 parallel requests is usually safe for most tiers
const BURST_DELAY_MS = 2000; // Wait 2 seconds between bursts to avoid RPM limits

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const ai = new AIService();

async function getOrCreateTopicId(
  name: string,
  subject: string,
  examType: string,
) {
  const { data } = await supabase
    .from("topics")
    .select("id")
    .eq("name", name)
    .eq("subject_id", subject)
    .maybeSingle();

  if (data) return data.id;

  const { data: newTopic } = await supabase
    .from("topics")
    .insert({ name, subject_id: subject, exam_types: [examType] })
    .select("id")
    .single();

  return newTopic?.id ?? null;
}

async function processBatch(batch: any[]) {
  const processingData = batch.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
    subject: q.subject,
  }));

  const { results, provider } = await ai.enrichBatch(processingData);

  for (const res of results) {
    const original = batch.find((q) => q.id === res.id);
    if (!original) continue;

    const topicId = await getOrCreateTopicId(
      res.topic,
      original.subject,
      original.exam_type,
    );

    await supabase
      .from("questions")
      .update({
        difficulty: res.difficulty,
        ai_explanation: res.explanation,
        ai_provider: provider,
        ai_processed: true,
        ai_processed_at: new Date().toISOString(),
        topic_id: topicId,
      })
      .eq("id", res.id);
  }
  logger.success(`Batch of ${batch.length} completed via ${provider}`);
}

const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

async function main() {
  logger.info(
    `🤖 Starting AI Enrichment Job (Concurrency: ${CONCURRENT_BATCHES}, Batch Size: ${BATCH_SIZE})...`,
  );

  while (true) {
    const { data: records, error } = await supabase
      .from("questions")
      .select(
        "id, question_text, option_a, option_b, option_c, option_d, subject, exam_type",
      )
      .eq("ai_processed", false)
      .limit(BATCH_SIZE * CONCURRENT_BATCHES);

    if (error) {
      logger.error(`Failed to fetch records: ${error.message}`);
      process.exit(1);
    }

    if (!records || records.length === 0) {
      logger.info("🏁 No more questions to process.");
      break;
    }

    const batches = chunkArray(records, BATCH_SIZE);

    try {
      await Promise.all(batches.map((b) => processBatch(b)));

      if (records.length < BATCH_SIZE * CONCURRENT_BATCHES) {
        logger.info("🏁 All remaining questions processed.");
        break;
      }

      // Wait a moment between bursts to respect AI rate limits
      await new Promise((resolve) => setTimeout(resolve, BURST_DELAY_MS));
    } catch (err: any) {
      logger.error(`HARD STOP: ${err.message}`);
      process.exit(1);
    }
  }
}

main().catch((err) => logger.error(err.message));
