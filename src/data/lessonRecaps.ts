export interface LessonRecap {
  takeaways: string[];
  encouragement: string;
}

export const lessonRecaps: Record<string, LessonRecap> = {
  "1-1": {
    takeaways: [
      "Claude Code is an AI partner you talk to from the terminal",
      "You describe what you want in plain English — no coding syntax needed",
      "It reads, writes, and edits files but always asks permission first",
    ],
    encouragement: "You already understand more than most people. Let's keep going.",
  },
  "1-2": {
    takeaways: [
      "Node.js is the only prerequisite",
      "Install with one command: npm install -g @anthropic-ai/claude-code",
      "Test it works by typing claude --version",
    ],
    encouragement: "Setup done. The boring part is over.",
  },
  "1-3": {
    takeaways: [
      "Claude Code is conversational — just describe what you want",
      "The build loop: prompt → review → refine → repeat",
      "Claude always asks before making changes to your files",
    ],
    encouragement: "You just had your first AI conversation. That's a real skill.",
  },
  "1-4": {
    takeaways: [
      "Five commands get you everywhere: pwd, ls, cd, mkdir, cd ..",
      "The terminal is just another way to navigate your computer",
      "Folders are called directories — same thing, different name",
    ],
    encouragement: "The terminal isn't scary anymore. That's a big deal.",
  },
  "1-5": {
    takeaways: [
      "Claude sees your entire project folder as context",
      "The permission model keeps you in control",
      "Sessions persist — Claude remembers what you discussed",
    ],
    encouragement: "You now understand what's happening under the hood.",
  },
  "2-1": {
    takeaways: [
      "Good prompts have three parts: WHAT you want, WHERE it goes, HOW it should work",
      "Specific prompts get specific results",
      "You can always iterate — the first prompt doesn't need to be perfect",
    ],
    encouragement: "This is the single most valuable skill in the course.",
  },
  "2-2": {
    takeaways: [
      "One prompt is never enough — and that's by design",
      "The loop: prompt → review → refine → repeat",
      "Start broad, then get specific with follow-ups",
    ],
    encouragement: "You're learning to think in conversations, not commands.",
  },
  "2-3": {
    takeaways: [
      "\"Build step by step\" breaks big tasks into manageable pieces",
      "\"Before you start, tell me your plan\" gets a reviewable strategy",
      "\"Keep it simple\" prevents over-engineering",
    ],
    encouragement: "These phrases will serve you every single session.",
  },
  "2-4": {
    takeaways: [
      "Don't try to do everything in one prompt",
      "Always review the plan before saying yes",
      "Vague prompts get vague results — be specific",
    ],
    encouragement: "Learning from others' mistakes saves you hours.",
  },
  "3-1": {
    takeaways: [
      "You can build a complete website with a few well-crafted prompts",
      "Iterate on design by describing changes in plain English",
      "Claude handles HTML, CSS, and JavaScript together",
    ],
    encouragement: "You just built a real portfolio. That's not a simulation.",
  },
  "3-2": {
    takeaways: [
      "Business pages follow a pattern: hero, features, testimonials, CTA",
      "You can customize any template by describing what you want",
      "Responsive design means it works on phones too",
    ],
    encouragement: "You could do this for a real client right now.",
  },
  "3-3": {
    takeaways: [
      "Claude Code can build interactive apps with real logic",
      "State management handles what changes on screen",
      "JavaScript makes pages respond to user actions",
    ],
    encouragement: "You just built something that thinks. That's next level.",
  },
  "3-4": {
    takeaways: [
      "Point Claude at any folder and it reads the whole codebase",
      "Ask for summaries, improvements, or explanations",
      "Claude adapts to whatever tech stack is already there",
    ],
    encouragement: "You can now drop into any project and start contributing.",
  },
  "3-5": {
    takeaways: [
      "Errors are normal — they're information, not failure",
      "Copy the full error and ask Claude to fix it",
      "Git save points let you roll back any mistake",
    ],
    encouragement: "You'll never be stuck for long again.",
  },
  "4-1": {
    takeaways: [
      "CLAUDE.md gives Claude permanent project context",
      "Put it in your project root — Claude reads it every session",
      "Include tech stack, conventions, and important rules",
    ],
    encouragement: "Your projects now have memory.",
  },
  "4-2": {
    takeaways: [
      "Claude handles components, pages, and config files together",
      "It understands imports and how files connect",
      "Ask Claude to explain the project structure if you're lost",
    ],
    encouragement: "You're thinking in architecture now.",
  },
  "4-3": {
    takeaways: [
      "APIs let your app talk to external services",
      "Environment variables keep secrets out of your code",
      "Claude can set up API calls and handle the data",
    ],
    encouragement: "Your apps can now connect to the real world.",
  },
  "4-4": {
    takeaways: [
      "--continue resumes your last session",
      "/compact compresses context to save space",
      "/help is your always-available cheat sheet",
    ],
    encouragement: "These shortcuts will save you minutes every session.",
  },
  "4-5": {
    takeaways: [
      "Ask for a plan before any code is written",
      "Review the plan, adjust, then approve",
      "Good planning prevents bad debugging",
    ],
    encouragement: "Plan twice, build once.",
  },
  "5-1": {
    takeaways: [
      "Chain multiple tasks into a single prompt",
      "Break complex work into sequential steps",
      "Claude can handle multi-step operations autonomously",
    ],
    encouragement: "You're automating your own workflow now.",
  },
  "5-2": {
    takeaways: [
      "Git tracks every change — commit often",
      "Branches let you experiment without risk",
      "Push to GitHub to share and back up your work",
    ],
    encouragement: "You're now part of how real teams build software.",
  },
  "5-3": {
    takeaways: [
      "Create reusable commands in .claude/commands/",
      "Slash commands save time on repetitive tasks",
      "Share commands with your team for consistency",
    ],
    encouragement: "You're building your own tools now.",
  },
  "5-4": {
    takeaways: [
      "Read the codebase before making changes",
      "Use specific file paths when you can",
      "Combine Claude with other terminal tools for maximum power",
    ],
    encouragement: "You're thinking like a power user.",
  },
  "5-5": {
    takeaways: [
      "Start a real project — the best learning is doing",
      "Join the Claude Code community for support",
      "Come back to the cheat sheet whenever you need a refresher",
    ],
    encouragement: "You're not a beginner anymore. Go build something real.",
  },
};
