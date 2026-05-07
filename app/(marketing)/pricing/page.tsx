import Link from "next/link";
import { Check, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Great for getting started",
    color: "border-gray-200",
    features: [
      "20 practice questions per day",
      "Basic quiz mode",
      "Score summary after each quiz",
      "Access to 3 courses",
      "Weekly progress report",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: "/signup",
  },
  {
    name: "Pro",
    price: "₦1,500",
    period: "/ month",
    desc: "For serious exam candidates",
    color: "border-primary-500 ring-2 ring-primary-500",
    badge: "Most Popular",
    features: [
      "Unlimited practice questions",
      "Quiz + Study mode",
      "Detailed explanations for every question",
      "All 50+ courses",
      "Full analytics & topic breakdown",
      "Bookmarks & notes",
      "Leaderboard access",
      "Priority support",
    ],
    cta: "Start Pro — ₦1,500/mo",
    ctaVariant: "primary" as const,
    href: "/signup?plan=pro",
  },
  {
    name: "Premium",
    price: "₦2,500",
    period: "/ month",
    desc: "Maximum preparation power",
    color: "border-gray-200",
    features: [
      "Everything in Pro",
      "AI-powered performance insights",
      "Personalised study plan",
      "Exam prediction questions",
      "Offline mode (coming soon)",
      "Dedicated mentor access",
      "Group study rooms",
    ],
    cta: "Start Premium",
    ctaVariant: "outline" as const,
    href: "/signup?plan=premium",
  },
];

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Zap size={14} /> Simple Pricing
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Start free, upgrade when you need more. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl border p-7 relative ${plan.color}`}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm pb-1">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button variant={plan.ctaVariant} fullWidth>{plan.cta}</Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">All prices in Nigerian Naira (₦). Billed monthly. VAT may apply.</p>
      </div>
    </div>
  );
}
