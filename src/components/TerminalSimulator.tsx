"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TerminalExercise } from "@/data/terminalExercises";

interface TerminalSimulatorProps {
  exercise: TerminalExercise;
  onComplete?: () => void;
}

type HistoryEntry =
  | { type: "prompt"; prompt: string; text: string }
  | { type: "output"; text: string }
  | { type: "note"; text: string }
  | { type: "success"; text: string };

export default function TerminalSimulator({
  exercise,
  onComplete,
}: TerminalSimulatorProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("~$ ");
  const [isMobile, setIsMobile] = useState(false);
  const [showError, setShowError] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = exercise.steps[currentStep];

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showHint, showError]);

  // Focus input on click
  const focusInput = () => {
    if (inputRef.current && !isAnimating) {
      inputRef.current.focus();
    }
  };

  // Reset hint timer on input change
  useEffect(() => {
    if (completed || isAnimating) return;
    setShowHint(false);
    setShowError(false);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowHint(true), 5000);
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [inputValue, currentStep, completed, isAnimating]);

  // Animate output lines
  const animateOutput = useCallback(
    (lines: string[], explanationNote: string | undefined, promptOverride: string | undefined, successMsg: string | undefined) => {
      setIsAnimating(true);
      let i = 0;

      const tick = () => {
        if (i < lines.length) {
          const line = lines[i];
          setHistory((prev) => [...prev, { type: "output", text: line }]);
          i++;
          setTimeout(tick, 18);
        } else {
          // Show explanation note if present
          if (explanationNote) {
            setHistory((prev) => [...prev, { type: "note", text: explanationNote }]);
          }
          // Show success message
          if (successMsg) {
            setHistory((prev) => [...prev, { type: "success", text: successMsg }]);
          }
          // Update prompt if needed
          if (promptOverride) {
            setCurrentPrompt(promptOverride + " ");
          }
          setIsAnimating(false);

          // Advance step
          setCurrentStep((prev) => {
            const next = prev + 1;
            if (next >= exercise.steps.length) {
              setCompleted(true);
              onComplete?.();
            }
            return next;
          });
        }
      };

      // Small initial delay
      setTimeout(tick, 100);
    },
    [exercise.steps.length, onComplete]
  );

  const executeStep = useCallback(
    (stepData: typeof step) => {
      if (!stepData || isAnimating) return;

      // Add command to history
      setHistory((prev) => [
        ...prev,
        { type: "prompt", prompt: currentPrompt, text: stepData.command },
      ]);

      setInputValue("");
      setShowHint(false);
      setShowError(false);

      animateOutput(
        stepData.output,
        stepData.explanationNote,
        stepData.promptOverride,
        stepData.successMessage
      );
    },
    [currentPrompt, isAnimating, animateOutput]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || isAnimating || completed || !step) return;

    const typed = inputValue.trim();
    if (!typed) return;

    // Check if command matches expected
    if (typed === step.command) {
      executeStep(step);
    } else {
      // Wrong command — show it in history + error
      setHistory((prev) => [
        ...prev,
        { type: "prompt", prompt: currentPrompt, text: typed },
      ]);
      setInputValue("");
      setShowError(true);
      setShowHint(true);
    }
  };

  // Mobile tap-to-execute
  const handleTapExecute = () => {
    if (!step || isAnimating || completed) return;
    executeStep(step);
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentStep(0);
    setInputValue("");
    setIsAnimating(false);
    setShowHint(false);
    setShowError(false);
    setCompleted(false);
    setCurrentPrompt("~$ ");
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
  };

  const handleSkip = () => {
    // Run through all remaining steps instantly
    const entries: HistoryEntry[] = [];
    let prompt = currentPrompt;

    for (let i = currentStep; i < exercise.steps.length; i++) {
      const s = exercise.steps[i];
      entries.push({ type: "prompt", prompt, text: s.command });
      s.output.forEach((line) => entries.push({ type: "output", text: line }));
      if (s.explanationNote) entries.push({ type: "note", text: s.explanationNote });
      if (s.successMessage) entries.push({ type: "success", text: s.successMessage });
      if (s.promptOverride) prompt = s.promptOverride + " ";
    }

    setHistory((prev) => [...prev, ...entries]);
    setCurrentPrompt(prompt);
    setCurrentStep(exercise.steps.length);
    setCompleted(true);
    onComplete?.();
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[#313244] shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#181825]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
          <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
          <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
        </div>
        <span className="ml-2 text-xs text-[#6c7086] font-mono">
          {exercise.title}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {!completed && (
            <button
              onClick={handleSkip}
              className="text-[10px] text-[#6c7086] hover:text-[#cdd6f4] px-2 py-0.5 rounded transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleReset}
            className="text-[10px] text-[#6c7086] hover:text-[#cdd6f4] px-2 py-0.5 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="p-4 bg-[#1e1e2e] font-mono text-sm min-h-[180px] max-h-[400px] overflow-y-auto cursor-text"
        style={{ fontFamily: "var(--font-mono), 'Fira Code', 'Consolas', monospace" }}
      >
        {/* History */}
        {history.map((entry, i) => (
          <div key={i} className="leading-relaxed">
            {entry.type === "prompt" ? (
              <div className="flex">
                <span className="text-[#a6e3a1] select-none">{entry.prompt}</span>
                <span className="text-[#cdd6f4]">{entry.text}</span>
              </div>
            ) : entry.type === "output" ? (
              <div className="text-[#bac2de] pl-0">{entry.text || "\u00A0"}</div>
            ) : entry.type === "note" ? (
              <div className="text-[#f9e2af] text-xs mt-1 mb-1 pl-0 italic">
                {entry.text}
              </div>
            ) : entry.type === "success" ? (
              <div className="flex items-center gap-1.5 text-[#a6e3a1] text-xs mt-1 mb-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {entry.text}
              </div>
            ) : null}
          </div>
        ))}

        {/* Active input line (desktop) */}
        {!completed && !isAnimating && !isMobile && (
          <div className="flex items-center">
            <span className="text-[#a6e3a1] select-none">{currentPrompt}</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[#cdd6f4] outline-none caret-[#a6e3a1] font-mono text-sm"
                style={{ fontFamily: "inherit" }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                autoFocus
              />
              {inputValue === "" && (
                <span className="absolute left-0 top-0 inline-block w-[8px] h-[18px] bg-[#a6e3a1] animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        )}

        {/* Blinking cursor during animation */}
        {isAnimating && (
          <span className="inline-block w-[8px] h-[18px] bg-[#a6e3a1] animate-pulse" />
        )}

        {/* Completion message */}
        {completed && (
          <div className="mt-4 p-3 rounded-lg bg-[#a6e3a1]/10 border border-[#a6e3a1]/20">
            <p className="text-[#a6e3a1] text-sm font-medium">
              {exercise.completionMessage}
            </p>
          </div>
        )}
      </div>

      {/* Mobile tap-to-execute bar */}
      {isMobile && !completed && !isAnimating && step && (
        <div className="px-4 py-3 bg-[#181825] border-t border-[#313244]">
          <button
            onClick={handleTapExecute}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#313244] hover:bg-[#45475a] transition-colors"
          >
            <code className="text-[#a6e3a1] text-sm font-mono">
              {step.command}
            </code>
            <span className="text-[#6c7086] text-xs">Tap to run</span>
          </button>
        </div>
      )}

      {/* Hint / error bar */}
      {!completed && (showHint || showError) && (
        <div className="px-4 py-2.5 bg-[#181825] border-t border-[#313244]">
          {showError && (
            <p className="text-[#f38ba8] text-xs mb-1.5">
              That command isn&apos;t part of this exercise — try the one shown below.
            </p>
          )}
          {showHint && step && (
            <p className="text-[#6c7086] text-xs">
              {step.hint}
            </p>
          )}
        </div>
      )}

      {/* Progress dots */}
      <div className="px-4 py-2.5 bg-[#181825] border-t border-[#313244] flex items-center gap-1.5">
        {exercise.steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < currentStep
                ? "bg-[#a6e3a1]"
                : i === currentStep && !completed
                ? "bg-[#f9e2af]"
                : "bg-[#313244]"
            }`}
          />
        ))}
        <span className="ml-auto text-[10px] text-[#6c7086]">
          {Math.min(currentStep, exercise.steps.length)}/{exercise.steps.length}
        </span>
      </div>
    </div>
  );
}
