"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { scenarios, getGenericTips } from "@/data/playgroundScenarios";
import type { PlaygroundScenario } from "@/data/playgroundScenarios";

type Mode = "scenarios" | "freeform";

export default function PlaygroundPage() {
  const [mode, setMode] = useState<Mode>("scenarios");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<PlaygroundScenario | null>(null);
  const [promptText, setPromptText] = useState("");
  const [responseLines, setResponseLines] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [freeformTips, setFreeformTips] = useState<string[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = Array.from(new Set(scenarios.map((s) => s.category)));

  const filtered = activeCategory
    ? scenarios.filter((s) => s.category === activeCategory)
    : scenarios;

  // Auto-scroll response pane
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [responseLines]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const animateResponse = useCallback((lines: string[]) => {
    setResponseLines([]);
    setIsAnimating(true);
    let i = 0;

    const tick = () => {
      if (i < lines.length) {
        setResponseLines((prev) => [...prev, lines[i]]);
        i++;
        animationRef.current = setTimeout(tick, 20);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = setTimeout(tick, 300);
  }, []);

  const handleLoadExample = (scenario: PlaygroundScenario) => {
    setSelectedScenario(scenario);
    setPromptText(scenario.starterPrompt);
    setResponseLines([]);
    setShowTips(false);
    setIsAnimating(false);
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const handleRun = () => {
    if (isAnimating) return;

    if (mode === "scenarios" && selectedScenario) {
      animateResponse(selectedScenario.response);
      setShowTips(true);
    } else if (mode === "freeform" && promptText.trim()) {
      const tips = getGenericTips(promptText);
      setFreeformTips(tips);
      animateResponse([
        "",
        "  Analyzing your prompt...",
        "",
        "  Nice prompt! In a real Claude Code session, Claude would",
        "  now start building this for you.",
        "",
        "  Here are some ways to make your prompt even stronger:",
        "",
        ...tips.map((t) => `  - ${t}`),
        "",
        "  Try loading an example scenario to see a full response.",
        "",
      ]);
      setShowTips(true);
    }
  };

  const handleReset = () => {
    setPromptText("");
    setResponseLines([]);
    setSelectedScenario(null);
    setShowTips(false);
    setIsAnimating(false);
    setFreeformTips([]);
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-teal-600 transition-colors"
        >
          All Levels
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <span className="text-sm text-stone-600">Playground</span>
      </nav>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
        Prompt Playground
      </h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Practice writing prompts and see what Claude Code would do. Load an
        example or write your own — no real API needed.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode("scenarios"); handleReset(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "scenarios"
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Example Scenarios
        </button>
        <button
          onClick={() => { setMode("freeform"); handleReset(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "freeform"
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Write Your Own
        </button>
      </div>

      {/* Category pills (scenarios mode) */}
      {mode === "scenarios" && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? "bg-slate-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Scenario cards (scenarios mode, no scenario selected yet) */}
      {mode === "scenarios" && !selectedScenario && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => handleLoadExample(s)}
              className="text-left p-4 rounded-xl bg-white border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 group-hover:text-teal-500">
                {s.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-900 mt-1">
                {s.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                {s.starterPrompt}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Split pane (scenario selected or freeform) */}
      {(selectedScenario || mode === "freeform") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Left: Prompt pane */}
          <div className="flex flex-col rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Your Prompt
              </span>
              {selectedScenario && (
                <button
                  onClick={handleReset}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Change scenario
                </button>
              )}
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={
                  mode === "freeform"
                    ? "Describe what you want to build, fix, or improve..."
                    : "Click 'Load Example' or type your own prompt..."
                }
                className="w-full h-40 text-sm text-slate-800 placeholder-stone-400 resize-none outline-none leading-relaxed"
              />
            </div>
            <div className="px-4 py-3 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isAnimating || !promptText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isAnimating ? "Running..." : "See What Claude Does"}
              </button>
              {mode === "scenarios" && selectedScenario && !responseLines.length && (
                <button
                  onClick={() => handleLoadExample(selectedScenario)}
                  className="px-3 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-50 transition-colors"
                >
                  Load Example
                </button>
              )}
            </div>
          </div>

          {/* Right: Response pane */}
          <div className="flex flex-col rounded-xl border border-[#313244] bg-[#1e1e2e] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#313244] flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f9e2af]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]" />
              <span className="ml-2 text-xs text-[#6c7086] font-mono">
                Claude Code Output
              </span>
            </div>
            <div
              ref={responseRef}
              className="flex-1 p-4 min-h-[250px] max-h-[400px] overflow-y-auto font-mono text-sm"
              style={{ fontFamily: "var(--font-mono), 'Fira Code', 'Consolas', monospace" }}
            >
              {responseLines.length === 0 && !isAnimating ? (
                <p className="text-[#6c7086] text-xs">
                  Click &quot;See What Claude Does&quot; to simulate a response...
                </p>
              ) : (
                responseLines.map((line, i) => (
                  <div key={i} className="text-[#cdd6f4] leading-relaxed">
                    {line || "\u00A0"}
                  </div>
                ))
              )}
              {isAnimating && (
                <span className="inline-block w-[8px] h-[16px] bg-[#a6e3a1] animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips & Follow-ups (after response shown) */}
      {showTips && responseLines.length > 0 && !isAnimating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Tips */}
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-bold text-amber-800 mb-3">
              Prompt Tips
            </h3>
            <ul className="space-y-2">
              {(mode === "scenarios" && selectedScenario
                ? selectedScenario.tips
                : freeformTips
              ).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">*</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow-ups (scenario mode only) */}
          {mode === "scenarios" && selectedScenario && (
            <div className="p-5 rounded-xl bg-teal-50 border border-teal-200">
              <h3 className="text-sm font-bold text-teal-800 mb-3">
                Make It Better — Try These Follow-ups
              </h3>
              <ul className="space-y-2">
                {selectedScenario.followUps.map((fu, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-teal-900">
                    <span className="text-teal-500 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <code className="text-xs bg-teal-100 px-2 py-1 rounded">
                      {fu}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
