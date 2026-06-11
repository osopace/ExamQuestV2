"use client";
import { useState } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
  BarChart3,
  User,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Card, Modal } from "@/components/ui/index";
import Button from "@/components/ui/Button";
import Topbar from "@/components/shared/Topbar";
import { HELP_ARTICLES, EXPANDED_FAQ, type HelpArticle } from "@/constants/helpData";

type Category = "Practice & Quizzes" | "Account & Billing" | "Analytics" | "Profile & Settings";

const CATEGORIES: { key: Category; icon: React.ElementType; color: string; iconBg: string }[] = [
  { key: "Practice & Quizzes", icon: BookOpen, color: "text-primary-600", iconBg: "bg-primary-50" },
  { key: "Account & Billing", icon: Zap, color: "text-amber-600", iconBg: "bg-amber-50" },
  { key: "Analytics", icon: BarChart3, color: "text-blue-600", iconBg: "bg-blue-50" },
  { key: "Profile & Settings", icon: User, color: "text-purple-600", iconBg: "bg-purple-50" },
];

const GETTING_STARTED = [
  {
    step: "1",
    title: "Choose Your Exam",
    desc: "Select WAEC, NECO, JAMB UTME, or Post-UTME to personalise your practice feed and question bank.",
  },
  {
    step: "2",
    title: "Start Practising",
    desc: "Pick a subject, set a timer, and work through past questions at your own pace every day.",
  },
  {
    step: "3",
    title: "Track Your Progress",
    desc: "Check Analytics after every session to see exactly where you're improving and what still needs work.",
  },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<Record<number, "up" | "down">>({});
  const [openArticle, setOpenArticle] = useState<HelpArticle | null>(null);

  const searchLower = search.toLowerCase();

  const filteredArticles = HELP_ARTICLES.filter((a) => {
    const matchCategory = !activeCategory || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const filteredFaq = EXPANDED_FAQ.filter((item) => {
    const matchCategory = !activeCategory || item.category === activeCategory;
    const matchSearch =
      !search ||
      item.q.toLowerCase().includes(searchLower) ||
      item.a.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const hasNoResults = filteredArticles.length === 0 && filteredFaq.length === 0;

  return (
    <div>
      <Topbar title="Help Center" />
      <div className="p-6 max-w-4xl mx-auto space-y-8">

        {/* ── Search hero ────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-1">How can we help?</h2>
          <p className="text-primary-200 mb-5 text-sm">
            Search our help articles or browse by category below.
          </p>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 h-11 max-w-md mx-auto shadow-sm">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              placeholder="Search help articles..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory(null);
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Getting Started (hidden when searching) ─────────────────────── */}
        {!search && (
          <section>
            <h3 className="font-bold text-gray-900 mb-4">Getting Started</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {GETTING_STARTED.map(({ step, title, desc }) => (
                <Card key={step} padding="md" className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mb-3">
                    {step}
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  {step !== "3" && (
                    <ArrowRight
                      size={14}
                      className="absolute -right-2 top-1/2 -translate-y-1/2 text-primary-300 hidden sm:block"
                    />
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── Category filters ─────────────────────────────────────────────── */}
        <section>
          <h3 className="font-bold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map(({ key, icon: Icon, color, iconBg }) => {
              const articleCount = HELP_ARTICLES.filter((a) => a.category === key).length;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(isActive ? null : key)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "border-primary-300 bg-primary-50 shadow-sm"
                      : "border-gray-100 bg-white hover:shadow-hover hover:-translate-y-0.5"
                  }`}
                >
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{key}</p>
                    <p className="text-xs text-gray-500">{articleCount} articles</p>
                  </div>
                  {isActive && <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-2 text-xs text-primary-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </section>

        {/* ── No results state ─────────────────────────────────────────────── */}
        {hasNoResults && (
          <div className="text-center py-10">
            <Search size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 mb-1">
              No results for &ldquo;{search}&rdquo;
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Try different keywords or reach out — we&apos;ll help you directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/2348081159617?text=Hello%20ExamQuest%20Team%2C%20I%20need%20help%20with..."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" leftIcon={<MessageCircle size={15} />}>
                  Chat on WhatsApp
                </Button>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=supportexamquest@gmail.com&su=Support%20Request&body=Hello%20ExamQuest%20Team,"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" leftIcon={<Mail size={15} />}>
                  Send Email
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* ── Articles ─────────────────────────────────────────────────────── */}
        {filteredArticles.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-900 mb-4">
              {activeCategory ? `${activeCategory} Articles` : search ? "Matching Articles" : "Help Articles"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredArticles.map((article) => {
                const cat = CATEGORIES.find((c) => c.key === article.category);
                const Icon = cat?.icon ?? FileText;
                return (
                  <button
                    key={article.id}
                    onClick={() => setOpenArticle(article)}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-white text-left hover:shadow-hover hover:-translate-y-0.5 transition-all group"
                  >
                    <div className={`w-9 h-9 ${cat?.iconBg ?? "bg-gray-50"} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={15} className={cat?.color ?? "text-gray-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{article.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-primary-500 flex-shrink-0 mt-1 transition-colors" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── FAQ accordion ─────────────────────────────────────────────────── */}
        {filteredFaq.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-900 mb-4">
              {search ? "Matching FAQs" : "Frequently Asked Questions"}
            </h3>
            <div className="space-y-2">
              {filteredFaq.map((item, i) => (
                <Card key={i} padding="none" className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-gray-50 pt-3 animate-fade-in">
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.a}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Was this helpful?</span>
                        {helpful[i] ? (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={13} /> Thanks for the feedback!
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => setHelpful((h) => ({ ...h, [i]: "up" }))}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <ThumbsUp size={12} /> Yes
                            </button>
                            <button
                              onClick={() => setHelpful((h) => ({ ...h, [i]: "down" }))}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <ThumbsDown size={12} /> No
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        {!hasNoResults && (
          <section>
            <h3 className="font-bold text-gray-900 mb-4">Still Need Help?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://wa.me/2348081159617?text=Hello%20ExamQuest%20Team%2C%20I%20need%20help%20with..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-hover hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    Chat on WhatsApp
                  </p>
                  <p className="text-xs text-gray-500">Mon–Fri, 9am–6pm WAT</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">Typically replies in 2 hours</p>
                </div>
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=supportexamquest@gmail.com&su=Support%20Request&body=Hello%20ExamQuest%20Team,"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-hover hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Email Support
                  </p>
                  <p className="text-xs text-gray-500">supportexamquest@gmail.com</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">Response within 24 hours</p>
                </div>
              </a>
            </div>
          </section>
        )}
      </div>

      {/* ── Article detail modal ─────────────────────────────────────────── */}
      <Modal
        open={!!openArticle}
        onClose={() => setOpenArticle(null)}
        title={openArticle?.title ?? ""}
        size="md"
      >
        {openArticle && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 -mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} /> {openArticle.readTime}
              </span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{openArticle.category}</span>
            </div>

            <div className="space-y-4">
              {openArticle.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    {step.heading && (
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{step.heading}</p>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
              <p className="text-xs text-gray-400">Was this article helpful?</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<ThumbsUp size={13} />}>
                  Yes, thanks
                </Button>
                <a
                  href="https://wa.me/2348081159617?text=Hello%20ExamQuest%20Team%2C%20I%20still%20need%20help%20with..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" leftIcon={<MessageCircle size={13} />}>
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
