import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import HowItWorksContent from "@/components/shared/landingUi/howItworks";

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <HowItWorksContent />

        <div className="text-center mt-14">
          <Link href="/signup">
            <Button size="lg" rightIcon={<ArrowRight size={18} />}>
              Get Started Free Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
