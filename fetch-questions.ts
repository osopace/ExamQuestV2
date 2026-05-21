import { createClient } from "@supabase/supabase-js";
import ws from "ws";

// ---- YOUR CREDENTIALS ----
const ALOC_TOKEN = "ALOC-6738e12d462825eb8707";
const SUPABASE_URL = "https://vqiuciiowlfhyghadyhg.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaXVjaWlvd2xmaHlnaGFkeWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDIwOSwiZXhwIjoyMDkzNTU2MjA5fQ.mqgYj_EFpQNTG7CjaY0--lf3HF52aOsW0pXQhdF-yzI";

const SUBJECTS: string[] = [
  "english",
  "mathematics",
  "biology",
  "physics",
  "chemistry",
  "economics",
  "government",
  "geography",
  "commerce",
  "accounting",
  "crk",
  "irk",
  "civiledu",
  "englishlit",
  "insurance",
  "history",
];

const EXAM_TYPES: string[] = ["wassce", "utme", "post-utme", "neco"];
const YEARS: number[] = Array.from({ length: 30 }, (_, i) => 1993 + i);
const DELAY_MS = 500;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  realtime: {
    transport: ws as any,
  },
});
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFromALOC(subject: string, examType: string, year: number) {
  const url = `https://questions.aloc.com.ng/api/v2/m?subject=${subject}&type=${examType}&year=${year}`;
  try {
    const res = await fetch(url, {
      headers: {
        AccessToken: ALOC_TOKEN,
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const raw = json?.data;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  } catch (err: any) {
    console.warn(
      `  ⚠️  Error for ${subject}/${examType}/${year}:`,
      err.message,
    );
    return [];
  }
}

async function saveBatch(
  questions: any[],
  subject: string,
  examType: string,
  year: number,
) {
  if (questions.length === 0) return;

  const rows = questions.map((q) => ({
    aloc_id: String(q.id),
    subject: subject, // 👈 use the loop variable directly
    exam_type: examType, // 👈 use the loop variable directly
    year: year, // 👈 use the loop variable directly
    question_text: q.question || "",
    option_a: q.option?.a || null,
    option_b: q.option?.b || null,
    option_c: q.option?.c || null,
    option_d: q.option?.d || null,
    correct: q.answer?.toLowerCase() || null,
    explanation: q.solution || null,
  }));

  const { error } = await supabase
    .from("questions")
    .upsert(rows, { onConflict: "aloc_id,subject,exam_type", ignoreDuplicates: true });

  if (error) throw new Error(error.message);
}

async function main() {
  console.log("🚀 Starting question fetch...\n");
  let totalSaved = 0;
  const totalCombinations = SUBJECTS.length * EXAM_TYPES.length * YEARS.length;
  let current = 0;

  for (const subject of SUBJECTS) {
    for (const examType of EXAM_TYPES) {
      for (const year of YEARS) {
        current++;
        process.stdout.write(
          `[${current}/${totalCombinations}] ${subject}/${examType}/${year}... `,
        );

        const questions = await fetchFromALOC(subject, examType, year);
        if (questions.length > 0) {
          try {
            await saveBatch(questions, subject, examType, year);
            totalSaved += questions.length;
            console.log(`✅ ${questions.length} processed`);
          } catch (err: any) {
            console.error(`  ❌ DB error: ${err.message}`);
          }
        } else {
          console.log("(no results)");
        }
        await sleep(DELAY_MS);
      }
    }
  }
  console.log(`\n🎉 Done! Total questions processed: ${totalSaved}`);
}

main().catch(console.error);
