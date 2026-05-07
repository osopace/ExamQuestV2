"use client";
import { useState } from "react";
import { Bell, Lock, User, Shield, Trash2, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, Modal } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

type Tab = "notifications" | "privacy" | "account";

interface ToggleProps { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; }
function Toggle({ label, desc, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", checked ? "bg-primary-600" : "bg-gray-200")}
      >
        <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("notifications");
  const [deleteModal, setDeleteModal] = useState(false);
  const [settings, setSettings] = useState({
    quizReminders: true, studyReminders: false, performanceUpdates: true,
    pushNotifications: true, emailNotifications: true,
    profileVisibility: true, showProgress: true, allowMessages: false,
    usageData: true, personalizedRecs: true,
  });

  const toggle = (key: keyof typeof settings) => (v: boolean) => {
    setSettings((s) => ({ ...s, [key]: v }));
    toast.success("Setting updated");
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "account", label: "Account", icon: User },
  ];

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
              className={cn("flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-colors", tab === id ? "bg-primary-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50")}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {tab === "notifications" && (
          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-2">Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-4">Control how and when ExamQuest reaches out to you.</p>
            <Toggle label="Daily Quiz Reminder" desc="Get a daily nudge to keep your streak going." checked={settings.quizReminders} onChange={toggle("quizReminders")} />
            <Toggle label="Study Reminders" desc="Reminders based on your personalised study plan." checked={settings.studyReminders} onChange={toggle("studyReminders")} />
            <Toggle label="Performance Updates" desc="Weekly digest of your scores and progress." checked={settings.performanceUpdates} onChange={toggle("performanceUpdates")} />
            <Toggle label="Push Notifications" desc="Receive push notifications on your device." checked={settings.pushNotifications} onChange={toggle("pushNotifications")} />
            <Toggle label="Email Notifications" desc="Receive updates via email." checked={settings.emailNotifications} onChange={toggle("emailNotifications")} />
          </Card>
        )}

        {/* Privacy */}
        {tab === "privacy" && (
          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-2">Privacy Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Control who can see your information and activity.</p>
            <Toggle label="Public Profile" desc="Allow other students to see your profile and rank." checked={settings.profileVisibility} onChange={toggle("profileVisibility")} />
            <Toggle label="Show Progress on Leaderboard" desc="Display your progress percentage on the leaderboard." checked={settings.showProgress} onChange={toggle("showProgress")} />
            <Toggle label="Allow Direct Messages" desc="Let other students send you messages." checked={settings.allowMessages} onChange={toggle("allowMessages")} />
            <Toggle label="Usage Analytics" desc="Help us improve ExamQuest by sharing anonymous usage data." checked={settings.usageData} onChange={toggle("usageData")} />
            <Toggle label="Personalised Recommendations" desc="Use your activity to suggest courses and questions." checked={settings.personalizedRecs} onChange={toggle("personalizedRecs")} />
          </Card>
        )}

        {/* Account */}
        {tab === "account" && (
          <div className="space-y-4">
            <Card padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <Button variant="outline" fullWidth leftIcon={<Lock size={16} />} onClick={() => toast.success("Password reset email sent!")}>
                  Change Password
                </Button>
                <Button variant="outline" fullWidth leftIcon={<Shield size={16} />} onClick={() => toast("Two-factor auth coming soon!", { icon: "🔐" })}>
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
                  <p className="text-sm text-gray-500 mt-0.5">These actions are permanent and cannot be undone.</p>
                </div>
              </div>
              <Button variant="danger" leftIcon={<Trash2 size={16} />} onClick={() => setDeleteModal(true)}>
                Delete My Account
              </Button>
            </Card>
          </div>
        )}

      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account?">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-gray-600 mb-2">This will permanently delete your account, all your quiz history, progress and bookmarks.</p>
          <p className="text-sm font-semibold text-red-600 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={() => { setDeleteModal(false); toast.error("Account deleted."); }}>Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
