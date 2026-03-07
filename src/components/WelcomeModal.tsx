"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WELCOME_KEY = "claude-academy-welcomed";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ terminal: false, website: false });
  const router = useRouter();

  const handleFinish = () => {
    localStorage.setItem(WELCOME_KEY, "true");

    // Recommend a starting point based on answers
    let target = "/level/1/1-1"; // default: very beginning

    if (answers.terminal && answers.website) {
      // Experienced — skip to prompting
      target = "/level/2/2-1";
    } else if (answers.terminal || answers.website) {
      // Some experience — start at first conversation
      target = "/level/1/1-3";
    }

    onClose();
    router.push(target);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-teal-500" : i < step ? "bg-teal-300" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                Welcome to Claude Code Academy
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-8">
                We&apos;ll get you building real things with AI in no time. Let&apos;s
                figure out the best starting point for you.
              </p>
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Let&apos;s go
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(WELCOME_KEY, "true");
                  onClose();
                }}
                className="mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Skip — I&apos;ll find my own way
              </button>
            </div>
          )}

          {/* Step 1: Terminal experience */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
                Have you ever used the terminal before?
              </h2>
              <p className="text-stone-500 text-sm mb-8">
                The terminal is the text-based window where you type commands.
                Sometimes called the command line.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setAnswers((a) => ({ ...a, terminal: true }));
                    setStep(2);
                  }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 text-sm font-medium text-slate-800 hover:border-teal-400 hover:bg-teal-50 transition-all"
                >
                  Yes, I&apos;ve used it
                </button>
                <button
                  onClick={() => {
                    setAnswers((a) => ({ ...a, terminal: false }));
                    setStep(2);
                  }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 text-sm font-medium text-slate-800 hover:border-teal-400 hover:bg-teal-50 transition-all"
                >
                  No, never
                </button>
                <button
                  onClick={() => {
                    setAnswers((a) => ({ ...a, terminal: false }));
                    setStep(2);
                  }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 text-sm font-medium text-stone-500 hover:border-teal-400 hover:bg-teal-50 transition-all"
                >
                  I&apos;m not sure what that is
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Website experience */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
                Have you ever built a website?
              </h2>
              <p className="text-stone-500 text-sm mb-8">
                Even a simple one — with HTML, a website builder, WordPress, anything.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setAnswers((a) => ({ ...a, website: true }));
                    setStep(3);
                  }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 text-sm font-medium text-slate-800 hover:border-teal-400 hover:bg-teal-50 transition-all"
                >
                  Yes, I have some experience
                </button>
                <button
                  onClick={() => {
                    setAnswers((a) => ({ ...a, website: false }));
                    setStep(3);
                  }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 text-sm font-medium text-slate-800 hover:border-teal-400 hover:bg-teal-50 transition-all"
                >
                  No, this is all new to me
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Recommendation */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
                {answers.terminal && answers.website
                  ? "You've got a head start!"
                  : answers.terminal || answers.website
                  ? "Great — you know some of this already"
                  : "Perfect starting point"}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-2">
                {answers.terminal && answers.website
                  ? "We'll skip the basics and jump straight to writing effective prompts."
                  : answers.terminal || answers.website
                  ? "We'll start with your first Claude Code conversation — the fun part."
                  : "We'll start from the very beginning. No experience needed."}
              </p>
              <p className="text-xs text-stone-400 mb-8">
                {answers.terminal && answers.website
                  ? "Starting at: Level 2 — Writing Good Prompts"
                  : answers.terminal || answers.website
                  ? "Starting at: Level 1 — Your First Conversation"
                  : "Starting at: Level 1 — What Is Claude Code?"}
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
              >
                Start learning
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(WELCOME_KEY, "true");
                  onClose();
                }}
                className="mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                I&apos;ll browse on my own instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function hasSeenWelcome(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(WELCOME_KEY) === "true";
}
