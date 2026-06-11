"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { supabase } from "@/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        ExamQuest
      </div>

      {sent ? (
        /* ── Success state ── */
        <div className="animate-scale-in">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle size={30} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-2">
            We sent a password reset link to
          </p>
          <p className="font-semibold text-primary-600 mb-6 break-all">{email}</p>
          <p className="text-sm text-gray-500 mb-8">
            Click the link in the email to set a new password. The link expires in 1 hour. Check your spam folder if you don't see it.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline font-medium"
          >
            <ArrowLeft size={15} /> Back to sign in
          </Link>
        </div>
      ) : (
        /* ── Form state ── */
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
            <p className="text-gray-600">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              leftIcon={<Mail size={16} />}
              error={error}
            />
            <Button type="submit" fullWidth loading={loading}>
              Send reset link
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
