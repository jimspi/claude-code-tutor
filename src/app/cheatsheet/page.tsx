"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "terminal" | "prompts" | "claudemd";

const terminalCommands = [
  {
    category: "Navigation",
    commands: [
      { cmd: "pwd", desc: "Show your current folder location", example: "pwd → /home/user/my-project" },
      { cmd: "ls", desc: "List files and folders here", example: "ls → index.html styles.css" },
      { cmd: "cd folder-name", desc: "Move into a folder", example: "cd my-project" },
      { cmd: "cd ..", desc: "Go back one folder", example: "cd .. → moves up one level" },
      { cmd: "cd ~", desc: "Go to your home folder", example: "cd ~ → /home/user" },
    ],
  },
  {
    category: "File Management",
    commands: [
      { cmd: "mkdir folder-name", desc: "Create a new folder", example: "mkdir my-project" },
      { cmd: "touch file.txt", desc: "Create an empty file", example: "touch index.html" },
      { cmd: "rm file.txt", desc: "Delete a file", example: "rm old-file.txt" },
      { cmd: "cp source dest", desc: "Copy a file", example: "cp index.html backup.html" },
      { cmd: "mv old new", desc: "Move or rename a file", example: "mv draft.html index.html" },
    ],
  },
  {
    category: "Git Basics",
    commands: [
      { cmd: "git init", desc: "Set up version tracking", example: "git init → Initialized empty Git repository" },
      { cmd: "git add .", desc: "Stage all current files", example: "git add . → stages everything" },
      { cmd: 'git commit -m "msg"', desc: "Create a save point", example: 'git commit -m "initial build"' },
      { cmd: "git status", desc: "See what's changed", example: "git status → modified: index.html" },
      { cmd: "git log --oneline", desc: "See save point history", example: "git log --oneline → a3f7b2c initial build" },
    ],
  },
  {
    category: "Claude Code",
    commands: [
      { cmd: "claude", desc: "Start a new session", example: "claude → opens interactive mode" },
      { cmd: 'claude "prompt"', desc: "Start with a specific request", example: 'claude "create a landing page"' },
      { cmd: "claude --continue", desc: "Resume your last session", example: "claude --continue → picks up where you left off" },
      { cmd: 'claude -p "prompt"', desc: "Run headless (non-interactive)", example: 'claude -p "generate a README" > README.md' },
      { cmd: "/help", desc: "Show available commands (inside session)", example: "/help → lists all slash commands" },
      { cmd: "/compact", desc: "Compress conversation to save context", example: "/compact → conversation compressed" },
      { cmd: "/init", desc: "Create a CLAUDE.md project file", example: "/init → created CLAUDE.md" },
    ],
  },
];

