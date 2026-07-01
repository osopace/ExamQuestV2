import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

/**
 * Callback handler for magic link verification
 * Processes the token from the magic link and creates a session
 *
 * Flow:
 * 1. User clicks magic link from email: /auth/callback?code=xxx&type=signup
 * 2. This handler extracts the code
 * 3. Exchanges code for a session via Supabase
 * 4. Redirects to dashboard (or onboarding)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error.message);
        return NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent(error.message)}`,
            requestUrl.origin,
          ),
        );
      }

      // Success - redirect to dashboard or requested page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (err) {
      console.error("Callback error:", err);
      return NextResponse.redirect(
        new URL("/login?error=Authentication failed", requestUrl.origin),
      );
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
