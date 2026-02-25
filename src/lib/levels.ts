export interface LessonMeta {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
}

export interface LevelMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  lessons: LessonMeta[];
}

export const levels: LevelMeta[] = [
  {
    id: "1",
    number: 1,
    title: "Getting Started",
    subtitle: "The Absolute Basics",
    badge: "Code Curious",
    lessons: [
      {
        id: "1-1",
        title: "What Is Claude Code?",
        subtitle: "Your AI-powered coding partner, explained in plain English",
        estimatedMinutes: 5,
      },
      {
        id: "1-2",
        title: "Installing Claude Code",
        subtitle: "Get up and running in under 10 minutes",
        estimatedMinutes: 10,
      },
      {
        id: "1-3",
        title: "Your First Conversation",
        subtitle: "Talk to Claude Code and watch the magic happen",
        estimatedMinutes: 7,
      },
      {
        id: "1-4",
        title: "Understanding the Basics of the Terminal",
        subtitle: "Five commands that will make your life easier",
        estimatedMinutes: 8,
      },
      {
        id: "1-5",
        title: "How Claude Code Thinks",
        subtitle: "Understand the permission model and how Claude sees your project",
        estimatedMinutes: 6,
      },
    ],
  },
  {
    id: "2",
    number: 2,
    title: "Talking to Claude Code",
    subtitle: "Prompt Craft",
    badge: "Prompt Crafter",
    lessons: [
      {
        id: "2-1",
        title: "Writing Good Prompts",
        subtitle: "The single most important skill for Claude Code",
        estimatedMinutes: 8,
      },
      {
        id: "2-2",
        title: "Iterating Like a Pro",
        subtitle: "Why one prompt is never enough (and that's okay)",
        estimatedMinutes: 6,
      },
      {
        id: "2-3",
        title: "Magic Phrases That Work",
        subtitle: "Proven prompt patterns you can use right now",
        estimatedMinutes: 7,
      },
      {
        id: "2-4",
        title: "Common Mistakes to Avoid",
        subtitle: "Learn from others so you don't have to learn the hard way",
        estimatedMinutes: 6,
      },
    ],
  },
  {
    id: "3",
    number: 3,
    title: "Building Real Things",
    subtitle: "Hands-On Projects",
    badge: "Builder in Training",
    lessons: [
      {
        id: "3-1",
        title: "Project 1: Personal Portfolio Site",
        subtitle: "Build your own portfolio with just a few sentences",
        estimatedMinutes: 10,
      },
      {
        id: "3-2",
        title: "Project 2: Simple Business Landing Page",
        subtitle: "Create a professional page for any business",
        estimatedMinutes: 10,
      },
      {
        id: "3-3",
        title: "Project 3: Interactive Quiz App",
        subtitle: "Claude Code builds things that think, not just look pretty",
        estimatedMinutes: 10,
      },
      {
        id: "3-4",
        title: "Working With Existing Projects",
        subtitle: "Point Claude Code at code that already exists",
        estimatedMinutes: 7,
      },
      {
        id: "3-5",
        title: "When Things Go Wrong",
        subtitle: "Errors happen. Here is exactly what to do.",
        estimatedMinutes: 8,
      },
    ],
  },
  {
    id: "4",
    number: 4,
    title: "Leveling Up",
    subtitle: "Intermediate Skills",
    badge: "Claude Code Pro",
    lessons: [
      {
        id: "4-1",
        title: "Using CLAUDE.md Files",
        subtitle: "Give Claude permanent instructions for your project",
        estimatedMinutes: 7,
      },
      {
        id: "4-2",
        title: "Multi-File Projects",
        subtitle: "How Claude handles complex project structures",
        estimatedMinutes: 8,
      },
      {
        id: "4-3",
        title: "Adding APIs and Data",
        subtitle: "Connect your projects to the outside world",
        estimatedMinutes: 9,
      },
      {
        id: "4-4",
        title: "Command Line Shortcuts and Flags",
        subtitle: "Work faster with these time-saving tricks",
        estimatedMinutes: 6,
      },
      {
        id: "4-5",
        title: "Planning Before Building",
        subtitle: "The secret to building bigger projects successfully",
        estimatedMinutes: 7,
      },
    ],
  },
  {
    id: "5",
    number: 5,
    title: "Pro Moves",
    subtitle: "Advanced Patterns",
    badge: "Command Line Captain",
    lessons: [
      {
        id: "5-1",
        title: "Automated Workflows",
        subtitle: "Chain tasks together and let Claude handle the heavy lifting",
        estimatedMinutes: 8,
      },
      {
        id: "5-2",
        title: "Working With GitHub",
        subtitle: "Version control made simple with Claude Code",
        estimatedMinutes: 9,
      },
      {
        id: "5-3",
        title: "Custom Slash Commands",
        subtitle: "Build your own shortcuts for repetitive tasks",
        estimatedMinutes: 7,
      },
      {
        id: "5-4",
        title: "Tips From Power Users",
        subtitle: "Advanced techniques from the Claude Code community",
        estimatedMinutes: 6,
      },
      {
        id: "5-5",
        title: "Where to Go From Here",
        subtitle: "Your journey is just beginning",
        estimatedMinutes: 5,
      },
    ],
  },
];

export function getLevelById(id: string): LevelMeta | undefined {
  return levels.find((l) => l.id === id);
}

export function getLessonById(
  levelId: string,
  lessonId: string
): LessonMeta | undefined {
  const level = getLevelById(levelId);
  return level?.lessons.find((l) => l.id === lessonId);
}

export function getAdjacentLessons(
  levelId: string,
  lessonId: string
): { prev: { levelId: string; lessonId: string } | null; next: { levelId: string; lessonId: string } | null } {
  const allLessons: { levelId: string; lessonId: string }[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      allLessons.push({ levelId: level.id, lessonId: lesson.id });
    }
  }
  const idx = allLessons.findIndex(
    (l) => l.levelId === levelId && l.lessonId === lessonId
  );
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  };
}

export function getTotalLessons(): number {
  return levels.reduce((sum, level) => sum + level.lessons.length, 0);
}
