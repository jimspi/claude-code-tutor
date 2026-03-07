// Client-side prompt quality analyzer for the Playground

export interface CategoryScore {
  name: string;
  score: number;
  label: string;
  feedback: string;
}

export interface PromptAnalysis {
  overallScore: number;
  grade: string;
  categories: CategoryScore[];
  missing: string[];
  suggestions: string[];
  structured: { what: string; where: string; how: string };
}

const ACTION_VERBS = [
  "create", "build", "add", "fix", "update", "make", "write", "design",
  "implement", "refactor", "improve", "change", "move", "remove", "delete",
  "set up", "configure", "install", "deploy", "generate", "convert", "migrate",
  "style", "explain", "debug", "test", "optimize",
];

const TECH_TERMS = [
  "react", "next", "nextjs", "next.js", "vue", "angular", "svelte",
  "typescript", "javascript", "python", "node", "express", "tailwind",
  "css", "html", "api", "rest", "graphql", "database", "sql", "mongodb",
  "postgres", "supabase", "firebase", "aws", "vercel", "docker",
  "component", "hook", "state", "props", "redux", "zustand",
  "localStorage", "session", "cookie", "jwt", "oauth", "auth",
  "responsive", "mobile", "desktop", "tablet",
];

const DESIGN_TERMS = [
  "color", "font", "layout", "grid", "flex", "spacing", "padding", "margin",
  "shadow", "border", "rounded", "gradient", "dark mode", "light mode",
  "hero", "sidebar", "navbar", "footer", "header", "card", "modal", "drawer",
  "animation", "transition", "hover", "icon", "image", "background",
  "modern", "clean", "minimal", "bold", "professional", "playful", "elegant",
  "cream", "blue", "red", "green", "orange", "purple", "teal", "white", "black",
];

const BEHAVIOR_TERMS = [
  "click", "submit", "hover", "scroll", "drag", "type", "filter", "search",
  "sort", "paginate", "load", "fetch", "save", "delete", "edit", "toggle",
  "show", "hide", "open", "close", "redirect", "navigate", "validate",
  "error", "success", "loading", "empty state", "notification", "toast",
  "on submit", "when clicked", "after loading", "if empty",
];

function countMatches(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t.toLowerCase())).length;
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Weak";
  return "Missing";
}

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "A-";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  if (score >= 30) return "D";
  return "F";
}

function scoreClarity(text: string, words: string[], lower: string): CategoryScore {
  let score = 0;

  // Has action verb
  const hasAction = ACTION_VERBS.some((v) => lower.includes(v));
  if (hasAction) score += 25;

  // Reasonable length
  if (words.length >= 5) score += 10;
  if (words.length >= 10) score += 10;
  if (words.length >= 20) score += 5;

  // Multiple sentences = more structured
  const sentences = text.split(/[.!?\n]/).filter((s) => s.trim().length > 3);
  if (sentences.length >= 2) score += 15;
  if (sentences.length >= 3) score += 10;

  // Has some structure (numbered list, bullets, line breaks)
  if (/\d+[.)]\s/.test(text) || /[-*]\s/.test(text)) score += 15;

  // Not too vague (very short = vague)
  if (words.length < 5) score = Math.min(score, 20);

  // Focused (not a run-on mess)
  const andCount = (lower.match(/\band\b/g) || []).length;
  if (andCount <= 3) score += 10;

  score = Math.min(score, 100);

  let feedback = "";
  if (score >= 70) feedback = "Your request is clear and easy to understand.";
  else if (score >= 40) feedback = "Decent clarity, but could be more direct about what you want.";
  else feedback = "Too vague. Start with an action verb and state exactly what you want.";

  return { name: "Clarity", score, label: scoreLabel(score), feedback };
}

function scoreSpecificity(text: string, words: string[], lower: string): CategoryScore {
  let score = 0;

  // Specific names or brands
  const hasProperNoun = /[A-Z][a-z]{2,}/.test(text.replace(/^[A-Z]/, "").replace(/\.\s*[A-Z]/g, ""));
  if (hasProperNoun) score += 12;

  // Numbers
  const hasNumbers = /\d+/.test(text);
  if (hasNumbers) score += 12;

  // Design terms
  const designCount = countMatches(text, DESIGN_TERMS);
  score += Math.min(designCount * 8, 24);

  // Behavior terms
  const behaviorCount = countMatches(text, BEHAVIOR_TERMS);
  score += Math.min(behaviorCount * 8, 24);

  // Feature enumeration (multiple distinct things mentioned)
  const commaCount = (text.match(/,/g) || []).length;
  const listItems = (text.match(/\d+[.)]\s/g) || []).length;
  if (commaCount >= 2 || listItems >= 2) score += 15;
  if (commaCount >= 4 || listItems >= 4) score += 8;

  // Word count as proxy for detail
  if (words.length >= 30) score += 10;
  if (words.length >= 50) score += 5;

  score = Math.min(score, 100);

  let feedback = "";
  if (score >= 70) feedback = "Good level of detail. Claude will know exactly what to build.";
  else if (score >= 40) feedback = "Some detail, but more specifics (colors, sizes, behavior) would help.";
  else feedback = "Very generic. Add names, numbers, colors, features, and layout details.";

  return { name: "Specificity", score, label: scoreLabel(score), feedback };
}