const promptPatterns = [
  {
    category: "Starting a Project",
    patterns: [
      { name: "The Full Brief", template: "Create a [type] for [purpose]. Use [tech]. Include [features]. The design should be [style].", example: "Create a landing page for a coffee shop called Sunrise Roasters. Use HTML, CSS, and vanilla JS. Include a hero section, menu, and contact form. The design should be warm and minimal.", when: "Starting from scratch with a clear vision" },
      { name: "Step by Step", template: "Build this step by step. Start with [first thing], then [second thing].", example: "Build a portfolio site step by step. Start with the HTML structure, then add styling, then add the project cards.", when: "You want to review each stage before continuing" },
      { name: "Plan First", template: "Before you start, tell me your plan for [what you want].", example: "Before you start, tell me your plan for building a recipe organizer app.", when: "You want to review the approach before any code is written" },
    ],
  },
  {
    category: "Adding Features",
    patterns: [
      { name: "Specific Feature", template: "Add [feature] to [location]. It should [behavior].", example: "Add a dark mode toggle to the header. It should save the user's preference to localStorage.", when: "Adding something specific with clear requirements" },
      { name: "Copy a Pattern", template: "Add a [feature] similar to how [reference] does it.", example: "Add a notification dropdown similar to how GitHub does it.", when: "You have a reference for what you want" },
    ],
  },
  {
    category: "Fixing Problems",
    patterns: [
      { name: "Error Report", template: "I'm getting this error: [error]. It happens when [context].", example: "I'm getting this error: Cannot read properties of undefined (reading 'map'). It happens when the page first loads.", when: "You have a specific error message" },
      { name: "Behavior Bug", template: "[What happens] but I expected [what should happen]. The relevant code is in [file].", example: "The button click does nothing but I expected it to open a modal. The relevant code is in App.tsx.", when: "Something works but not correctly" },
    ],
  },
  {
    category: "Code Quality",
    patterns: [
      { name: "Code Review", template: "Review [file/project] for bugs, security issues, and improvements.", example: "Review my auth module for security issues and best practices.", when: "Before shipping or merging code" },
      { name: "Refactor", template: "This file is [problem]. Break it into [goal].", example: "This file is 400 lines long. Break it into smaller, focused components.", when: "Code is getting unwieldy" },
      { name: "Add Tests", template: "Write tests for [what] using [framework]. Cover [cases].", example: "Write tests for the login flow using Jest. Cover valid login, wrong password, and expired token.", when: "You need test coverage" },
    ],
  },
  {
    category: "Magic Phrases",
    patterns: [
      { name: "Keep it simple", template: "Keep it simple", example: "Create a contact form. Keep it simple — just name, email, and message.", when: "Prevents over-engineering" },
      { name: "Read the codebase first", template: "Read the codebase first, then [task]", example: "Read the codebase first, then add a search feature that matches the existing patterns.", when: "Ensures Claude understands existing code" },
      { name: "Don't modify [file]", template: "Don't modify [file]", example: "Add the new API route but don't modify the existing auth middleware.", when: "Protecting specific files" },
      { name: "Explain what you did", template: "Explain what you did", example: "Fix the CSS layout issue and explain what you did.", when: "Getting a plain-English summary" },
      { name: "Use [specific technology]", template: "Use [technology]", example: "Build this using TypeScript and Tailwind CSS.", when: "Directing Claude to preferred tools" },
    ],
  },
];

