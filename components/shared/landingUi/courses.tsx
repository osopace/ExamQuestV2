"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Star,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Code,
  GitBranch,
  Calculator,
  Atom,
  Settings,
  Brain,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/Button";
import { COURSES } from "@/constants/mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Cpu,
  Database,
  Globe,
  Code,
  GitBranch,
  Calculator,
  Atom,
  Settings,
  Brain,
};

const CATEGORIES = ["All Categories", "Computer Science", "Mathematics", "Physics"];

export default function CoursesSection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = COURSES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All Categories" || c.department === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all min-w-[152px] justify-between"
          >
            <span>{category}</span>
            <ChevronDown
              size={14}
              className={cn(
                "text-gray-400 transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-1.5 right-0 w-52 bg-white rounded-xl border border-gray-100 shadow-modal z-20 py-1 overflow-hidden">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    category === cat
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filtered.slice(0, 6).map((course) => {
          const Icon = ICON_MAP[course.icon] ?? BookOpen;
          return (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="group block rounded-2xl p-6 border border-transparent hover:shadow-md transition-all"
              style={{ backgroundColor: course.color + "14" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: course.color + "28" }}
              >
                <Icon size={22} style={{ color: course.color }} />
              </div>

              {/* Name */}
              <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-primary-700 transition-colors">
                {course.name}
              </h3>

              {/* Quiz count */}
              <p className="text-sm text-gray-500 mb-3">
                {course.total_quizzes}+ Quizzes
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-800">
                  {course.rating}
                </span>
                <span className="text-xs text-gray-400">
                  ({((course.total_questions * 22) / 1000).toFixed(1)}k)
                </span>
              </div>
            </Link>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <BookOpen size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">No courses match your search.</p>
          </div>
        )}
      </div>

      {/* View all button */}
      <div className="text-center">
        <Link href="/allcourses">
          <Button size="lg">View All Courses</Button>
        </Link>
      </div>
    </div>
  );
}