function scoreContext(_text: string, words: string[], lower: string): CategoryScore {
  let score = 0;

  // Tech stack
  const techCount = countMatches(lower, TECH_TERMS);
  if (techCount >= 1) score += 20;
  if (techCount >= 2) score += 15;
  if (techCount >= 3) score += 10;

  // File references
  if (/\.(tsx?|jsx?|css|html|json|py|rs|go)\b/.test(lower) || /src\/|pages\/|components\//.test(lower)) {
    score += 15;
  }

  // Project type
  if (/\b(web app|website|landing page|dashboard|portfolio|blog|ecommerce|store|api|cli|mobile app|extension)\b/i.test(lower)) {
    score += 15;
  }

  // Mentions existing code / project
  if (/\b(existing|current|already|my project|my site|my app|codebase)\b/i.test(lower)) {
    score += 10;
  }

  // Mentions audience or users
  if (/\b(user|users|visitor|customer|client|audience|admin|team)\b/i.test(lower)) {
    score += 10;
  }

  // Has enough words to have context
  if (words.length >= 15) score += 5;

  score = Math.min(score, 100);

  let feedback = "";
  if (score >= 70) feedback = "Good context. Claude knows what it's working with.";
  else if (score >= 40) feedback = "Some context, but mention your tech stack or project type.";
  else feedback = "No context about your project. Mention the tech stack, project type, or existing code.";

  return { name: "Context", score, label: scoreLabel(score), feedback };
}

function scoreCompleteness(text: string, words: string[], lower: string): CategoryScore {
  let score = 0;

  // Has WHAT (action + object)
  const hasWhat = ACTION_VERBS.some((v) => lower.includes(v)) && words.length >= 5;
  if (hasWhat) score += 25;

  // Has WHERE (location context)
  const hasWhere =
    /\b(page|file|component|section|folder|project|app|site|module|route)\b/i.test(lower) ||
    /\b(new|existing|add to|create in|at the top|at the bottom|in the|below|above)\b/i.test(lower);
  if (hasWhere) score += 25;

  // Has HOW (requirements/constraints)
  const designCount = countMatches(text, DESIGN_TERMS);
  const behaviorCount = countMatches(text, BEHAVIOR_TERMS);
  const hasHow = designCount >= 1 || behaviorCount >= 1 || /\b(should|must|need|want|make sure|ensure)\b/i.test(lower);
  if (hasHow) score += 25;

  // Bonus for thoroughness
  if (words.length >= 30) score += 10;
  if (/\d+[.)]\s/.test(text)) score += 10; // numbered list
  if (text.split(/[.!?\n]/).filter((s) => s.trim().length > 3).length >= 3) score += 5;

  score = Math.min(score, 100);

  let feedback = "";
  if (score >= 70) feedback = "Covers What, Where, and How. Claude has enough to start.";
  else if (score >= 40) {
    const missingParts = [];
    if (!hasWhat) missingParts.push("WHAT to build");
    if (!hasWhere) missingParts.push("WHERE it goes");
    if (!hasHow) missingParts.push("HOW it should work");
    feedback = `Missing: ${missingParts.join(", ")}. Add these for a stronger prompt.`;
  } else feedback = "Incomplete. Use the What + Where + How framework from Lesson 2-1.";

  return { name: "Completeness", score, label: scoreLabel(score), feedback };
}

function generateMissing(lower: string, categories: CategoryScore[]): string[] {
  const missing: string[] = [];

  if (!ACTION_VERBS.some((v) => lower.includes(v))) {
    missing.push("Action verb — start with \"Create\", \"Build\", \"Add\", \"Fix\", etc.");
  }

  if (countMatches(lower, TECH_TERMS) === 0) {
    missing.push("Tech stack — mention React, Tailwind, Python, or whatever you're using");
  }

  if (countMatches(lower, DESIGN_TERMS) === 0) {
    missing.push("Design direction — colors, layout style, or visual references");
  }

  if (countMatches(lower, BEHAVIOR_TERMS) === 0) {
    missing.push("Behavior details — what happens on click, submit, hover, etc.");
  }

  if (!/\b(page|file|component|section|project|app|site)\b/i.test(lower)) {
    missing.push("Location — where should this go? New project or existing file?");
  }

  if (!/\b(responsive|mobile|desktop|tablet)\b/i.test(lower)) {
    missing.push("Responsive requirements — should it work on mobile?");
  }

  return missing;
}

