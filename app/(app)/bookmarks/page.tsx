"use client";
import { useState } from "react";
import { Bookmark, Search, Trash2, BookOpen, FileText } from "lucide-react";
import { Card, Badge } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { MOCK_BOOKMARKS } from "@/constants/mockData";
import { formatRelativeDate } from "@/utils/format";
import type { Bookmark as BookmarkType } from "@/types";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "question" | "explanation">("all");

  const filtered = bookmarks.filter((b) => {
    const matchesTab = activeTab === "all" || b.bookmark_type === activeTab;
    const matchesSearch = b.question?.question_text?.toLowerCase().includes(search.toLowerCase()) ?? true;
    return matchesTab && matchesSearch;
  });

  const remove = (id: string) => setBookmarks((p) => p.filter((b) => b.id !== id));

  return (
    <div>
      <Topbar title="Bookmarks" />
      <div className="p-6 max-w-4xl mx-auto space-y-5">

        {/* Search */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 h-11 border border-gray-200">
          <Search size={15} className="text-gray-400" />
          <input
            placeholder="Search bookmarked questions..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "question", "explanation"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 h-9 rounded-xl text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {tab === "all" ? `All (${bookmarks.length})` : tab === "question" ? "Questions" : "Explanations"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((bm) => (
            <Card key={bm.id} padding="md" className="group">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  {bm.bookmark_type === "question" ? (
                    <BookOpen size={15} className="text-primary-600" />
                  ) : (
                    <FileText size={15} className="text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={bm.bookmark_type === "question" ? "primary" : "info"} size="sm">
                      {bm.bookmark_type === "question" ? "Question" : "Explanation"}
                    </Badge>
                    <span className="text-xs text-gray-400">{bm.question?.topic_name}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {bm.question?.question_text}
                  </p>
                  {bm.note && (
                    <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 mt-2">
                      📝 {bm.note}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{formatRelativeDate(bm.created_at)}</p>
                </div>
                <button
                  onClick={() => remove(bm.id)}
                  className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Bookmark size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-600">No bookmarks yet</p>
              <p className="text-sm mt-1">Bookmark questions during practice to review them here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
