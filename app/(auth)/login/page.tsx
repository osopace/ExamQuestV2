"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn, getProfile } from "@/supabase/auth";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { session } = await signIn(form.email, form.password);
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        setProfile(profile);
        toast.success("Welcome back!");
        router.push(profile?.onboarding_complete ? "/dashboard" : "/onboarding");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        ExamQuest
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">Sign in to continue your exam preparation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} leftIcon={<Mail size={16} />} error={errors.email} />
        <Input label="Password" type={showPw ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} leftIcon={<Lock size={16} />} rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>} error={errors.password} />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>Sign In</Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary-600 font-semibold hover:underline">Sign up free</Link>
      </p>
    </div>
  );
}