function generateSuggestions(text: string, words: string[], lower: string, cats: CategoryScore[]): string[] {
  const suggestions: string[] = [];
  const weakest = [...cats].sort((a, b) => a.score - b.score)[0];

  if (words.length < 10) {
    suggestions.push("Your prompt is very short. Add 2-3 sentences of detail about features, design, and behavior.");
  }

  if (weakest.name === "Clarity" && weakest.score < 60) {
    suggestions.push("Start your prompt with a clear action: \"Create a...\", \"Build a...\", \"Add a...\"");
  }

  if (weakest.name === "Specificity" && weakest.score < 60) {
    suggestions.push("Add concrete details: specific colors, number of sections, feature names, sizes.");
  }

  if (weakest.name === "Context" && weakest.score < 60) {
    suggestions.push("Tell Claude what you're working with: \"In my React + Tailwind project...\" or \"This is a new Next.js app.\"");
  }

  if (weakest.name === "Completeness" && weakest.score < 60) {
    suggestions.push("Answer all three: What are you building? Where does it go? How should it look/work?");
  }

  // Specific pattern suggestions
  if (!/\d+[.)]\s/.test(text) && words.length > 15) {
    suggestions.push("Try using a numbered list for features — it helps Claude work through them systematically.");
  }

  if (countMatches(lower, DESIGN_TERMS) === 0 && /\b(page|site|app|website)\b/i.test(lower)) {
    suggestions.push("Add design direction: color scheme, style (modern/minimal/bold), and layout structure.");
  }

  if (!/\b(responsive|mobile)\b/i.test(lower) && /\b(page|site|app|website)\b/i.test(lower)) {
    suggestions.push("Mention if it should be responsive/mobile-friendly — Claude won't assume.");
  }

  return suggestions.slice(0, 4);
}

function extractStructured(text: string, lower: string): { what: string; where: string; how: string } {
  const sentences = text.split(/[.!?\n]/).map((s) => s.trim()).filter((s) => s.length > 3);

  let what = "";
  let where = "";
  let how = "";

  for (const s of sentences) {
    const sl = s.toLowerCase();
    if (!what && ACTION_VERBS.some((v) => sl.includes(v))) {
      what = s;
    } else if (!where && /\b(page|file|component|project|app|site|new|existing|add to)\b/i.test(sl)) {
      where = s;
    } else if (!how && (countMatches(sl, DESIGN_TERMS) > 0 || countMatches(sl, BEHAVIOR_TERMS) > 0 || /\b(should|must|make sure)\b/i.test(sl))) {
      how = s;
    }
  }

  // Fallback: if we couldn't parse, use the whole text for "what"
  if (!what && text.trim()) what = sentences[0] || text.trim();

  return {
    what: what || "Not specified — describe what you want built",
    where: where || "Not specified — mention where this should go (new project, existing file, etc.)",
    how: how || "Not specified — add design, behavior, and technical requirements",
  };
}

export function analyzePrompt(text: string): PromptAnalysis {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      overallScore: 0,
      grade: "-",
      categories: [
        { name: "Clarity", score: 0, label: "Missing", feedback: "Start typing to see your score." },
        { name: "Specificity", score: 0, label: "Missing", feedback: "" },
        { name: "Context", score: 0, label: "Missing", feedback: "" },
        { name: "Completeness", score: 0, label: "Missing", feedback: "" },
      ],
      missing: [],
      suggestions: [],
      structured: { what: "", where: "", how: "" },
    };
  }

  const words = trimmed.split(/\s+/);
  const lower = trimmed.toLowerCase();

  const clarity = scoreClarity(trimmed, words, lower);
  const specificity = scoreSpecificity(trimmed, words, lower);
  const context = scoreContext(trimmed, words, lower);
  const completeness = scoreCompleteness(trimmed, words, lower);
  const categories = [clarity, specificity, context, completeness];

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / 4);

  return {
    overallScore,
    grade: gradeFromScore(overallScore),
    categories,
    missing: generateMissing(lower, categories),
    suggestions: generateSuggestions(trimmed, words, lower, categories),
    structured: extractStructured(trimmed, lower),
  };
}
