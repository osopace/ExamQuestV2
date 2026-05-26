"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, BookOpen, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { supabase } from "@/supabase/client";
import toast from "react-hot-toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  // Supabase fires PASSWORD_RECOVERY when the user arrives via the reset link.
  // The session is established automatically from the URL hash.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="animate-scale-in text-center">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={30} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password updated!</h1>
        <p className="text-gray-500 text-sm mb-6">You're all set. Taking you to your dashboard…</p>
        <div className="flex items-center justify-center gap-2 text-primary-500">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm font-medium">Redirecting…</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        ExamQuest
      </div>

      <div className="mb-8">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
          <Lock size={22} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set new password</h1>
        <p className="text-gray-600">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          type={showPw ? "text" : "password"}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type={showPw ? "text" : "password"}
          placeholder="Repeat your new password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setErrors((prev) => ({ ...prev, confirm: undefined })); }}
          leftIcon={<Lock size={16} />}
          error={errors.confirm}
        />

        {/* Password strength hint */}
        {password.length > 0 && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  password.length >= i * 3
                    ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-yellow-400" : "bg-green-500"
                    : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!ready}
          className="mt-2"
        >
          Update Password
        </Button>

        {!ready && (
          <p className="text-xs text-center text-gray-400">
            Waiting for your reset session… if this persists, request a new reset link.
          </p>
        )}
      </form>
    </div>
  );
}
