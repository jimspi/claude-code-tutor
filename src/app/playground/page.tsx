"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import PaywallGate from "@/components/PaywallGate";
import { useAuth } from "@/contexts/AuthContext";
import { analyzePrompt, type PromptAnalysis } from "@/lib/promptAnalyzer";
import { promptTemplates, EXAMPLE_PROMPTS, type PromptTemplate } from "@/data/promptTemplates";

type Tool = "analyzer" | "builder" | "templates" | "compare";

const TOOLS: { id: Tool; title: string; desc: string }[] = [
  { id: "analyzer", title: "Prompt Analyzer", desc: "Paste a prompt and get instant scoring with feedback" },
  { id: "builder", title: "Prompt Builder", desc: "Assemble a prompt step-by-step with guided fields" },
  { id: "templates", title: "Templates", desc: "Fill-in-the-blank templates for common tasks" },
  { id: "compare", title: "Compare", desc: "Put two prompts side-by-side and see which is stronger" },
];

// ─── Score Ring ───
function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#14b8a6" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e7e5e4" strokeWidth={4} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold text-slate-900">{score}</span>
      </div>
      {label && <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">{label}</span>}
    </div>
  );
}

// ─── Category Bar ───
function CategoryBar({ name, score, label, feedback }: { name: string; score: number; label: string; feedback: string }) {
  const color =
    score >= 80 ? "bg-teal-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-400";
  const labelColor =
    score >= 80 ? "text-teal-700 bg-teal-50" : score >= 60 ? "text-amber-700 bg-amber-50" : score >= 40 ? "text-orange-700 bg-orange-50" : "text-red-700 bg-red-50";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-700">{name}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${labelColor}`}>{label}</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      {feedback && <p className="text-[11px] text-stone-500 leading-snug">{feedback}</p>}
    </div>
  );
}

