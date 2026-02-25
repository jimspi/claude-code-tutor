"use client";

interface TerminalLine {
  prompt?: string;
  command: string;
  output: string;
}

interface TerminalDemoProps {
  lines: TerminalLine[];
}

export default function TerminalDemo({ lines }: TerminalDemoProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-stone-800 shadow-lg">
      <div className="flex items-center gap-2 px-4 py-3 bg-stone-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-stone-400 font-mono">Terminal</span>
      </div>
      <div className="p-4 bg-slate-950 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i} className="mb-2 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="text-teal-400">
                {line.prompt || "$"}
              </span>
              <span className="text-stone-200">{line.command}</span>
            </div>
            {line.output && (
              <div className="text-stone-500 ml-4 mt-0.5">{line.output}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
