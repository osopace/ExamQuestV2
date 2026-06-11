import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "onboarding@resend.dev";
const APP_URL = "https://examquest.vercel.app";
const TEST_EMAIL = Deno.env.get("RESEND_TEST_EMAIL");

function buildEmail(name: string): string {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#6366f1;padding:32px 40px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">ExamQuest</h1>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Your exam prep companion</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#111827;margin-top:0;font-size:20px;">Hey ${name}! 👋</h2>
        <p style="color:#6b7280;font-size:16px;line-height:1.6;margin:0 0 24px;">
          Your daily quiz is waiting. A few questions today keeps your streak alive and your exam score climbing.
        </p>
        <div style="background:#f9fafb;border-radius:10px;padding:20px;margin:0 0 28px;">
          <p style="margin:0;color:#374151;font-size:15px;font-weight:600;">Why quiz daily?</p>
          <ul style="margin:10px 0 0;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
            <li>Builds long-term memory through spaced repetition</li>
            <li>Keeps your streak and leaderboard rank intact</li>
            <li>Identifies weak areas before exam day</li>
          </ul>
        </div>
        <div style="text-align:center;margin:0 0 32px;">
          <a href="${APP_URL}/practice" style="background:#6366f1;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">Start Today's Quiz →</a>
        </div>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;" />
        <p style="color:#9ca3af;font-size:13px;margin:0;text-align:center;">
          You're receiving this because you have daily quiz reminders enabled.<br/>
          <a href="${APP_URL}/settings" style="color:#6366f1;text-decoration:none;">Manage notification preferences</a>
        </p>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, name: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TEST_EMAIL ?? to,
      subject: `${name}, your daily quiz is waiting! 📚`,
      html: buildEmail(name),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body };
  }
  return { ok: true };
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("user_id, email_notifications, push_notifications")
      .eq("quiz_reminders", true);

    if (settingsError) {
      return new Response(JSON.stringify({ error: settingsError.message }), { status: 500 });
    }

    if (!settings || settings.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No users to notify" }), { status: 200 });
    }

    const userIds = settings.map((s) => s.user_id);

    // Fetch matching profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    if (profilesError) {
      return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 });
    }

    let sent = 0;
    const failures: { id: string; email: string; error?: string }[] = [];

    for (const profile of profiles ?? []) {
      const userSetting = settings.find((s) => s.user_id === profile.id);

      if (profile.email && userSetting?.email_notifications) {
        const result = await sendEmail(profile.email, profile.full_name ?? "Student");
        if (result.ok) {
          sent++;
        } else {
          failures.push({ id: profile.id, email: profile.email, error: result.error });
        }
      }

      if (userSetting?.push_notifications) {
        await supabase.from("notifications").insert({
          user_id: profile.id,
          type: "quiz_reminder",
          title: "Daily Quiz Ready 📚",
          body: "Your daily quiz is waiting. Keep your streak alive and your exam score climbing!",
        });
      }
    }

    return new Response(
      JSON.stringify({ sent, failed: failures.length, failures }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});
