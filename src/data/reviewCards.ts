export interface ReviewCard {
  question: string;
  answer: string;
  lessonId: string;
}

export const reviewCards: ReviewCard[] = [
  // Level 1
  {
    question: "How do you start Claude Code?",
    answer:
      "Type `claude` in your terminal and press Enter.",
    lessonId: "1-3",
  },
  {
    question: "What does `pwd` do?",
    answer:
      "Shows your current folder location — like checking the address of the room you're in.",
    lessonId: "1-4",
  },
  {
    question: "Does Claude change your files without asking?",
    answer:
      "No — Claude always asks permission before creating or editing any file.",
    lessonId: "1-5",
  },

  {
    question: "Where do you get your Claude Code API key?",
    answer:
      "Go to console.anthropic.com, create an account, click API Keys, and generate one.",
    lessonId: "1-2",
  },
  {
    question: "What is a GitHub Personal Access Token for?",
    answer:
      "It's how GitHub verifies your identity when you push code from your terminal — like a password for Git operations.",
    lessonId: "1-6",
  },

  // Level 2
  {
    question: "What are the three parts of a good prompt?",
    answer:
      "WHAT you want, WHERE it goes, and HOW it should work.",
    lessonId: "2-1",
  },
  {
    question: "Why is one prompt never enough?",
    answer:
      "Because building is iterative — you prompt, review, refine, and repeat to get exactly what you want.",
    lessonId: "2-2",
  },
  {
    question: "What does 'build step by step' do?",
    answer:
      "Tells Claude to break the work into smaller, reviewable pieces instead of doing everything at once.",
    lessonId: "2-3",
  },

  // Level 3
  {
    question: "Can Claude work with code you didn't write?",
    answer:
      "Yes — point it at any existing project folder and it will read and understand the whole codebase.",
    lessonId: "3-4",
  },
  {
    question: "What should you do when you see an error?",
    answer:
      "Copy the entire error message and ask Claude to fix it — errors are information, not failure.",
    lessonId: "3-5",
  },

  {
    question: "What does deploying to Vercel do?",
    answer:
      "It puts your project on the internet with a public URL so anyone can see it — and it auto-updates when you push to GitHub.",
    lessonId: "3-6",
  },

  // Level 4
  {
    question: "What is CLAUDE.md?",
    answer:
      "A file in your project root that gives Claude permanent instructions — like onboarding docs for your AI teammate.",
    lessonId: "4-1",
  },
  {
    question: "How do you resume your last Claude session?",
    answer:
      "Type `claude --continue` to pick up where you left off.",
    lessonId: "4-4",
  },
  {
    question: "Why should you ask for a plan first?",
    answer:
      "So you can review and adjust Claude's approach before any code is written.",
    lessonId: "4-5",
  },

  // Level 5
  {
    question: "What is a pull request?",
    answer:
      "A formal way to propose changes — you work on a branch, then open a PR for review before merging into main.",
    lessonId: "5-2",
  },
  {
    question: "What's the benefit of custom slash commands?",
    answer:
      "They save time on repetitive tasks — create them in .claude/commands/ and reuse across sessions.",
    lessonId: "5-3",
  },
];
