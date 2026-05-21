"use client";
import { useState, useEffect } from "react";
import { Camera, Save, Flame, Trophy, BookOpen, Target } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, Avatar, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { SCHOOLS } from "@/constants/mockData";
import { updateProfile } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { profile, updateProfile: updateStore } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    school: "",
    examType: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.full_name ?? "",
      school: profile.school_id ?? "",
      examType: profile.exam_type ?? "",
    });
  }, [profile]);

  const set = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const school = SCHOOLS.find((s) => s.id === form.school);
      await updateProfile(profile.id, {
        full_name: form.fullName,
        school_id: form.school || undefined,
        school_name: school?.name,
        exam_type: form.examType as any,
      });
      updateStore({
        full_name: form.fullName,
        school_id: form.school || undefined,
        school_name: school?.name,
        exam_type: form.examType as any,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    { icon: Flame, label: "Day Streak", value: String(profile?.current_streak ?? 0), color: "text-orange-500", bg: "bg-orange-50" },
    { icon: BookOpen, label: "Subjects", value: String(profile?.enrolled_course_ids?.length ?? 0), color: "text-primary-600", bg: "bg-primary-50" },
    { icon: Trophy, label: "Longest Streak", value: `${profile?.longest_streak ?? 0}d`, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Target, label: "Plan", value: profile?.is_premium ? "Premium" : "Free", color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div>
      <Topbar title="Profile" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">

        <Card padding="lg" className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar name={profile?.full_name ?? "?"} size="xl" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{profile?.full_name}</h2>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant={profile?.is_premium ? "success" : "primary"}>
                {profile?.is_premium ? "Premium" : "Free Plan"}
              </Badge>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} padding="md" className="text-center">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </Card>
          ))}
        </div>

        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-5">Edit Profile</h3>
          <div className="space-y-4">
            <Input label="Full Name" value={form.fullName} onChange={set("fullName")} />
            <Input label="Email Address" type="email" value={profile?.email ?? ""} disabled hint="Email cannot be changed here." />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Type</label>
              <select
                value={form.examType}
                onChange={set("examType")}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="wassce">WAEC (WASSCE)</option>
                <option value="neco">NECO</option>
                <option value="utme">JAMB UTME</option>
                <option value="post-utme">Post-UTME</option>
                <option value="university">University</option>
              </select>
            </div>

            {form.examType === "university" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">School</label>
                <select
                  value={form.school}
                  onChange={set("school")}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select a school...</option>
                  {SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            <Button onClick={handleSave} loading={loading} leftIcon={<Save size={16} />}>
              Save Changes
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
