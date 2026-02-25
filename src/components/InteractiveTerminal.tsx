"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalCommand {
  command: string;
  output: string[];
  prompt?: string;
  delay?: number;
}

interface InteractiveTerminalProps {
  title?: string;
  commands: TerminalCommand[];
  allowFreeType?: boolean;
}

type HistoryEntry =
  | { type: "command"; prompt: string; text: string }
  | { type: "output"; text: string };

export default function InteractiveTerminal({
  title = "Terminal",
  commands,
  allowFreeType = false,
}: InteractiveTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [executedSet, setExecutedSet] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runCommand = useCallback(
    (cmdIndex: number) => {
      if (isRunning || executedSet.has(cmdIndex)) return;
      const cmd = commands[cmdIndex];
      if (!cmd) return;

      setIsRunning(true);

      // Add the command line to history
      setHistory((prev) => [
        ...prev,
        { type: "command", prompt: cmd.prompt || "$", text: cmd.command },
      ]);

      if (cmd.output.length === 0) {
        // No output, immediately mark complete
        setExecutedSet((prev) => new Set(prev).add(cmdIndex));
        setIsRunning(false);
        return;
      }

      // Animate output lines
      const delay = cmd.delay || 80;
      let lineIndex = 0;

      intervalRef.current = setInterval(() => {
        if (lineIndex < cmd.output.length) {
          const line = cmd.output[lineIndex];
          setHistory((prev) => [...prev, { type: "output", text: line }]);
          lineIndex++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setExecutedSet((prev) => new Set(prev).add(cmdIndex));
          setIsRunning(false);
        }
      }, delay);
    },
    [commands, executedSet, isRunning]
  );

  const handleFreeType = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !inputValue.trim()) return;

    const typed = inputValue.trim();
    setInputValue("");

    // Check if it matches a known command
    const matchIndex = commands.findIndex(
      (c) => c.command === typed && !executedSet.has(commands.indexOf(c))
    );

    if (matchIndex >= 0) {
      runCommand(matchIndex);
    } else {
      // Unknown command
      setHistory((prev) => [
        ...prev,
        { type: "command", prompt: "$", text: typed },
        { type: "output", text: `bash: ${typed.split(" ")[0]}: command not found` },
      ]);
    }
  };

  const allDone = executedSet.size === commands.length;

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-stone-800 shadow-lg">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-stone-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-stone-400 font-mono">{title}</span>
        {allDone && (
          <span className="ml-auto text-xs text-teal-400 font-medium">
            All commands run
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-4 bg-slate-950 font-mono text-sm min-h-[120px] max-h-[320px] overflow-y-auto"
      >
        {history.length === 0 && !isRunning && (
          <p className="text-stone-600 text-xs">
            Click a command below to run it...
          </p>
        )}
        {history.map((entry, i) => (
          <div key={i} className="mb-0.5">
            {entry.type === "command" ? (
              <div className="flex items-center gap-2">
                <span className="text-teal-400">{entry.prompt}</span>
                <span className="text-stone-200">{entry.text}</span>
              </div>
            ) : (
              <div className="text-stone-500 ml-4">{entry.text || "\u00A0"}</div>
            )}
          </div>
        ))}
        {isRunning && (
          <span className="inline-block w-2 h-4 bg-teal-400 animate-pulse" />
        )}

        {/* Free type input */}
        {allowFreeType && !isRunning && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-teal-400">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleFreeType}
              placeholder="Type a command..."
              className="flex-1 bg-transparent text-stone-200 placeholder-stone-700 outline-none text-sm font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Suggested commands */}
      <div className="px-4 py-3 bg-stone-900 border-t border-stone-800">
        <p className="text-xs text-stone-500 mb-2">
          {allDone ? "All commands completed" : "Click to run:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {commands.map((cmd, i) => {
            const executed = executedSet.has(i);
            return (
              <button
                key={i}
                onClick={() => runCommand(i)}
                disabled={isRunning || executed}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  executed
                    ? "bg-stone-800/50 text-stone-600 cursor-default"
                    : isRunning
                    ? "bg-stone-800 text-stone-600 cursor-wait"
                    : "bg-stone-800 text-teal-400 border border-stone-700 hover:bg-stone-700 hover:text-teal-300 cursor-pointer"
                }`}
              >
                {executed && (
                  <svg
                    className="w-3 h-3 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {cmd.command}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
