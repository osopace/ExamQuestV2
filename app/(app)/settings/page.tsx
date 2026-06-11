"use client";
import { useState, useEffect, type ReactNode } from "react";
import {
  Bell,
  Lock,
  User,
  Shield,
  Trash2,
  AlertTriangle,
  Loader2,
  Mail,
  CheckCircle,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { getUserSettings, upsertUserSettings } from "@/supabase/db";
import { supabase } from "@/supabase/client";

type Tab = "notifications" | "privacy" | "account";

/* ── Toggle row ── */
interface ToggleProps {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ label, desc, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          checked ? "bg-primary-600" : "bg-gray-200",
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

/* ── Animated Modal shell ── */
function ActionModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel — slides up from bottom on mobile, scales in on desktop */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-modal overflow-hidden animate-slide-up sm:animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <X size={15} className="text-gray-500" />
        </button>
        {/* Mobile drag handle */}
        <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
        <div className="p-6 pt-4 sm:pt-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Settings defaults ── */
const DEFAULTS = {
  quizReminders: true,
  studyReminders: false,
  performanceUpdates: true,
  pushNotifications: true,
  emailNotifications: true,
  profileVisibility: true,
  showProgress: true,
  allowMessages: false,
  usageData: true,
  personalizedRecs: true,
};

export default function SettingsPage() {
  const { profile, logout } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("notifications");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settings, setSettings] = useState(DEFAULTS);

  // Live email from Supabase Auth — stays correct even if user changed email
  const [liveEmail, setLiveEmail] = useState<string>("");

  // Change password modal
  const [pwModal, setPwModal] = useState(false);
  const [pwSending, setPwSending] = useState(false);
  const [pwSent, setPwSent] = useState(false);

  // Delete account modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch live email from Supabase Auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setLiveEmail(user.email);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;
    getUserSettings(profile.id).then((saved) => {
      if (saved) {
        setSettings({
          quizReminders: saved.quiz_reminders,
          studyReminders: saved.study_reminders,
          performanceUpdates: saved.performance_updates,
          pushNotifications: saved.push_notifications,
          emailNotifications: saved.email_notifications,
          profileVisibility: saved.profile_visibility,
          showProgress: saved.show_progress,
          allowMessages: saved.allow_messages,
          usageData: saved.usage_data,
          personalizedRecs: saved.personalized_recs,
        });
      }
      setLoadingSettings(false);
    });
  }, [profile]);

  const toggle = (key: keyof typeof settings) => async (v: boolean) => {
    if (!profile) return;
    const prev = settings;
    const updated = { ...settings, [key]: v };
    setSettings(updated);
    try {
      await upsertUserSettings(profile.id, {
        quiz_reminders: updated.quizReminders,
        study_reminders: updated.studyReminders,
        performance_updates: updated.performanceUpdates,
        push_notifications: updated.pushNotifications,
        email_notifications: updated.emailNotifications,
        profile_visibility: updated.profileVisibility,
        show_progress: updated.showProgress,
        allow_messages: updated.allowMessages,
        usage_data: updated.usageData,
        personalized_recs: updated.personalizedRecs,
      });
      toast.success("Setting saved");
    } catch {
      setSettings(prev);
      toast.error("Failed to save setting");
    }
  };

  /* ── Change password ── */
  const handleSendResetLink = async () => {
    // Always re-fetch from Supabase Auth so we use the current email even if changed
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email ?? liveEmail;
    if (!email) {
      toast.error("Could not determine your email address.");
      return;
    }
    setPwSending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setLiveEmail(email); // keep display in sync
      setPwSent(true);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Try again.",
      );
      setPwModal(false);
    } finally {
      setPwSending(false);
    }
  };

  const closePwModal = () => {
    setPwModal(false);
    setTimeout(() => setPwSent(false), 300);
  };

  /* ── Delete account ── */
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const { error } = await supabase.functions.invoke("delete-account", {
        method: "POST",
      });
      if (error) throw new Error(error.message);

      await supabase.auth.signOut();
      logout();
      router.push("/");
      toast.success("Your account has been deleted.");
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal(false);
    setTimeout(() => {
      setDeleteInput("");
      setDeleteError("");
    }, 300);
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "account", label: "Account", icon: User },
  ];

  if (loadingSettings) {
    return (
      <div>
        <Topbar title="Settings" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Tab bar */}
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-100 shadow-card">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-colors",
                tab === id
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Notifications ── */}
        {tab === "notifications" && (
          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-2">
              Notification Preferences
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Control how and when ExamQuest reaches out to you.
            </p>
            <Toggle
              label="Daily Quiz Reminder"
              desc="Get a daily nudge to keep your streak going."
              checked={settings.quizReminders}
              onChange={toggle("quizReminders")}
            />
            <Toggle
              label="Study Reminders"
              desc="Reminders based on your personalised study plan."
              checked={settings.studyReminders}
              onChange={toggle("studyReminders")}
            />
            <Toggle
              label="Performance Updates"
              desc="Weekly digest of your scores and progress."
              checked={settings.performanceUpdates}
              onChange={toggle("performanceUpdates")}
            />
            <Toggle
              label="In-App Notifications"
              desc="Show notifications inside the app while you're studying."
              checked={settings.pushNotifications}
              onChange={toggle("pushNotifications")}
            />
            <Toggle
              label="Email Notifications"
              desc="Receive updates via email."
              checked={settings.emailNotifications}
              onChange={toggle("emailNotifications")}
            />
          </Card>
        )}

        {/* ── Privacy ── */}
        {tab === "privacy" && (
          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-2">Privacy Settings</h3>
            <p className="text-sm text-gray-500 mb-4">
              Control who can see your information and activity.
            </p>
            <Toggle
              label="Public Profile"
              desc="Allow other students to see your profile and rank on the leaderboard."
              checked={settings.profileVisibility}
              onChange={toggle("profileVisibility")}
            />
            <Toggle
              label="Show Progress on Leaderboard"
              desc="Display your score next to your name on the leaderboard."
              checked={settings.showProgress}
              onChange={toggle("showProgress")}
            />
            <Toggle
              label="Allow Direct Messages"
              desc="Let other students send you messages."
              checked={settings.allowMessages}
              onChange={toggle("allowMessages")}
            />
            <Toggle
              label="Usage Analytics"
              desc="Help us improve ExamQuest by sharing anonymous usage data."
              checked={settings.usageData}
              onChange={toggle("usageData")}
            />
            <Toggle
              label="Personalised Recommendations"
              desc="Use your activity to suggest courses and questions."
              checked={settings.personalizedRecs}
              onChange={toggle("personalizedRecs")}
            />
          </Card>
        )}

        {/* ── Account ── */}
        {tab === "account" && (
          <div className="space-y-4">
            <Card padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Lock size={16} />}
                  onClick={() => {
                    setPwSent(false);
                    setPwModal(true);
                  }}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Shield size={16} />}
                  onClick={() =>
                    toast("Two-factor auth coming soon!", { icon: "🔐" })
                  }
                >
                  Two-Factor Authentication
                </Button>
              </div>
            </Card>

            <Card padding="md" className="border border-red-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    These actions are permanent and cannot be undone.
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                leftIcon={<Trash2 size={16} />}
                onClick={() => setDeleteModal(true)}
              >
                Delete My Account
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* ══ Change Password Modal ══ */}
      <ActionModal open={pwModal} onClose={closePwModal}>
        {!pwSent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={26} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Change your password
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              We'll send a secure reset link to
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-5 break-all">
              {liveEmail || profile?.email}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              The link expires in 1 hour. After clicking it you'll be able to
              set a new password.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={closePwModal}>
                Cancel
              </Button>
              <Button
                fullWidth
                loading={pwSending}
                onClick={handleSendResetLink}
              >
                Send reset link
              </Button>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="text-center animate-scale-in">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={26} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Check your inbox
            </h3>
            <p className="text-sm text-gray-500 mb-1">Reset link sent to</p>
            <p className="text-sm font-semibold text-primary-600 mb-5 break-all">
              {liveEmail || profile?.email}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Didn't receive it? Check your spam folder or wait a moment before
              trying again.
            </p>
            <Button fullWidth onClick={closePwModal}>
              Got it
            </Button>
          </div>
        )}
      </ActionModal>

      {/* ══ Delete Account Modal ══ */}
      <ActionModal open={deleteModal} onClose={closeDeleteModal}>
        <div className="text-center">
          {/* Animated danger icon */}
          <div
            className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ animation: "pulseDanger 1.8s ease-in-out infinite" }}
          >
            <Trash2 size={28} className="text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Delete your account?
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            This is permanent. The following will be deleted immediately and
            cannot be recovered:
          </p>

          {/* What gets deleted */}
          <ul className="text-left space-y-2 mb-6 bg-red-50 border border-red-100 rounded-xl p-4">
            {[
              "All quiz history and scores",
              "Bookmarks and saved questions",
              "Streak and progress data",
              "Your profile and account",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-red-700"
              >
                <X size={13} className="text-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* Type to confirm */}
          <div className="mb-4 text-left">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Type <span className="text-red-600 font-bold">DELETE</span> to
              confirm
            </label>
            <input
              value={deleteInput}
              onChange={(e) => {
                setDeleteInput(e.target.value);
                setDeleteError("");
              }}
              placeholder="DELETE"
              disabled={deleting}
              className={cn(
                "w-full h-11 rounded-xl border-2 px-4 text-sm font-mono tracking-widest focus:outline-none transition-all",
                deleteInput === "DELETE"
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-700 focus:border-gray-300",
              )}
            />
          </div>

          {/* Error message */}
          {deleteError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 mb-4 text-left animate-fade-in">
              {deleteError}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancel
            </Button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteInput !== "DELETE" || deleting}
              className={cn(
                "flex-1 h-11 rounded-xl text-sm font-semibold transition-all px-4 flex items-center justify-center gap-2",
                deleteInput === "DELETE"
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  : "bg-red-100 text-red-300 cursor-not-allowed",
                "disabled:opacity-70 disabled:cursor-not-allowed",
              )}
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