// ─── Analysis Panel ───
function AnalysisPanel({ analysis }: { analysis: PromptAnalysis }) {
  if (analysis.overallScore === 0) {
    return (
      <div className="flex items-center justify-center h-full text-stone-400 text-sm">
        Start typing to see your prompt score...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score header */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <ScoreRing score={analysis.overallScore} size={90} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">{analysis.grade}</span>
            <span className="text-sm text-stone-500">
              {analysis.overallScore >= 80 ? "Ready to use" :
               analysis.overallScore >= 60 ? "Good start" :
               analysis.overallScore >= 40 ? "Needs work" : "Too vague"}
            </span>
          </div>
          <p className="text-xs text-stone-400">
            {analysis.overallScore >= 80
              ? "This prompt gives Claude enough detail to build something great."
              : analysis.overallScore >= 60
              ? "Claude can work with this, but more detail means a better first draft."
              : "Claude will have to guess a lot. Add more specifics."}
          </p>
        </div>
      </div>

      {/* Category scores */}
      <div className="space-y-4">
        {analysis.categories.map((cat) => (
          <CategoryBar key={cat.name} {...cat} />
        ))}
      </div>

      {/* What's missing */}
      {analysis.missing.length > 0 && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100">
          <h4 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wider">Missing</h4>
          <ul className="space-y-1.5">
            {analysis.missing.map((m, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
          <h4 className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wider">Suggestions</h4>
          <ul className="space-y-1.5">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">*</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured breakdown */}
      {analysis.structured.what && (
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <h4 className="text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">Prompt Breakdown</h4>
          <div className="space-y-2">
            {(["what", "where", "how"] as const).map((key) => (
              <div key={key}>
                <span className="text-[10px] font-bold text-teal-600 uppercase">{key}: </span>
                <span className={`text-xs ${
                  analysis.structured[key].startsWith("Not specified")
                    ? "text-stone-400 italic"
                    : "text-stone-700"
                }`}>
                  {analysis.structured[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Analyzer Tool ───
function AnalyzerTool() {
  const [text, setText] = useState("");
  const analysis = useMemo(() => analyzePrompt(text), [text]);

  const loadExample = (type: "vague" | "strong") => {
    const examples = EXAMPLE_PROMPTS[type];
    setText(examples[Math.floor(Math.random() * examples.length)]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="flex flex-col rounded-xl border border-stone-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Your Prompt</span>
          <div className="flex gap-2">
            <button onClick={() => loadExample("vague")} className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium">
              Load vague example
            </button>
            <button onClick={() => loadExample("strong")} className="text-[10px] px-2 py-1 rounded bg-teal-50 text-teal-600 hover:bg-teal-100 font-medium">
              Load strong example
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type a prompt you'd use in Claude Code...&#10;&#10;For example: &quot;Create a landing page for my coffee shop with a hero section, menu, and contact form. Use warm brown and cream colors.&quot;"
          className="flex-1 p-4 text-sm text-slate-800 placeholder-stone-400 resize-none outline-none leading-relaxed min-h-[300px]"
        />
        <div className="px-4 py-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[10px] text-stone-400">{text.split(/\s+/).filter(Boolean).length} words</span>
          {text && (
            <button onClick={() => setText("")} className="text-[10px] text-stone-400 hover:text-stone-600">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Analysis */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 min-h-[300px]">
        <AnalysisPanel analysis={analysis} />
      </div>
    </div>
  );
}

// ─── Builder Tool ───
type TaskType = "build" | "feature" | "fix" | "refactor" | "style";

const TASK_TYPES: { id: TaskType; label: string; icon: string }[] = [
  { id: "build", label: "Build New", icon: "+" },
  { id: "feature", label: "Add Feature", icon: "^" },
  { id: "fix", label: "Fix Bug", icon: "!" },
  { id: "refactor", label: "Refactor", icon: "~" },
  { id: "style", label: "Restyle", icon: "#" },
];

const BUILDER_FIELDS: Record<TaskType, { id: string; label: string; placeholder: string; multiline?: boolean }[]> = {
  build: [
    { id: "what", label: "What are you building?", placeholder: "A recipe organizer web app" },
    { id: "features", label: "Key features (one per line)", placeholder: "Add/edit/delete recipes\nSearch by name\nCategories (breakfast, lunch, dinner)\nSave to localStorage", multiline: true },
    { id: "tech", label: "Tech stack", placeholder: "React, Tailwind CSS" },
    { id: "design", label: "Design / colors", placeholder: "Warm kitchen theme — cream backgrounds, orange accents" },
    { id: "extras", label: "Extra requirements", placeholder: "Responsive, empty states, clean component structure" },
  ],
  feature: [
    { id: "what", label: "What feature?", placeholder: "Dark mode toggle" },
    { id: "where", label: "Where does it go?", placeholder: "In the top-right of the navbar" },
    { id: "how", label: "How should it work?", placeholder: "Click to toggle, saves preference to localStorage, smooth transition" },
    { id: "tech", label: "Current tech stack", placeholder: "React, Tailwind, Next.js" },
  ],
  fix: [
    { id: "error", label: "Error / symptom", placeholder: "TypeError: Cannot read property 'map' of undefined", multiline: true },
    { id: "expected", label: "Expected behavior", placeholder: "User list should render after data loads" },
    { id: "actual", label: "Actual behavior", placeholder: "Page crashes on first render with white screen" },
    { id: "file", label: "File and line", placeholder: "src/components/UserList.tsx, around line 12" },
  ],
  refactor: [
    { id: "what", label: "What to refactor?", placeholder: "src/App.tsx — it's 350 lines and does too much" },
    { id: "goal", label: "Goal", placeholder: "Break into smaller, focused components" },
    { id: "keep", label: "What to preserve", placeholder: "Same visual output, same API, same file structure" },
  ],
  style: [
    { id: "what", label: "What to restyle?", placeholder: "The homepage / landing page" },
    { id: "style", label: "Target style", placeholder: "Modern, clean, with more whitespace" },
    { id: "changes", label: "Specific changes", placeholder: "Larger headings, card shadows, better spacing, new color palette", multiline: true },
    { id: "ref", label: "Inspiration (optional)", placeholder: "Like Stripe's marketing pages" },
  ],
};

function assembleBuildPrompt(taskType: TaskType, values: Record<string, string>): string {
  const v = values;
  switch (taskType) {
    case "build": {
      const parts = [`Create ${v.what || "[what you want to build]"}.`];
      if (v.tech) parts.push(`Use ${v.tech}.`);
      if (v.features) {
        const items = v.features.split("\n").map((f) => f.trim()).filter(Boolean);
        if (items.length > 0) parts.push(`\n\nFeatures:\n${items.map((f, i) => `${i + 1}. ${f}`).join("\n")}`);
      }
      if (v.design) parts.push(`\nDesign: ${v.design}.`);
      if (v.extras) parts.push(`\n${v.extras}.`);
      parts.push("\nMake it responsive and keep the code clean with separate components.");
      return parts.join(" ").replace(/ {2,}/g, " ");
    }
    case "feature": {
      const parts = [`Add ${v.what || "[the feature]"} to my ${v.tech || ""} project.`];
      if (v.where) parts.push(`Put it ${v.where}.`);
      if (v.how) parts.push(`It should: ${v.how}.`);
      parts.push("Match the existing design style.");
      return parts.join(" ");
    }
    case "fix": {
      const parts = ["I need help fixing a bug."];
      if (v.error) parts.push(`\n\nError: ${v.error}`);
      if (v.expected) parts.push(`\nExpected: ${v.expected}`);
      if (v.actual) parts.push(`\nActual: ${v.actual}`);
      if (v.file) parts.push(`\nFile: ${v.file}`);
      parts.push("\nFind the root cause and fix it. Add any missing error handling.");
      return parts.join("");
    }
    case "refactor": {
      const parts = [`Refactor ${v.what || "[target file]"}.`];
      if (v.goal) parts.push(`Goal: ${v.goal}.`);
      if (v.keep) parts.push(`Keep: ${v.keep}.`);
      return parts.join(" ");
    }
    case "style": {
      const parts = [`Redesign ${v.what || "[target]"} to look ${v.style || "more modern and polished"}.`];
      if (v.changes) parts.push(`Changes: ${v.changes}.`);
      if (v.ref) parts.push(`Style reference: ${v.ref}.`);
      parts.push("Make sure it's responsive.");
      return parts.join(" ");
    }
  }
}

function BuilderTool() {
  const [taskType, setTaskType] = useState<TaskType>("build");
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const fields = BUILDER_FIELDS[taskType];
  const assembled = assembleBuildPrompt(taskType, values);
  const analysis = useMemo(() => analyzePrompt(assembled), [assembled]);

  const handleFieldChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(assembled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [assembled]);

  const handleReset = () => {
    setValues({});
  };

  return (
    <div className="space-y-6">
      {/* Task type selector */}
      <div className="flex flex-wrap gap-2">
        {TASK_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTaskType(t.id); setValues({}); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              taskType === t.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="text-xs font-semibold text-stone-600 block mb-1.5">{field.label}</label>
              {field.multiline ? (
                <textarea
                  value={values[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-24 px-3 py-2 text-sm text-slate-800 placeholder-stone-400 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none leading-relaxed"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-stone-400 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                copied ? "bg-teal-100 text-teal-700" : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-50 border border-stone-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Preview + score */}
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Generated Prompt</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">Score:</span>
                <span className={`text-sm font-bold ${
                  analysis.overallScore >= 70 ? "text-teal-600" :
                  analysis.overallScore >= 50 ? "text-amber-600" : "text-red-500"
                }`}>
                  {analysis.overallScore}/100
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{assembled}</p>
          </div>

          {/* Mini analysis */}
          <div className="space-y-3">
            {analysis.categories.map((cat) => (
              <CategoryBar key={cat.name} {...cat} />
            ))}
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <ul className="space-y-1">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">*</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Templates Tool ───
function TemplatesTool() {
  const [selected, setSelected] = useState<PromptTemplate | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const assembled = selected ? selected.assemble(values) : "";
  const analysis = useMemo(() => analyzePrompt(assembled), [assembled]);

  const handleSelect = (t: PromptTemplate) => {
    setSelected(t);
    setValues({});
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(assembled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selected) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promptTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t)}
            className="text-left p-5 rounded-xl bg-white border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all group"
          >
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 group-hover:text-teal-500">
              {t.category}
            </span>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{t.title}</h3>
            <p className="text-xs text-stone-500 mt-1.5">{t.description}</p>
            <span className="inline-block mt-3 text-xs font-medium text-teal-600 group-hover:text-teal-700">
              Use template &rarr;
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => { setSelected(null); setValues({}); }}
        className="text-sm text-stone-500 hover:text-teal-600 mb-4 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All templates
      </button>

      <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">{selected.title}</h3>
      <p className="text-sm text-stone-500 mb-6">{selected.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fields */}
        <div className="space-y-4">
          {selected.fields.map((field) => (
            <div key={field.id}>
              <label className="text-xs font-semibold text-stone-600 block mb-1.5">{field.label}</label>
              {field.multiline ? (
                <textarea
                  value={values[field.id] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full h-24 px-3 py-2 text-sm text-slate-800 placeholder-stone-400 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.id] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-stone-400 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleCopy}
            disabled={!assembled.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              copied ? "bg-teal-100 text-teal-700" : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
            }`}
          >
            {copied ? "Copied!" : "Copy Prompt"}
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Preview</span>
              <span className={`text-sm font-bold ${
                analysis.overallScore >= 70 ? "text-teal-600" :
                analysis.overallScore >= 50 ? "text-amber-600" : "text-stone-400"
              }`}>
                {analysis.overallScore > 0 ? `${analysis.overallScore}/100` : ""}
              </span>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{assembled}</p>
          </div>
          {analysis.overallScore > 0 && (
            <div className="space-y-3">
              {analysis.categories.map((cat) => (
                <CategoryBar key={cat.name} {...cat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compare Tool ───
function CompareTool() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const leftAnalysis = useMemo(() => analyzePrompt(leftText), [leftText]);
  const rightAnalysis = useMemo(() => analyzePrompt(rightText), [rightText]);

  const loadExamples = () => {
    setLeftText(EXAMPLE_PROMPTS.vague[0]);
    setRightText(EXAMPLE_PROMPTS.strong[0]);
  };

  const winner =
    leftAnalysis.overallScore === 0 && rightAnalysis.overallScore === 0
      ? null
      : leftAnalysis.overallScore > rightAnalysis.overallScore
      ? "left"
      : rightAnalysis.overallScore > leftAnalysis.overallScore
      ? "right"
      : "tie";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">Put two prompts head-to-head and see which scores higher.</p>
        <button
          onClick={loadExamples}
          className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 font-medium"
        >
          Load example pair
        </button>
      </div>

      {/* Winner banner */}
      {winner && winner !== "tie" && (
        <div className={`p-3 rounded-lg text-center text-sm font-semibold ${
          winner === "left" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-purple-50 text-purple-700 border border-purple-200"
        }`}>
          {winner === "left" ? "Prompt A" : "Prompt B"} wins by {Math.abs(leftAnalysis.overallScore - rightAnalysis.overallScore)} points
        </div>
      )}
      {winner === "tie" && leftAnalysis.overallScore > 0 && (
        <div className="p-3 rounded-lg text-center text-sm font-semibold bg-stone-50 text-stone-600 border border-stone-200">
          It&apos;s a tie!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div className={`rounded-xl border overflow-hidden ${winner === "left" ? "border-blue-300 ring-2 ring-blue-100" : "border-stone-200"}`}>
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Prompt A</span>
              {leftAnalysis.overallScore > 0 && (
                <span className="text-sm font-bold text-slate-900">{leftAnalysis.overallScore}/100</span>
              )}
            </div>
            <textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="Paste your first prompt here..."
              className="w-full h-36 p-4 text-sm text-slate-800 placeholder-stone-400 resize-none outline-none leading-relaxed"
            />
          </div>
          {leftAnalysis.overallScore > 0 && (
            <div className="space-y-3">
              {leftAnalysis.categories.map((cat) => (
                <CategoryBar key={cat.name} {...cat} />
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className={`rounded-xl border overflow-hidden ${winner === "right" ? "border-purple-300 ring-2 ring-purple-100" : "border-stone-200"}`}>
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Prompt B</span>
              {rightAnalysis.overallScore > 0 && (
                <span className="text-sm font-bold text-slate-900">{rightAnalysis.overallScore}/100</span>
              )}
            </div>
            <textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="Paste your second prompt here..."
              className="w-full h-36 p-4 text-sm text-slate-800 placeholder-stone-400 resize-none outline-none leading-relaxed"
            />
          </div>
          {rightAnalysis.overallScore > 0 && (
            <div className="space-y-3">
              {rightAnalysis.categories.map((cat) => (
                <CategoryBar key={cat.name} {...cat} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side-by-side category comparison */}
      {leftAnalysis.overallScore > 0 && rightAnalysis.overallScore > 0 && (
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Category Comparison</span>
          </div>
          <div className="divide-y divide-stone-100">
            {leftAnalysis.categories.map((leftCat, i) => {
              const rightCat = rightAnalysis.categories[i];
              const leftWins = leftCat.score > rightCat.score;
              const rightWins = rightCat.score > leftCat.score;
              return (
                <div key={leftCat.name} className="px-4 py-3 flex items-center gap-4">
                  <span className={`text-sm font-bold w-8 text-right ${leftWins ? "text-blue-600" : "text-stone-400"}`}>
                    {leftCat.score}
                  </span>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-semibold text-stone-700">{leftCat.name}</span>
                  </div>
                  <span className={`text-sm font-bold w-8 ${rightWins ? "text-purple-600" : "text-stone-400"}`}>
                    {rightCat.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───
export default function PlaygroundPage() {
  const { paid, loading } = useAuth();
  const [activeTool, setActiveTool] = useState<Tool>("analyzer");

  if (!loading && !paid) return <PaywallGate />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-stone-400 hover:text-teal-600 transition-colors">
          All Levels
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <span className="text-sm text-stone-600">Playground</span>
      </nav>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
        Prompt Playground
      </h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Four tools to help you write better prompts. Analyze, build, fill templates, or compare side-by-side — all with real-time scoring.
      </p>

      {/* Tool selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              activeTool === tool.id
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:shadow-sm"
            }`}
          >
            <h3 className={`text-sm font-bold ${activeTool === tool.id ? "text-white" : "text-slate-900"}`}>
              {tool.title}
            </h3>
            <p className={`text-[11px] mt-1 leading-snug ${activeTool === tool.id ? "text-stone-300" : "text-stone-500"}`}>
              {tool.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Active tool */}
      {activeTool === "analyzer" && <AnalyzerTool />}
      {activeTool === "builder" && <BuilderTool />}
      {activeTool === "templates" && <TemplatesTool />}
      {activeTool === "compare" && <CompareTool />}
    </div>
  );
}
