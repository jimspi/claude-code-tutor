"use client";

import { useState, useRef, useEffect } from "react";

type Phase = "intro" | "claude-chat" | "copy" | "claude-code" | "done";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const CLAUDE_CHAT_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    text: "You're a Claude Code prompt expert. Write a prompt that I'll paste into Claude Code that builds a modern recipe organizer app. I want it to have a clean design, the ability to add recipes with a title, ingredients, and instructions, a search bar to filter by name, and I want it saved to local storage so nothing gets lost. Use React and Tailwind CSS.",
  },
  {
    role: "assistant",
    text: `Here's a ready-to-paste prompt for Claude Code:

"Create a recipe organizer web app using React and Tailwind CSS. The app should include:

1. A homepage showing all saved recipes as cards in a responsive grid layout
2. An 'Add Recipe' form with fields for: recipe title, ingredients (as a textarea, one per line), and cooking instructions (as a textarea)
3. A search bar at the top that filters recipes by title in real-time as the user types
4. Each recipe card should show the title and a preview of the ingredients. Clicking a card opens the full recipe in a modal or expanded view
5. All recipes should be saved to localStorage so they persist between browser sessions
6. Include a delete button on each recipe with a confirmation prompt
7. Use a warm, kitchen-themed color palette — think soft cream backgrounds, warm orange accents, and dark brown text
8. Make the layout fully responsive for mobile, tablet, and desktop
9. Add empty state messaging when no recipes exist yet: 'No recipes yet — add your first one!'
10. Keep the code clean and well-organized with separate components for the recipe card, form, and search bar"

This prompt gives Claude Code clear structure, specific features, design direction, and technical requirements. You should get a solid first build that you can then iterate on.`,
  },
];

const CLAUDE_CODE_PROMPT = `Create a recipe organizer web app using React and Tailwind CSS. The app should include:

1. A homepage showing all saved recipes as cards in a responsive grid layout
2. An 'Add Recipe' form with fields for: recipe title, ingredients (as a textarea, one per line), and cooking instructions (as a textarea)
3. A search bar at the top that filters recipes by title in real-time as the user types
4. Each recipe card should show the title and a preview of the ingredients. Clicking a card opens the full recipe in a modal or expanded view
5. All recipes should be saved to localStorage so they persist between browser sessions
6. Include a delete button on each recipe with a confirmation prompt
7. Use a warm, kitchen-themed color palette — think soft cream backgrounds, warm orange accents, and dark brown text
8. Make the layout fully responsive for mobile, tablet, and desktop
9. Add empty state messaging when no recipes exist yet: 'No recipes yet — add your first one!'
10. Keep the code clean and well-organized with separate components for the recipe card, form, and search bar`;

const CLAUDE_CODE_RESPONSE: string[] = [
  "I'll build this recipe organizer app for you. Let me plan the structure first.",
  "",
  "Planned files:",
  "  src/App.tsx — Main app with search and layout",
  "  src/components/RecipeCard.tsx — Individual recipe card",
  "  src/components/RecipeForm.tsx — Add recipe form",
  "  src/components/RecipeModal.tsx — Full recipe view",
  "  src/components/SearchBar.tsx — Search/filter bar",
  "  src/hooks/useLocalStorage.ts — localStorage persistence",
  "",
  "Creating src/App.tsx...",
  "Creating src/components/RecipeCard.tsx...",
  "Creating src/components/RecipeForm.tsx...",
  "Creating src/components/RecipeModal.tsx...",
  "Creating src/components/SearchBar.tsx...",
  "Creating src/hooks/useLocalStorage.ts...",
  "",
  "Done. Created 6 files. Your recipe organizer is ready.",
  "Run `npm run dev` to see it in your browser.",
];

