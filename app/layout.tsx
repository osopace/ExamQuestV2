import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ExamQuest — Nigeria's #1 Exam Prep Platform",
  description: "Ace WAEC, JAMB UTME, Post-UTME and university exams with smart practice questions and detailed analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background antialiased`}>
        {children}
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />
      </body>
    </html>
  );
}
