"use client";

import { useState, useRef, useEffect } from "react";
import { ClaudeConversationStep } from "@/lib/content";

interface ClaudeConversationProps {
  title?: string;
  steps: ClaudeConversationStep[];
}

export default function ClaudeConversation({
  title = "Claude Code",
  steps,
}: ClaudeConversationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fileLineIndex, setFileLineIndex] = useState(0);
  const [isFileAnimating, setIsFileAnimating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentStep, typingText, fileLineIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (fileRef.current) clearInterval(fileRef.current);
    };
  }, []);

  const visibleSteps = steps.slice(0, currentStep + 1);
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep >= steps.length - 1;
  const conversationDone = isLastStep && !isTyping && !isFileAnimating;

  // Determine if we need the user to interact to advance
  const needsInteraction = () => {
    if (isTyping || isFileAnimating) return false;
    if (currentStep >= steps.length) return false;
    const nextStep = steps[currentStep + 1];
    if (!nextStep) return false;
    // User steps with suggested=true need a click
    if (nextStep.role === "user" && nextStep.suggested) return true;
    // Permission steps need approval
    if (nextStep.role === "permission") return true;
    return false;
  };

  const advanceStep = () => {
    if (isTyping || isFileAnimating) return;
    const nextIndex = currentStep + 1;
    if (nextIndex >= steps.length) return;

    setCurrentStep(nextIndex);
    const nextStep = steps[nextIndex];

    // Auto-start typing animation for claude messages
    if (nextStep.role === "claude" && nextStep.typing !== false) {
      startTyping(nextStep.message);
    }
    // Auto-start file animation
    else if (nextStep.role === "file-creation") {
      startFileAnimation(nextStep.lines.length);
    }
  };

  const startTyping = (message: string) => {
    setIsTyping(true);
    setTypingText("");
    let charIndex = 0;

    typingRef.current = setInterval(() => {
      if (charIndex < message.length) {
        setTypingText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (typingRef.current) clearInterval(typingRef.current);
        typingRef.current = null;
        setIsTyping(false);
      }
    }, 18);
  };

  const startFileAnimation = (totalLines: number) => {
    setIsFileAnimating(true);
    setFileLineIndex(0);
    let lineIdx = 0;

    fileRef.current = setInterval(() => {
      if (lineIdx < totalLines) {
        setFileLineIndex(lineIdx + 1);
        lineIdx++;
      } else {
        if (fileRef.current) clearInterval(fileRef.current);
        fileRef.current = null;
        setIsFileAnimating(false);
      }
    }, 100);
  };

  // Auto-advance: if current step is shown and doesn't need interaction, check if next step auto-plays
  useEffect(() => {
    if (isTyping || isFileAnimating) return;
    if (currentStep >= steps.length - 1) return;

    const nextStep = steps[currentStep + 1];
    if (!nextStep) return;

    // Auto-advance to claude/file-creation steps after a brief pause
    if (
      nextStep.role === "claude" ||
      nextStep.role === "file-creation"
    ) {
      // Only auto-advance if current step doesn't need interaction
      if (!needsInteraction()) {
        const timeout = setTimeout(() => advanceStep(), 600);
        return () => clearTimeout(timeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isTyping, isFileAnimating]);

  // Start first step if it's a user suggestion
  const firstStep = steps[0];
  const showStartButton =
    currentStep === 0 &&
    !isTyping &&
    firstStep?.role === "user" &&
    firstStep.suggested;

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-stone-800 shadow-lg">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-stone-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-stone-400 font-mono">{title}</span>
        {conversationDone && (
          <span className="ml-auto text-xs text-teal-400 font-medium">
            Session complete
          </span>
        )}
      </div>

      {/* Conversation body */}
      <div
        ref={scrollRef}
        className="p-4 bg-slate-950 min-h-[200px] max-h-[480px] overflow-y-auto space-y-3"
      >
        {showStartButton ? (
          <div className="flex justify-center py-8">
            <button
              onClick={() => {
                setCurrentStep(0);
                // Immediately try to advance to next step
                if (steps.length > 1) {
                  setTimeout(() => {
                    setCurrentStep(1);
                    const next = steps[1];
                    if (next.role === "claude" && next.typing !== false) {
                      startTyping(next.message);
                    } else if (next.role === "file-creation") {
                      startFileAnimation(next.lines.length);
                    }
                  }, 300);
                }
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-sm font-medium transition-colors shadow-md"
            >
              Send: &quot;{firstStep.message.slice(0, 50)}
              {firstStep.message.length > 50 ? "..." : ""}&quot;
            </button>
          </div>
        ) : (
          visibleSteps.map((step, i) => {
            const isCurrent = i === currentStep;

            if (step.role === "user") {
              return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] bg-stone-800 text-stone-200 rounded-xl rounded-tr-sm px-4 py-2.5 text-sm">
                    {step.message}
                  </div>
                </div>
              );
            }

            if (step.role === "claude") {
              const displayText =
                isCurrent && isTyping ? typingText : step.message;
              return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[85%] border-l-2 border-teal-500 pl-3 py-1">
                    <p className="text-xs text-teal-500 font-semibold mb-1">
                      Claude
                    </p>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {displayText}
                      {isCurrent && isTyping && (
                        <span className="inline-block w-1.5 h-4 bg-teal-400 ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                </div>
              );
            }

            if (step.role === "permission") {
              const isActive =
                isCurrent && !isTyping && !isFileAnimating;
              return (
                <div key={i} className="px-2">
                  <div
                    className={`rounded-lg border p-3 ${
                      isActive
                        ? "border-amber-500/50 bg-amber-950/30"
                        : "border-stone-700 bg-stone-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-amber-400">
                        Permission Request
                      </span>
                    </div>
                    <p className="text-sm text-stone-300 mb-1">
                      {step.action}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-stone-500">{step.detail}</p>
                    )}
                    {isActive && (
                      <button
                        onClick={advanceStep}
                        className="mt-3 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        Allow
                      </button>
                    )}
                    {!isActive && i < currentStep && (
                      <span className="inline-block mt-2 text-xs text-teal-500 font-medium">
                        Allowed
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            if (step.role === "file-creation") {
              const visibleLines =
                isCurrent && isFileAnimating
                  ? step.lines.slice(0, fileLineIndex)
                  : step.lines;
              return (
                <div key={i} className="px-2">
                  <div className="rounded-lg bg-stone-900 border border-stone-700 overflow-hidden">
                    <div className="px-3 py-2 bg-stone-800 border-b border-stone-700 flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-teal-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-xs font-mono text-teal-400">
                        {step.filename}
                      </span>
                    </div>
                    <pre className="p-3 text-xs font-mono text-stone-400 leading-relaxed overflow-x-auto max-h-[200px] overflow-y-auto">
                      {visibleLines.map((line, j) => (
                        <div key={j}>
                          <span className="text-stone-600 select-none mr-3">
                            {String(j + 1).padStart(2, " ")}
                          </span>
                          {line}
                        </div>
                      ))}
                      {isCurrent && isFileAnimating && (
                        <span className="inline-block w-1.5 h-3 bg-teal-400 animate-pulse" />
                      )}
                    </pre>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>

      {/* Action bar */}
      {!conversationDone && !showStartButton && (
        <div className="px-4 py-3 bg-stone-900 border-t border-stone-800">
          {(() => {
            const nextStep = steps[currentStep + 1];
            if (!nextStep) return null;

            if (isTyping || isFileAnimating) {
              return (
                <p className="text-xs text-stone-500 animate-pulse">
                  Claude is working...
                </p>
              );
            }

            if (nextStep.role === "user" && nextStep.suggested) {
              return (
                <button
                  onClick={() => {
                    advanceStep();
                    // After setting user message, auto-advance to the next claude/permission step
                    const stepAfter = steps[currentStep + 2];
                    if (stepAfter) {
                      setTimeout(() => {
                        setCurrentStep((prev) => prev + 1);
                        if (
                          stepAfter.role === "claude" &&
                          stepAfter.typing !== false
                        ) {
                          startTyping(stepAfter.message);
                        } else if (stepAfter.role === "file-creation") {
                          startFileAnimation(stepAfter.lines.length);
                        }
                      }, 400);
                    }
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-teal-400 rounded-full text-xs font-mono transition-colors border border-stone-700"
                >
                  Send: &quot;{nextStep.message.slice(0, 60)}
                  {nextStep.message.length > 60 ? "..." : ""}&quot;
                </button>
              );
            }

            if (nextStep.role === "permission") {
              return (
                <p className="text-xs text-stone-500">
                  Waiting for your approval above...
                </p>
              );
            }

            return (
              <button
                onClick={advanceStep}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors border border-stone-700"
              >
                Continue
              </button>
            );
          })()}
        </div>
      )}

      {conversationDone && (
        <div className="px-4 py-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-teal-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-xs text-teal-400 font-medium">
            Conversation complete
          </span>
        </div>
      )}
    </div>
  );
}