const claudeMdTemplates = [
  {
    name: "Starter",
    description: "Minimal — for simple or personal projects",
    content: `# Project: [Your Project Name]

## Overview
[One sentence about what this project does.]

## Tech Stack
- [e.g., HTML, CSS, JavaScript]

## Notes
- [Any important rules or preferences]`,
  },
  {
    name: "Standard",
    description: "Covers most use cases — recommended for most projects",
    content: `# Project: [Your Project Name]

## Overview
[One or two sentences about what this project does and who it's for.]

## Tech Stack
- Frontend: [e.g., React, Next.js]
- Styling: [e.g., Tailwind CSS]
- Backend: [e.g., Node.js, Supabase] (if applicable)
- Database: [e.g., PostgreSQL] (if applicable)

## Coding Conventions
- [e.g., Use TypeScript strict mode]
- [e.g., Prefer functional components over class components]
- [e.g., Use Tailwind utility classes, no inline styles]

## Project Structure
- [e.g., /src/components — React components]
- [e.g., /src/lib — Utility functions and helpers]
- [e.g., /src/app — Next.js routes]

## Important Notes
- [e.g., Don't modify the database schema without asking]
- [e.g., All API routes require authentication]
- [e.g., Keep bundle size small — avoid large dependencies]`,
  },
  {
    name: "Comprehensive",
    description: "For larger, more complex projects with multiple contributors",
    content: `# Project: [Your Project Name]

## Overview
[Detailed description of the project, its purpose, and target users.]

## Tech Stack
- Frontend: [e.g., Next.js 14 with App Router]
- Styling: [e.g., Tailwind CSS v4]
- State Management: [e.g., Zustand]
- Backend: [e.g., Next.js API routes + Supabase]
- Database: [e.g., PostgreSQL via Supabase]
- Auth: [e.g., Supabase Auth with magic links]
- Hosting: [e.g., Vercel]

## Architecture
[Brief description of the app architecture — client/server split, data flow, etc.]

## Coding Conventions
- Language: TypeScript (strict mode)
- Components: Functional components with hooks
- Styling: Tailwind utility classes only — no CSS modules or inline styles
- Naming: camelCase for variables/functions, PascalCase for components
- Files: One component per file, colocate tests with source
- Imports: Use @/ path alias for src directory

## Project Structure
- /src/app — Next.js App Router pages and layouts
- /src/components — Reusable React components
- /src/lib — Utility functions, API clients, helpers
- /src/contexts — React context providers
- /src/data — Static data and type definitions
- /public — Static assets

## API & Data
- [Describe key API endpoints or data models]
- [e.g., user_progress table: user_id, completed_lessons, earned_badges]

## Testing
- Framework: [e.g., Jest + React Testing Library]
- Run: [e.g., npm test]
- [Any testing conventions]

## Important Rules
- Never commit .env files or secrets
- Don't modify the database schema without discussing first
- All user-facing text should be clear and jargon-free
- Keep components under 150 lines — extract if larger
- Always handle loading and error states
- Accessibility: use semantic HTML and aria labels

## Deployment
- [e.g., Auto-deploys from main branch via Vercel]
- [e.g., Environment variables are managed in Vercel dashboard]`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function CheatSheetPage() {
  const [activeTab, setActiveTab] = useState<Tab>("terminal");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-teal-600 transition-colors"
        >
          All Levels
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <span className="text-sm text-stone-600">Cheat Sheet</span>
      </nav>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
        Cheat Sheet
      </h1>
      <p className="text-stone-600 mb-8">
        Everything you need in one place. Bookmark this page for quick reference.
      </p>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8">
        {[
          { id: "terminal" as Tab, label: "Terminal Commands" },
          { id: "prompts" as Tab, label: "Prompt Patterns" },
          { id: "claudemd" as Tab, label: "CLAUDE.md Template" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-700"
                : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Terminal Commands */}
      {activeTab === "terminal" && (
        <div className="space-y-10">
          {terminalCommands.map((group) => (
            <section key={group.category}>
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
                {group.category}
              </h2>
              <div className="space-y-2">
                {group.commands.map((cmd) => (
                  <div
                    key={cmd.cmd}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-lg bg-white border border-stone-200"
                  >
                    <div className="flex items-center gap-2 sm:w-52 sm:flex-shrink-0">
                      <code className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {cmd.cmd}
                      </code>
                      <CopyButton text={cmd.cmd.replace(/ .*/, "")} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-stone-700">{cmd.desc}</p>
                      <p className="text-xs text-stone-400 mt-0.5 font-mono">
                        {cmd.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Tab 2: Prompt Patterns */}
      {activeTab === "prompts" && (
        <div className="space-y-10">
          {promptPatterns.map((group) => (
            <section key={group.category}>
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.patterns.map((p) => (
                  <div
                    key={p.name}
                    className="p-4 rounded-xl bg-white border border-stone-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {p.name}
                      </h3>
                      <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {p.when}
                      </span>
                    </div>
                    <div className="mb-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <code className="text-xs text-amber-700 font-mono">
                        {p.template}
                      </code>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mt-0.5">
                        Example
                      </span>
                      <p className="text-xs text-stone-600 italic">
                        &quot;{p.example}&quot;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Tab 3: CLAUDE.md Templates */}
      {activeTab === "claudemd" && (
        <div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-8">
            <h3 className="text-sm font-bold text-amber-800 mb-1">
              What is CLAUDE.md?
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              A special file you put in your project&apos;s root folder. Claude Code reads it
              at the start of every session, so it always knows your project&apos;s rules,
              tech stack, and conventions. Think of it as onboarding docs for your AI
              teammate.
            </p>
          </div>

          <div className="space-y-6">
            {claudeMdTemplates.map((tmpl) => (
              <div
                key={tmpl.name}
                className="rounded-xl border border-stone-200 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-stone-500">{tmpl.description}</p>
                  </div>
                  <CopyButton text={tmpl.content} />
                </div>
                <pre className="p-4 bg-white text-xs text-stone-700 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {tmpl.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-stone-400 pt-10 border-t border-stone-200 mt-12">
        <p>Keep this page bookmarked. Come back whenever you need a quick reference.</p>
      </div>
    </div>
  );
}
