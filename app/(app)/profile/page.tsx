"use client";

import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Save,
  Flame,
  Trophy,
  BookOpen,
  Target,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, Avatar, Badge, Modal } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { SCHOOLS } from "@/constants/mockData";

import { updateProfile, uploadAvatar } from "@/supabase/db";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

import toast from "react-hot-toast";
import type { ExamType } from "@/types";

const EXAM_OPTIONS: { id: ExamType; label: string; sub: string }[] = [
  { id: "wassce", label: "WAEC", sub: "WASSCE" },
  { id: "neco", label: "NECO", sub: "National Exams" },
  { id: "utme", label: "JAMB", sub: "UTME" },
  { id: "post-utme", label: "Post-UTME", sub: "Aptitude Test" },
  { id: "university", label: "University", sub: "Degree Courses" },
];

export default function ProfilePage() {
  const { profile, updateProfile: updateStore } = useAuthStore();

  const savedExamTypes: ExamType[] = profile?.exam_types?.length
    ? (profile.exam_types as ExamType[])
    : profile?.exam_type
      ? [profile.exam_type]
      : [];

  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ password: "", newEmail: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }

    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(profile.id, file);
      await updateProfile(profile.id, { avatar_url: url });
      updateStore({ avatar_url: url });
      toast.success("Profile photo updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Avatar upload error:", msg);
      toast.error(`Upload failed: ${msg}`);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setSchool(profile.school_id ?? "");
    const seeded: ExamType[] = profile.exam_types?.length
      ? (profile.exam_types as ExamType[])
      : profile.exam_type
        ? [profile.exam_type]
        : [];
    setExamTypes(seeded);
  }, [profile]);

  const toggleExamType = (id: ExamType) => {
    if (examTypes.includes(id)) {
      if (examTypes.length <= 1) return;
      setExamTypes(examTypes.filter((e) => e !== id));
    } else {
      if (examTypes.length >= 2) return;
      setExamTypes([...examTypes, id]);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!fullName.trim()) {
      setNameError("Full name cannot be empty");
      return;
    }
    setNameError("");
    setLoading(true);
    try {
      const schoolObj = SCHOOLS.find((s) => s.id === school);
      await updateProfile(profile.id, {
        full_name: fullName.trim(),
        school_id: school || undefined,
        school_name: schoolObj?.name,
        exam_type: examTypes[0],
        exam_types: examTypes,
      });
      updateStore({
        full_name: fullName.trim(),
        school_id: school || undefined,
        school_name: schoolObj?.name,
        exam_type: examTypes[0],
        exam_types: examTypes,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!profile) return;
    if (!emailForm.password.trim() || !emailForm.newEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setEmailLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: emailForm.password,
      });
      if (authError) {
        toast.error("Incorrect password");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: emailForm.newEmail.trim(),
      });
      if (updateError) throw updateError;

      toast.success(
        `Confirmation sent to ${emailForm.newEmail}. Click the link to complete the change.`,
        { duration: 6000 },
      );
      setEmailModal(false);
      setEmailForm({ password: "", newEmail: "" });
    } catch {
      toast.error("Failed to initiate email change. Try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const closeEmailModal = () => {
    setEmailModal(false);
    setEmailForm({ password: "", newEmail: "" });
    setShowPassword(false);
  };

  const STATS = [
    {
      icon: Flame,
      label: "Day Streak",
      value: String(profile?.current_streak ?? 0),
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: BookOpen,
      label: "Subjects",
      value: String(profile?.enrolled_course_ids?.length ?? 0),
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      icon: Trophy,
      label: "Longest Streak",
      value: `${profile?.longest_streak ?? 0}d`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Target,
      label: "Plan",
      value: profile?.is_premium ? "Premium" : "Free",
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div>
      <Topbar title="Profile" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Avatar + identity card */}
        <Card
          padding="lg"
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="relative">
            <div className={cn("relative", avatarUploading && "opacity-60")}>
              <Avatar
                name={profile?.full_name ?? "?"}
                src={profile?.avatar_url ?? undefined}
                size="xl"
              />
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.full_name}
            </h2>
            <p className="text-gray-500 text-sm">{profile?.email}</p>

            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <Badge variant={profile?.is_premium ? "success" : "primary"}>
                {profile?.is_premium ? "Premium" : "Free Plan"}
              </Badge>
              <Badge variant="success">Active</Badge>
              {savedExamTypes.map((et, i) => (
                <Badge key={et} variant={i === 0 ? "info" : "neutral"}>
                  {EXAM_OPTIONS.find((o) => o.id === et)?.label ??
                    et.toUpperCase()}
                  {i === 0 && savedExamTypes.length > 1 && (
                    <span className="opacity-60 ml-0.5">·primary</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} padding="md" className="text-center">
              <div
                className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
              >
                <Icon size={16} className={color} />
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </Card>
          ))}
        </div>

        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-5">Edit Profile</h3>

          <div className="space-y-5">
            {/* Full name */}
            <div>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (nameError) setNameError("");
                }}
                className={
                  nameError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : ""
                }
              />
              {nameError && (
                <p className="text-xs text-red-500 mt-1.5">{nameError}</p>
              )}
            </div>

            {/* Email — read only with change button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center text-sm text-gray-500 min-w-0">
                  <span className="truncate">{profile?.email}</span>
                </div>
                <button
                  onClick={() => setEmailModal(true)}
                  className="flex-shrink-0 h-11 px-4 rounded-xl border-2 border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <Mail size={14} /> Change
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                A confirmation link will be sent to your new address.
              </p>
            </div>

            {/* Exam type chip grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Active Exam Types
                </label>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors",
                    examTypes.length >= 2
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {examTypes.length} / 2
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {EXAM_OPTIONS.map(({ id, label, sub }) => {
                  const active = examTypes.includes(id);
                  const isPrimary = examTypes[0] === id && examTypes.length > 1;
                  const disabled = !active && examTypes.length >= 2;
                  return (
                    <button
                      key={id}
                      onClick={() => toggleExamType(id)}
                      disabled={disabled}
                      className={cn(
                        "relative flex flex-col items-start gap-0.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
                        active
                          ? "border-primary-500 bg-primary-50"
                          : disabled
                            ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                            : "border-gray-200 hover:border-primary-200 bg-white",
                      )}
                    >
                      {isPrimary && (
                        <span className="absolute top-1.5 right-2 text-[9px] font-bold text-primary-400 uppercase tracking-wide">
                          Primary
                        </span>
                      )}
                      <span
                        className={cn(
                          "font-bold text-sm",
                          active ? "text-primary-700" : "text-gray-700",
                        )}
                      >
                        {label}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          active ? "text-primary-500" : "text-gray-400",
                        )}
                      >
                        {sub}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {examTypes.length < 2
                  ? "Add a second exam type to access its subjects and question bank."
                  : "Maximum reached. Deselect one to switch."}
              </p>
            </div>

            {/* School selector — only when university is one of the chosen types */}
            {examTypes.includes("university") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  School
                </label>
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select a school...</option>
                  {SCHOOLS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleSave}
              loading={loading}
              leftIcon={<Save size={16} />}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </div>

      {/* Email change modal */}
      <Modal
        open={emailModal}
        onClose={closeEmailModal}
        title="Change Email Address"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            Verify your identity and enter your new email. Supabase will send a
            confirmation link to your new address — the change takes effect once
            you click it.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={emailForm.password}
                onChange={(e) =>
                  setEmailForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="Enter your current password"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 pr-11 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Email Address
            </label>
            <input
              type="email"
              value={emailForm.newEmail}
              onChange={(e) =>
                setEmailForm((f) => ({ ...f, newEmail: e.target.value }))
              }
              placeholder="you@example.com"
              className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={closeEmailModal}
              className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              fullWidth
              onClick={handleEmailChange}
              loading={emailLoading}
              leftIcon={<Mail size={15} />}
            >
              Send Confirmation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
