"use client";
import { useState, useEffect } from "react";
import { Bookmark, Search, Trash2, BookOpen, Loader2 } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { formatRelativeDate } from "@/utils/format";
import { getUserBookmarks, removeBookmark, getQuestionsByIds } from "@/supabase/db";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

type BookmarkRow = {
  id: string;
  user_id: string;
  question_id: string;
  subject: string;
  exam_type: string;
  note?: string;
  created_at: string;
  question_text?: string;
};

export default function BookmarksPage() {
  const { profile } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);

    getUserBookmarks(profile.id)
      .then(async (rows) => {
        const ids = rows.map((r) => r.question_id);
        const questions = await getQuestionsByIds(ids);
        const textMap: Record<string, string> = {};
        questions.forEach((q) => { textMap[String(q.id)] = q.question_text; });

        setBookmarks(rows.map((r) => ({
          ...r,
          question_text: textMap[r.question_id],
        })));
      })
      .catch(() => toast.error("Failed to load bookmarks"))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const filtered = bookmarks.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.subject.toLowerCase().includes(q) ||
      b.exam_type.toLowerCase().includes(q) ||
      (b.question_text ?? "").toLowerCase().includes(q) ||
      (b.note ?? "").toLowerCase().includes(q)
    );
  });

  const handleRemove = async (id: string, questionId: string) => {
    if (!profile) return;
    setRemoving(id);
    try {
      await removeBookmark(profile.id, questionId);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div>
      <Topbar title="Bookmarks" />
      <div className="p-6 max-w-4xl mx-auto space-y-5">

        <div className="flex items-center gap-2 bg-white rounded-xl px-4 h-11 border border-gray-200">
          <Search size={15} className="text-gray-400" />
          <input
            placeholder="Search bookmarked questions..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 py-10 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading bookmarks...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Bookmark size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-600">No bookmarks yet</p>
                <p className="text-sm mt-1">
                  Bookmark questions during practice to review them here.
                </p>
              </div>
            ) : (
              filtered.map((bm) => (
                <Card key={bm.id} padding="md" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen size={15} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="primary" size="sm">
                          {bm.exam_type.toUpperCase().replace("-", " ")}
                        </Badge>
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {bm.subject}
                        </span>
                      </div>
                      {bm.question_text ? (
                        <p className="text-sm font-medium text-gray-900 leading-relaxed line-clamp-3">
                          {bm.question_text}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Question #{bm.question_id}</p>
                      )}
                      {bm.note && (
                        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 mt-2">
                          📝 {bm.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatRelativeDate(bm.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(bm.id, bm.question_id)}
                      disabled={removing === bm.id}
                      className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                      {removing === bm.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
