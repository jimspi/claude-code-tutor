export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  fields: TemplateField[];
  assemble: (values: Record<string, string>) => string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "landing-page",
    title: "Landing Page",
    icon: "globe",
    category: "Build",
    description: "Create a complete landing page from scratch",
    fields: [
      { id: "business", label: "Business / project name", placeholder: "e.g., FreshPaws Pet Grooming" },
      { id: "sections", label: "Sections to include", placeholder: "e.g., hero, services, testimonials, contact form", multiline: true },
      { id: "colors", label: "Color scheme / style", placeholder: "e.g., blue and white, modern and clean" },
      { id: "extras", label: "Extra requirements", placeholder: "e.g., responsive, animations, dark mode" },
    ],
    assemble: (v) => {
      const parts = [`Create a landing page for ${v.business || "[your business name]"}.`];
      if (v.sections) parts.push(`Include the following sections: ${v.sections}.`);
      if (v.colors) parts.push(`Use a ${v.colors} design style.`);
      parts.push("Make it fully responsive for mobile, tablet, and desktop.");
      if (v.extras) parts.push(v.extras + ".");
      return parts.join(" ");
    },
  },
  {
    id: "add-feature",
    title: "Add a Feature",
    icon: "plus",
    category: "Build",
    description: "Add new functionality to an existing project",
    fields: [
      { id: "feature", label: "Feature to add", placeholder: "e.g., dark mode toggle, search bar, user profiles" },
      { id: "location", label: "Where it goes", placeholder: "e.g., in the navbar, on the settings page, as a new route" },
      { id: "behavior", label: "How it should work", placeholder: "e.g., toggle saves preference to localStorage, filters results in real-time", multiline: true },
      { id: "tech", label: "Tech stack", placeholder: "e.g., React, Tailwind, Next.js" },
    ],
    assemble: (v) => {
      const parts = [`Add ${v.feature || "[describe the feature]"} to my ${v.tech || ""} project.`];
      if (v.location) parts.push(`Place it ${v.location}.`);
      if (v.behavior) parts.push(`It should ${v.behavior}.`);
      parts.push("Match the existing design and make sure it works on mobile.");
      return parts.join(" ");
    },
  },
  {
    id: "fix-bug",
    title: "Fix a Bug",
    icon: "bug",
    category: "Debug",
    description: "Describe a bug and get Claude to fix it",
    fields: [
      { id: "error", label: "Error message or symptom", placeholder: "e.g., TypeError: Cannot read property 'map' of undefined", multiline: true },
      { id: "expected", label: "What should happen", placeholder: "e.g., The list of users should display on page load" },
      { id: "actual", label: "What actually happens", placeholder: "e.g., The page crashes with a white screen" },
      { id: "file", label: "File / location", placeholder: "e.g., src/components/UserList.tsx, line 24" },
    ],
    assemble: (v) => {
      const parts = ["I'm getting an error and need help fixing it."];
      if (v.error) parts.push(`Error: ${v.error}`);
      if (v.expected) parts.push(`Expected: ${v.expected}.`);
      if (v.actual) parts.push(`Actually: ${v.actual}.`);
      if (v.file) parts.push(`The issue is in ${v.file}.`);
      parts.push("Please find the root cause and fix it.");
      return parts.join("\n\n");
    },
  },
  {
    id: "refactor",
    title: "Refactor Code",
    icon: "refresh",
    category: "Improve",
    description: "Clean up messy or overgrown code",
    fields: [
      { id: "target", label: "What to refactor", placeholder: "e.g., src/App.tsx — it's 400 lines and hard to read" },
      { id: "goal", label: "Goal of the refactor", placeholder: "e.g., split into smaller components, improve readability" },
      { id: "constraints", label: "Constraints", placeholder: "e.g., don't change the visual design, keep the same API" },
    ],
    assemble: (v) => {
      const parts = [`Refactor ${v.target || "[file or code section]"}.`];
      if (v.goal) parts.push(`Goal: ${v.goal}.`);
      if (v.constraints) parts.push(`Constraints: ${v.constraints}.`);
      parts.push("Keep the same functionality and visual output. Just make the code cleaner.");
      return parts.join(" ");
    },
  },
  {
    id: "style-redesign",
    title: "Style / Redesign",
    icon: "palette",
    category: "Design",
    description: "Improve the visual design of an existing page",
    fields: [
      { id: "target", label: "What to restyle", placeholder: "e.g., the homepage, the dashboard, the pricing page" },
      { id: "style", label: "Desired style", placeholder: "e.g., modern, minimal, warm and inviting, SaaS-style" },
      { id: "specifics", label: "Specific changes", placeholder: "e.g., more whitespace, larger headings, card shadows, better color palette", multiline: true },
      { id: "reference", label: "Reference / inspiration", placeholder: "e.g., similar to Stripe's pricing page, Apple-style clean" },
    ],
    assemble: (v) => {
      const parts = [`Redesign ${v.target || "[page or component]"} to look more ${v.style || "modern and professional"}.`];
      if (v.specifics) parts.push(`Specifically: ${v.specifics}.`);
      if (v.reference) parts.push(`Style inspiration: ${v.reference}.`);
      parts.push("Make sure it's responsive and accessible.");
      return parts.join(" ");
    },
  },
  {
    id: "full-app",
    title: "Full App from Scratch",
    icon: "rocket",
    category: "Build",
    description: "Plan and build a complete application",
    fields: [
      { id: "app", label: "App name and purpose", placeholder: "e.g., TaskFlow — a personal task management app" },
      { id: "features", label: "Core features", placeholder: "e.g., add/edit/delete tasks, categories, due dates, drag-to-reorder", multiline: true },
      { id: "tech", label: "Tech stack", placeholder: "e.g., React, Tailwind, localStorage for data" },
      { id: "design", label: "Design direction", placeholder: "e.g., clean dark theme, purple accents, card-based layout" },
    ],
    assemble: (v) => {
      const parts = [`Build a ${v.app || "[app name and purpose]"} web app.`];
      if (v.tech) parts.push(`Use ${v.tech}.`);
      if (v.features) parts.push(`Core features:\n${v.features.split(/[,\n]/).map((f, i) => `${i + 1}. ${f.trim()}`).filter(f => f.length > 3).join("\n")}`);
      if (v.design) parts.push(`Design: ${v.design}.`);
      parts.push("Make it responsive. Keep the code clean with separate components for each major piece.");
      return parts.join("\n\n");
    },
  },
];

export const EXAMPLE_PROMPTS = {
  vague: [
    "Make me a website",
    "Add some buttons",
    "Fix the page",
    "Make it look better",
    "Build an app",
  ],
  strong: [
    "Create a landing page for a dog walking business called PawPals. Include a hero section with a headline and CTA button, a services section with 3 cards (daily walks, group hikes, puppy visits), a testimonials section, and a contact form. Use a green and white color scheme with a clean, modern design. Make it responsive.",
    "Add a dark mode toggle to my React + Tailwind portfolio site. Put a sun/moon icon button in the top-right of the navbar. When toggled, switch all colors to a dark palette (dark gray background, light text). Save the user's preference to localStorage so it persists between visits. Add a smooth 200ms transition when switching.",
    "I'm getting 'TypeError: Cannot read properties of undefined (reading map)' in src/components/UserList.tsx on line 12. The users array is fetched from /api/users but the component crashes on first render before the data arrives. Expected: show a loading spinner until data loads, then render the list. Please fix the crash and add proper loading/error states.",
  ],
};