export default function PromptHackDemo() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [chatIndex, setChatIndex] = useState(-1);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [isCodeAnimating, setIsCodeAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatIndex, typingText]);

  useEffect(() => {
    if (codeScrollRef.current) codeScrollRef.current.scrollTop = codeScrollRef.current.scrollHeight;
  }, [codeLines]);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (codeRef.current) clearInterval(codeRef.current);
    };
  }, []);

  const typeMessage = (text: string, onDone: () => void) => {
    setIsTyping(true);
    setTypingText("");
    let i = 0;
    typingRef.current = setInterval(() => {
      if (i < text.length) {
        setTypingText(text.slice(0, i + 1));
        i++;
      } else {
        if (typingRef.current) clearInterval(typingRef.current);
        setIsTyping(false);
        onDone();
      }
    }, 12);
  };

  const startChatPhase = () => {
    setPhase("claude-chat");
    setChatIndex(0);
    // Show user message immediately, then type assistant response
    setTimeout(() => {
      setChatIndex(1);
      typeMessage(CLAUDE_CHAT_MESSAGES[1].text, () => {
        // Done typing — wait a beat then show copy phase
        setTimeout(() => setPhase("copy"), 800);
      });
    }, 1000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setPhase("claude-code");
      // Animate Claude Code response
      setIsCodeAnimating(true);
      let lineIdx = 0;
      codeRef.current = setInterval(() => {
        if (lineIdx < CLAUDE_CODE_RESPONSE.length) {
          setCodeLines((prev) => [...prev, CLAUDE_CODE_RESPONSE[lineIdx]]);
          lineIdx++;
        } else {
          if (codeRef.current) clearInterval(codeRef.current);
          setIsCodeAnimating(false);
          setTimeout(() => setPhase("done"), 500);
        }
      }, 120);
    }, 600);
  };

  const handleReset = () => {
    if (typingRef.current) clearInterval(typingRef.current);
    if (codeRef.current) clearInterval(codeRef.current);
    setPhase("intro");
    setChatIndex(-1);
    setTypingText("");
    setIsTyping(false);
    setCodeLines([]);
    setIsCodeAnimating(false);
    setCopied(false);
  };

  return (
    <div className="my-8">
      {/* Intro */}
      {phase === "intro" && (
        <div className="text-center py-6">
          <button
            onClick={startChatPhase}
            className="px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Watch the hack in action
          </button>
        </div>
      )}

      {/* Phase indicator */}
      {phase !== "intro" && (
        <div className="flex items-center justify-center gap-4 mb-4">
          {["claude-chat", "copy", "claude-code"].map((p, i) => {
            const labels = ["Step 1: Ask Claude", "Step 2: Copy prompt", "Step 3: Paste in Claude Code"];
            const isActive = (p === "claude-chat" && (phase === "claude-chat" || phase === "copy")) ||
              (p === "copy" && phase === "copy") ||
              (p === "claude-code" && (phase === "claude-code" || phase === "done"));
            const isDone = (p === "claude-chat" && (phase === "copy" || phase === "claude-code" || phase === "done")) ||
              (p === "copy" && (phase === "claude-code" || phase === "done")) ||
              (p === "claude-code" && phase === "done");
            return (
              <div key={p} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone ? "bg-teal-500 text-white" :
                  isActive ? "bg-amber-500 text-white" :
                  "bg-stone-200 text-stone-500"
                }`}>
                  {isDone ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive || isDone ? "text-slate-700" : "text-stone-400"
                }`}>
                  {labels[i]}
                </span>
              </div>
            );
          })}
          <button onClick={handleReset} className="ml-4 text-xs text-stone-400 hover:text-stone-600">
            Reset
          </button>
        </div>
      )}

      {/* Claude Chat Window */}
      {(phase === "claude-chat" || phase === "copy") && (
        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-lg">
          {/* Title bar — Claude chat style (light) */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f0e8] border-b border-stone-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="ml-2 text-xs text-stone-600 font-medium">claude.ai</span>
          </div>

          <div ref={scrollRef} className="p-5 bg-[#faf8f4] min-h-[200px] max-h-[420px] overflow-y-auto space-y-4">
            {/* User message */}
            {chatIndex >= 0 && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#e8dfd3] text-stone-800 rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                  {CLAUDE_CHAT_MESSAGES[0].text}
                </div>
              </div>
            )}

            {/* Assistant response */}
            {chatIndex >= 1 && (
              <div className="flex justify-start">
                <div className="max-w-[85%] text-stone-800 text-sm leading-relaxed">
                  <p className="text-xs font-semibold text-[#b5866b] mb-1.5">Claude</p>
                  <div className="whitespace-pre-wrap">
                    {isTyping ? typingText : CLAUDE_CHAT_MESSAGES[1].text}
                    {isTyping && (
                      <span className="inline-block w-1.5 h-4 bg-[#b5866b] ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Copy action bar */}
          {phase === "copy" && (
            <div className="px-4 py-3 bg-[#f0ebe3] border-t border-stone-200 flex items-center gap-3">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xs text-stone-600 flex-1">
                Claude wrote your prompt! Now copy it and paste it into Claude Code.
              </p>
              <button
                onClick={handleCopy}
                disabled={copied}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-teal-100 text-teal-700"
                    : "bg-amber-500 text-white hover:bg-amber-600 shadow-md"
                }`}
              >
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Claude Code Window */}
      {(phase === "claude-code" || phase === "done") && (
        <div className="rounded-xl overflow-hidden border border-[#313244] shadow-lg mt-4">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#181825]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
              <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
              <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
            </div>
            <span className="ml-2 text-xs text-[#6c7086] font-mono">Claude Code</span>
            {phase === "done" && (
              <span className="ml-auto text-xs text-[#a6e3a1] font-medium">Build complete</span>
            )}
          </div>

          <div
            ref={codeScrollRef}
            className="p-4 bg-[#1e1e2e] min-h-[150px] max-h-[350px] overflow-y-auto font-mono text-sm"
            style={{ fontFamily: "var(--font-mono), 'Fira Code', 'Consolas', monospace" }}
          >
            {/* Show pasted prompt */}
            <div className="flex mb-2">
              <span className="text-[#a6e3a1] select-none">~$ </span>
              <span className="text-[#cdd6f4] text-xs leading-relaxed">
                {CLAUDE_CODE_PROMPT.slice(0, 80)}...
              </span>
            </div>
            <div className="h-px bg-[#313244] my-2" />

            {/* Claude Code response */}
            {codeLines.map((line, i) => (
              <div key={i} className="text-[#bac2de] leading-relaxed text-xs">
                {line || "\u00A0"}
              </div>
            ))}
            {isCodeAnimating && (
              <span className="inline-block w-[7px] h-[14px] bg-[#a6e3a1] animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* Done message */}
      {phase === "done" && (
        <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-200 animate-[fadeIn_0.4s_ease-out]">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-teal-900">
                That&apos;s the hack.
              </p>
              <p className="text-sm text-teal-800 mt-1 leading-relaxed">
                You used Claude to write a perfect prompt, then fed it to Claude Code. The AI wrote a prompt better than most humans could, and Claude Code built exactly what it described. You didn&apos;t need to know how to write prompts — you just needed to know what you wanted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
