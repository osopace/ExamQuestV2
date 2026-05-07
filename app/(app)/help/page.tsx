"use client";
import { useState } from "react";
import { Search, MessageCircle, Mail, ChevronDown, ChevronUp, BookOpen, Zap, BarChart3, User } from "lucide-react";
import { Card } from "@/components/ui/index";
import Topbar from "@/components/shared/Topbar";
import { FAQ } from "@/constants/mockData";

const CATEGORIES = [
  { icon: BookOpen, label: "Practice & Quizzes", articles: 8 },
  { icon: Zap, label: "Account & Billing", articles: 6 },
  { icon: BarChart3, label: "Analytics", articles: 4 },
  { icon: User, label: "Profile & Settings", articles: 5 },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Topbar title="Help Center" />
      <div className="p-6 max-w-3xl mx-auto space-y-7">

        {/* Search hero */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">How can we help?</h2>
          <p className="text-primary-200 mb-5">Search our help articles or browse categories below.</p>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 h-11 max-w-md mx-auto">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search help articles..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <section>
          <h3 className="font-bold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORIES.map(({ icon: Icon, label, articles }) => (
              <Card key={label} hoverable padding="md" className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{articles} articles</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ accordion */}
        <section>
          <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <Card key={i} padding="none" className="overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                  {open === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No results for &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h3 className="font-bold text-gray-900 mb-4">Still Need Help?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card padding="md" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Live Chat</p>
                <p className="text-xs text-gray-500">Available Mon–Fri, 9am–6pm WAT</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email Support</p>
                <p className="text-xs text-gray-500">support@examquest.ng</p>
              </div>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
