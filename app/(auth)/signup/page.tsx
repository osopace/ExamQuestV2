"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signUp } from "@/supabase/auth";
import { useAuthStore } from "@/store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPw: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPw) e.confirmPw = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName);
      toast.success("Account created! Let's set you up.");
      router.push("/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        ExamQuest
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-600">Start your exam preparation journey today — it's free.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" placeholder="Chukwuemeka Obi" value={form.fullName} onChange={set("fullName")} leftIcon={<User size={16} />} error={errors.fullName} />
        <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} leftIcon={<Mail size={16} />} error={errors.email} />
        <Input label="Password" type={showPw ? "text" : "password"} placeholder="At least 8 characters" value={form.password} onChange={set("password")} leftIcon={<Lock size={16} />} rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>} error={errors.password} />
        <Input label="Confirm password" type={showPw ? "text" : "password"} placeholder="Repeat your password" value={form.confirmPw} onChange={set("confirmPw")} leftIcon={<Lock size={16} />} error={errors.confirmPw} />

        <Button type="submit" fullWidth loading={loading}>Create Account</Button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
      </p>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
