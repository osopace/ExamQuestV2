import { createClient } from "@supabase/supabase-js";

const env = (globalThis as any).Deno?.env;
const SUPABASE_URL = env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")!;

env.serve(async (req: any) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the caller's JWT and get their user ID
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = user.id;

  try {
    // Delete all user data in dependency order
    await supabaseAdmin.from("notifications").delete().eq("user_id", userId);
    await supabaseAdmin.from("bookmarks").delete().eq("user_id", userId);
    await supabaseAdmin.from("quizzes").delete().eq("user_id", userId);
    await supabaseAdmin.from("user_settings").delete().eq("user_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // Delete the Supabase Auth user (requires service role)
    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw new Error(deleteError.message);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});
