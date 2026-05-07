import Link from "next/link";
import { BookOpen, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const links = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/courses", label: "Courses" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it Works" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Support: [
    { href: "/help", label: "Help Center" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              ExamQuest
            </Link>
            <p className="text-sm leading-relaxed mb-5">Nigeria's #1 exam preparation platform. Helping students ace WAEC, UTME, Post-UTME and university exams.</p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ExamQuest. All rights reserved.</p>
          <p className="text-sm">Made with ❤️ in Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
