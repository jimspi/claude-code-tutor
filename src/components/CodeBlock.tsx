"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export default function CodeBlock({
  code,
  language = "bash",
  label,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-stone-800 shadow-lg">
      {label && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-800 border-b border-stone-700">
          <span className="text-xs font-medium text-stone-400">{label}</span>
          <span className="text-xs text-stone-500">{language}</span>
        </div>
      )}
      <div className="relative group">
        <pre className="p-4 bg-slate-950 overflow-x-auto">
          <code className="text-sm font-mono leading-relaxed text-stone-300">
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-800 text-stone-400 opacity-0 group-hover:opacity-100 hover:bg-stone-700 hover:text-stone-200 transition-all duration-200 border border-stone-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
