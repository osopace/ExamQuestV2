import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "onboarding@resend.dev";
const APP_URL = "https://examquest.vercel.app";
const TEST_EMAIL = Deno.env.get("RESEND_TEST_EMAIL");

interface WeekStats {
  quizCount: number;
  avgScore: number;
  bestScore: number;
  streak: number;
}

function buildEmail(name: string, stats: WeekStats): string {
  const scoreColor = stats.avgScore >= 70 ? "#16a34a" : stats.avgScore >= 50 ? "#d97706" : "#dc2626";
  const scoreEmoji = stats.avgScore >= 70 ? "🟢" : stats.avgScore >= 50 ? "🟡" : "🔴";
  const hasActivity = stats.quizCount > 0;

  const activitySection = hasActivity
    ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 28px;">
        <div style="background:#f9fafb;border-radius:10px;padding:18px;text-align:center;">
          <p style="margin:0;font-size:28px;font-weight:700;color:#111827;">${stats.quizCount}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Quizzes Completed</p>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:18px;text-align:center;">
          <p style="margin:0;font-size:28px;font-weight:700;color:${scoreColor};">${stats.avgScore}%</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Average Score ${scoreEmoji}</p>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:18px;text-align:center;">
          <p style="margin:0;font-size:28px;font-weight:700;color:#6366f1;">${stats.bestScore}%</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Best Score 🏆</p>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:18px;text-align:center;">
          <p style="margin:0;font-size:28px;font-weight:700;color:#f59e0b;">${stats.streak}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Day Streak 🔥</p>
        </div>
      </div>
    `
    : `
      <div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:20px;margin:0 0 28px;text-align:center;">
        <p style="margin:0;font-size:32px;">😴</p>
        <p style="margin:8px 0 0;color:#854d0e;font-weight:600;">No quizzes this week</p>
        <p style="margin:6px 0 0;color:#92400e;font-size:14px;">Start strong this week — even one quiz a day adds up!</p>
      </div>
    `;

  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#6366f1;padding:32px 40px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">ExamQuest</h1>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Weekly Performance Digest</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#111827;margin-top:0;font-size:20px;">Your week in review, ${name} 📊</h2>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Here's how you performed over the last 7 days.
        </p>
        ${activitySection}
        <div style="text-align:center;margin:0 0 32px;">
          <a href="${APP_URL}/analytics" style="background:#6366f1;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">View Full Analytics →</a>
        </div>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;" />
        <p style="color:#9ca3af;font-size:13px;margin:0;text-align:center;">
          You're receiving this because you have performance updates enabled.<br/>
          <a href="${APP_URL}/settings" style="color:#6366f1;text-decoration:none;">Manage notification preferences</a>
        </p>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, name: string, stats: WeekStats): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TEST_EMAIL ?? to,
      subject: `${name}'s weekly performance digest 📊`,
      html: buildEmail(name, stats),
    }),
  });
  return res.ok;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("user_id, email_notifications, push_notifications")
      .eq("performance_updates", true);

    if (settingsError) {
      return new Response(JSON.stringify({ error: settingsError.message }), { status: 500 });
    }

    if (!settings || settings.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No users to notify" }), { status: 200 });
    }

    const userIds = settings.map((s) => s.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, current_streak")
      .in("id", userIds);

    if (profilesError) {
      return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 });
    }

    // Last 7 days window
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let sent = 0;
    const failures: { id: string }[] = [];

    for (const profile of profiles ?? []) {
      const userSetting = settings.find((s: { user_id: string; email_notifications: boolean; push_notifications: boolean }) => s.user_id === profile.id);

      const { data: quizzes } = await supabase
        .from("quizzes")
        .select("score_percent")
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .gte("completed_at", sevenDaysAgo);

      const quizCount = quizzes?.length ?? 0;
      const scores = (quizzes ?? []).map((q) => q.score_percent ?? 0);
      const avgScore = quizCount > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / quizCount) : 0;
      const bestScore = quizCount > 0 ? Math.round(Math.max(...scores)) : 0;

      const stats: WeekStats = {
        quizCount,
        avgScore,
        bestScore,
        streak: profile.current_streak ?? 0,
      };

      if (profile.email && userSetting?.email_notifications) {
        const ok = await sendEmail(profile.email, profile.full_name ?? "Student", stats);
        if (ok) {
          sent++;
        } else {
          failures.push({ id: profile.id });
        }
      }

      if (userSetting?.push_notifications) {
        const digestBody = quizCount > 0
          ? `You completed ${quizCount} quiz${quizCount > 1 ? "zes" : ""} this week with an avg score of ${avgScore}%. Best: ${bestScore}%.`
          : "No quizzes this week. Start strong — even one quiz a day adds up!";
        await supabase.from("notifications").insert({
          user_id: profile.id,
          type: "performance_digest",
          title: "Weekly Digest 📊",
          body: digestBody,
        });
      }
    }

    return new Response(
      JSON.stringify({ sent, failed: failures.length, failures }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});
