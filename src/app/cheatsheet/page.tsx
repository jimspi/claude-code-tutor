"use client";

import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

export default function CheatSheetPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        Claude Code Cheat Sheet
      </h1>
      <p className="text-stone-600 mb-10">
        Everything you need in one place. Bookmark this page for quick reference.
      </p>

      {/* Terminal Commands */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          Essential Terminal Commands
        </h2>
        <CodeBlock
          code={`pwd                     # Show your current folder location
ls                      # List files and folders here
cd folder-name          # Move into a folder
cd ..                   # Go back one folder
mkdir project-name      # Create a new folder`}
          language="bash"
          label="Five commands you need to know"
        />
      </section>

      {/* Starting Claude Code */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          Starting Claude Code
        </h2>
        <CodeBlock
          code={`claude                           # Start a new session
claude "your prompt here"        # Start with a specific request
claude --continue                # Resume your last session`}
          language="bash"
          label="Ways to launch Claude Code"
        />
      </section>

      {/* Slash Commands */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          Slash Commands (Inside a Session)
        </h2>
        <div className="space-y-2">
          {[
            { cmd: "/help", desc: "Show available commands and options" },
            { cmd: "/clear", desc: "Clear the conversation history" },
            { cmd: "/compact", desc: "Compress conversation to save context space" },
          ].map((item) => (
            <div
              key={item.cmd}
              className="flex items-start gap-3 p-3 rounded-lg bg-white border border-stone-200"
            >
              <code className="text-sm font-mono font-semibold text-teal-700 whitespace-nowrap">
                {item.cmd}
              </code>
              <span className="text-sm text-stone-600">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Prompt Patterns */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          Magic Prompt Phrases
        </h2>
        <div className="space-y-2">
          {[
            { phrase: "Build this step by step", effect: "Breaks work into smaller, more reliable pieces" },
            { phrase: "Before you start, tell me your plan", effect: "Gets a reviewable plan before code is written" },
            { phrase: "Keep it simple", effect: "Prevents over-engineering" },
            { phrase: "Use [specific technology]", effect: "Directs Claude to your preferred tools" },
            { phrase: "Don't modify [file]", effect: "Protects specific files from changes" },
            { phrase: "Read the codebase first, then...", effect: "Ensures Claude understands existing code" },
            { phrase: "Explain what you did", effect: "Gets a plain-English summary of changes" },
          ].map((item) => (
            <div
              key={item.phrase}
              className="flex items-start gap-3 p-3 rounded-lg bg-white border border-stone-200"
            >
              <code className="text-sm font-mono font-semibold text-amber-700 whitespace-nowrap min-w-0 shrink-0">
                &quot;{item.phrase}&quot;
              </code>
              <span className="text-sm text-stone-600">{item.effect}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Git Safety */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          Git Safety Commands
        </h2>
        <CodeBlock
          code={`git init                    # Set up version tracking (once per project)
git add .                   # Stage all current files
git commit -m "save point"  # Create a save point
git status                  # See what's changed
git log --oneline           # See your save point history`}
          language="bash"
          label="Create save points for your project"
        />
      </section>

      {/* New Project Workflow */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          New Project Workflow
        </h2>
        <CodeBlock
          code={`# 1. Create and enter project folder
mkdir my-project
cd my-project

# 2. Start Claude Code
claude

# 3. Give it a clear first prompt
"Create a [description of what you want]. Use [tech preferences].
Include [specific features]. The design should be [style description]."

# 4. Iterate
"Make the header sticky"
"Change the colors to [your preference]"
"Add [new feature]"

# 5. Save your progress
git init
git add .
git commit -m "initial build complete"`}
          language="bash"
          label="The complete workflow from zero to project"
        />
      </section>

      {/* CLAUDE.md Template */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          CLAUDE.md Template
        </h2>
        <CodeBlock
          code={`# Project: [Your Project Name]

## Overview
[One or two sentences about what this project does.]

## Tech Stack
- Frontend: [e.g., React, Next.js]
- Styling: [e.g., Tailwind CSS]
- Backend: [e.g., Node.js] (if applicable)

## Coding Conventions
- [e.g., Use TypeScript strict mode]
- [e.g., Prefer functional components]

## Important Notes
- [e.g., Don't modify the database schema]
- [e.g., All API routes require auth]`}
          language="markdown"
          label="Copy and customize for your project"
        />
      </section>

      {/* Error Handling */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-stone-200">
          When Things Go Wrong
        </h2>
        <div className="space-y-2">
          {[
            { situation: "Error message appeared", action: "Copy the entire error and tell Claude: \"I'm getting this error: [paste]. Can you fix it?\"" },
            { situation: "Something doesn't work right", action: "Describe what you expected vs what happened. Ask Claude to investigate." },
            { situation: "Changes made things worse", action: "Tell Claude: \"Undo the last changes and let's try a different approach.\"" },
            { situation: "Completely stuck", action: "Create a git save point, then ask Claude to start the feature over with a clearer plan." },
          ].map((item) => (
            <div
              key={item.situation}
              className="p-3 rounded-lg bg-white border border-stone-200"
            >
              <p className="text-sm font-semibold text-slate-800">
                {item.situation}
              </p>
              <p className="text-sm text-stone-600 mt-1">{item.action}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center text-sm text-stone-400 pt-8 border-t border-stone-200">
        <p>Keep this page bookmarked. Come back whenever you need a quick reference.</p>
      </div>
    </div>
  );
}
