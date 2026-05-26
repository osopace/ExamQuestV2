"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, BookOpen, ArrowRight, X, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface SubjectResult {
  id: string;
  name: string;
}

function ResultsList({
  searching,
  results,
  highlighted,
  query,
  onHover,
  onSelect,
}: {
  searching: boolean;
  results: SubjectResult[];
  highlighted: number;
  query: string;
  onHover: (i: number) => void;
  onSelect: (id: string) => void;
}) {
  if (searching) {
    return (
      <div className="p-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-1 py-1.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
              <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-3xl mb-2">🔍</p>
        <p className="text-sm font-medium text-gray-700">No subjects found</p>
        <p className="text-xs text-gray-400 mt-1">
          {query.trim() ? `No match for "${query}"` : "You haven't enrolled in any subjects yet"}
        </p>
      </div>
    );
  }

  return (
    <ul className="py-1.5">
      {results.map((subject, i) => (
        <li key={subject.id}>
          <button
            onMouseEnter={() => onHover(i)}
            onClick={() => onSelect(subject.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
              highlighted === i ? "bg-primary-50" : "hover:bg-gray-50",
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-colors",
                highlighted === i ? "bg-primary-100" : "bg-gray-100 group-hover:bg-primary-50",
              )}
            >
              📚
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-semibold truncate transition-colors",
                highlighted === i ? "text-primary-700" : "text-gray-800",
              )}>
                {subject.name}
              </p>
              <p className="text-xs text-gray-400 truncate">Open subject details</p>
            </div>
            <ArrowRight
              size={14}
              className={cn(
                "flex-shrink-0 transition-all",
                highlighted === i ? "text-primary-500 translate-x-0.5" : "text-gray-300",
              )}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const { profile } = useAuthStore();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [highlighted, setHighlighted] = useState(-1);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allSubjects: SubjectResult[] = (profile?.enrolled_course_ids ?? []).map((id) => ({
    id,
    name: toTitleCase(id),
  }));

  const runSearch = useCallback(
    (q: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setSearching(true);
      timerRef.current = setTimeout(() => {
        const trimmed = q.trim().toLowerCase();
        const filtered = trimmed
          ? allSubjects.filter((s) => s.name.toLowerCase().includes(trimmed) || s.id.includes(trimmed))
          : allSubjects.slice(0, 6);
        setResults(filtered);
        setSearching(false);
        setHighlighted(-1);
      }, 150);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile?.enrolled_course_ids],
  );

  useEffect(() => {
    if (open || mobileOpen) runSearch(query);
  }, [query, open, mobileOpen, runSearch]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navigate = (id: string) => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
    router.push(`/course/${encodeURIComponent(id)}`);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = highlighted >= 0 ? results[highlighted] : results[0];
      if (target) navigate(target.id);
    } else if (e.key === "Escape") {
      setOpen(false);
      setMobileOpen(false);
      desktopInputRef.current?.blur();
    }
  };

  return (
    <>
      {/* ── Mobile: icon button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sm:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Search subjects"
      >
        <Search size={18} className="text-gray-600" />
      </button>

      {/* ── Mobile: full-screen overlay ── */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-white flex flex-col">
          {/* Overlay header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
            <button
              onClick={closeMobile}
              className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0"
              aria-label="Close search"
            >
              <ArrowLeft size={17} className="text-gray-600" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 h-10 border border-primary-300 ring-2 ring-primary-100">
              {searching ? (
                <Loader2 size={15} className="text-primary-400 flex-shrink-0 animate-spin" />
              ) : (
                <Search size={15} className="text-primary-500 flex-shrink-0" />
              )}
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search your subjects..."
                className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label="Clear"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Section label */}
          <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <BookOpen size={13} className="text-primary-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {query.trim() ? "Results" : "Your Subjects"}
            </span>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            <ResultsList
              searching={searching}
              results={results}
              highlighted={highlighted}
              query={query}
              onHover={setHighlighted}
              onSelect={navigate}
            />
          </div>

          {allSubjects.length > 0 && !query.trim() && results.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400 text-center">
                {allSubjects.length} enrolled subject{allSubjects.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Desktop: expandable input + dropdown ── */}
      <div ref={containerRef} className="relative hidden sm:block">
        <div
          className={cn(
            "flex items-center gap-2 bg-gray-50 rounded-xl px-3 h-10 border transition-all duration-200",
            open ? "border-primary-400 ring-2 ring-primary-100 bg-white w-72" : "border-gray-200 w-56",
          )}
        >
          {searching ? (
            <Loader2 size={15} className="text-primary-400 flex-shrink-0 animate-spin" />
          ) : (
            <Search size={15} className={cn("flex-shrink-0 transition-colors", open ? "text-primary-500" : "text-gray-400")} />
          )}
          <input
            ref={desktopInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search subjects..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); desktopInputRef.current?.focus(); }}
              className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
              aria-label="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {open && (
          <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
              <BookOpen size={13} className="text-primary-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {query.trim() ? "Results" : "Your Subjects"}
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto">
              <ResultsList
                searching={searching}
                results={results}
                highlighted={highlighted}
                query={query}
                onHover={setHighlighted}
                onSelect={navigate}
              />
            </div>

            {allSubjects.length > 0 && !query.trim() && results.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  {allSubjects.length} enrolled subject{allSubjects.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
