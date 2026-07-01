"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { resendOtp, verifyOtp, getProfile } from "@/supabase/auth";
import { useAuthStore } from "@/store/authStore";

const OTP_LENGTH = 8;

export default function ConfirmEmailPage() {
  const { setProfile } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = window.setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => window.clearTimeout(timer);
    }
    if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousOtp = [...otp];
      previousOtp[index - 1] = "";
      setOtp(previousOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    event.preventDefault();
    const nextOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      toast.error("Missing email. Please sign up again.");
      router.push("/signup");
      return;
    }

    const trimmedCode = otp.join("").trim();
    if (!/^[0-9]{8}$/.test(trimmedCode)) {
      setError("Enter the 8-digit code sent to your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const authResult = await verifyOtp(email, trimmedCode);
      if (!authResult?.user) {
        throw new Error(
          "Verification succeeded but no user session was returned.",
        );
      }

      const profile = await getProfile(authResult.user.id);
      if (!profile) {
        throw new Error("Unable to load your profile after verification.");
      }

      setProfile(profile);
      toast.success("Email verified successfully.");
      router.replace(
        profile.onboarding_complete ? "/dashboard" : "/onboarding",
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to verify code. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }
    setResendLoading(true);
    try {
      await resendOtp(email);
      toast.success("Verification code resent. Check your inbox.");
      setResendDisabled(true);
      setResendCountdown(60);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again.";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(
        /(.{2})(.*)(?=@)/,
        (_, a, b) => `${a}${"*".repeat(Math.max(0, b.length))}`,
      )
    : "your email";

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-primary-50 grid place-items-center text-primary-700">
            <ShieldCheck size={32} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">
              Verify your email
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Confirm your account with OTP
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            Enter the 8-digit code we sent to{" "}
            <span className="font-semibold text-slate-900">{maskedEmail}</span>.
            If you did not receive it, resend the code and check your inbox or
            spam folder.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Verification code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="h-14 w-12 rounded-2xl border border-gray-200 bg-white text-center text-xl font-semibold text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:h-16 sm:w-14"
                />
              ))}
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Verify code
          </Button>

          <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Need a new code?</p>
            <p className="mt-2">
              If the original email did not arrive, resend the verification code
              and try again.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                loading={resendLoading}
                disabled={resendDisabled}
                onClick={handleResendOtp}
              >
                {resendDisabled
                  ? `Resend in ${resendCountdown}s`
                  : "Resend code"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-primary-100 bg-primary-50 px-6 py-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Why this step matters</p>
        <p className="mt-2 leading-7">
          Verifying your email helps keep your ExamQuest profile secure and
          ensures you receive exam updates, progress reminders, and results
          safely.
        </p>
      </div>
    </div>
  );
}
