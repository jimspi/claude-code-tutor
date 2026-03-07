export interface PlaygroundScenario {
  id: string;
  category: string;
  title: string;
  starterPrompt: string;
  response: string[];
  tips: string[];
  followUps: string[];
}

export const scenarios: PlaygroundScenario[] = [
  {
    id: "landing-page",
    category: "Build",
    title: "Landing Page",
    starterPrompt:
      "Create a landing page for a coffee shop called Sunrise Roasters",
    response: [
      "Reading project directory...",
      "Found package.json, src/ folder. This is a Vite + React project.",
      "Planning: I'll create a landing page with a hero section, about section, featured drinks, and a footer.",
      "Planned files:",
      "  - src/pages/LandingPage.tsx",
      "  - src/styles/landing.css",
      "  - src/components/Hero.tsx",
      "  - src/components/Footer.tsx",
      "Creating src/pages/LandingPage.tsx...",
      "  export default function LandingPage() {",
      '    return <div className="landing">',
      "      <Hero />",
      "      <AboutSection />",
      "      ...",
      "  }",
      "Creating src/styles/landing.css...",
      "  :root { --brand-gold: #d4a24e; --dark-roast: #2c1a0e; }",
      "  .hero { background: var(--dark-roast); color: white; ... }",
      "  ...",
      "Creating src/components/Hero.tsx...",
      "Creating src/components/Footer.tsx...",
      "Updating src/App.tsx to render LandingPage...",
      "Done. Created 4 new files and updated 1 file.",
    ],
    tips: [
      "Mention the specific sections you want (hero, menu, testimonials, contact form, etc.)",
      "Specify brand colors or a visual style (rustic, modern, minimalist)",
      "Say whether it should be responsive or mobile-first",
    ],
    followUps: [
      "Make the hero section full-screen with a background image",
      "Add a menu section with 3 coffee drinks",
      "Make it responsive for mobile",
    ],
  },
  {
    id: "fix-a-bug",
    category: "Debug",
    title: "Fix a Bug",
    starterPrompt:
      "I'm getting an error: Cannot read properties of undefined (reading 'map'). Here's my component...",
    response: [
      "Reading src/components/UserList.tsx...",
      "Found the issue. On line 12 you call `users.map(...)`, but `users` is fetched asynchronously and is `undefined` before the API responds.",
      "The state is initialized as `const [users, setUsers] = useState()` with no default value.",
      "Applying fix to src/components/UserList.tsx...",
      "  - const [users, setUsers] = useState();",
      "  + const [users, setUsers] = useState<User[]>([]);",
      "  ...",
      "  - return <ul>{users.map(u => <li>{u.name}</li>)}</ul>",
      "  + if (!users.length) return <p>Loading...</p>;",
      "  + return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>",
      "Done. Fixed 1 file: added a default empty array and a loading check.",
    ],
    tips: [
      "Paste the full error message including the stack trace",
      "Mention what you expected to happen vs. what actually happened",
      "Include the file name and line number if available",
    ],
    followUps: [
      "Add error handling for when the API request fails",
      "Show a loading spinner while data loads",
    ],
  },
  {
    id: "add-a-feature",
    category: "Build",
    title: "Add a Feature",
    starterPrompt: "Add dark mode to my existing portfolio site",
    response: [
      "Reading codebase to understand current structure...",
      "Read 3 files: src/App.tsx, src/index.css, src/components/Navbar.tsx",
      "Planning dark mode implementation:",
      "  1. Add CSS custom properties for light/dark themes",
      "  2. Create a ThemeToggle component",
      "  3. Update layout to apply the theme class",
      "Editing src/index.css — adding CSS variables...",
      '  [data-theme="light"] { --bg: #ffffff; --text: #1a1a1a; ... }',
      '  [data-theme="dark"] { --bg: #1a1a1a; --text: #f0f0f0; ... }',
      "Creating src/components/ThemeToggle.tsx...",
      "  export default function ThemeToggle() {",
      "    const [theme, setTheme] = useState('light');",
      '    const toggle = () => setTheme(t => t === "light" ? "dark" : "light");',
      "    ...",
      "  }",
      "Updating src/components/Navbar.tsx — adding toggle button...",
      "Updating src/App.tsx — applying data-theme attribute to root div...",
      "Done. Created 1 new file and updated 3 existing files.",
    ],
    tips: [
      "Specify where the toggle switch should appear (navbar, sidebar, footer)",
      "Mention your preferred dark mode colors if you have any",
      "Say which framework or CSS approach you're using (Tailwind, CSS modules, etc.)",
    ],
    followUps: [
      "Save the user's preference to localStorage",
      "Add a smooth transition when switching themes",
    ],
  },
  {
    id: "api-integration",
    category: "Build",
    title: "API Integration",
    starterPrompt:
      "Add a weather widget that shows current weather using a free API",
    response: [
      "I'll use the OpenWeatherMap free API for current weather data.",
      "Creating src/components/WeatherWidget.tsx...",
      "  export default function WeatherWidget() {",
      "    const [weather, setWeather] = useState<WeatherData | null>(null);",
      "    const [loading, setLoading] = useState(true);",
      "    const [error, setError] = useState<string | null>(null);",
      "    ...",
      "  }",
      "Setting up fetch call to api.openweathermap.org/data/2.5/weather...",
      "  useEffect(() => {",
      "    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)",
      "      .then(res => res.json())",
      "      .then(data => { setWeather(data); setLoading(false); })",
      "      .catch(err => { setError(err.message); setLoading(false); });",
      "  }, [city]);",
      "Added loading spinner and error fallback UI.",
      "Creating src/types/weather.ts with WeatherData interface...",
      "Done. Created 2 new files. Remember to add your API key to .env as VITE_WEATHER_API_KEY.",
    ],
    tips: [
      "Mention the specific API you want to use if you have a preference",
      "Describe where the widget should appear in your layout",
      "Specify what data to display (temperature, humidity, wind, forecast, etc.)",
    ],
    followUps: [
      "Add a 5-day forecast below the current weather",
      "Style it to match the rest of my site",
    ],
  },
  {
    id: "start-from-scratch",
    category: "Plan",
    title: "Start From Scratch",
    starterPrompt:
      "I want to build a recipe organizer app. Plan it out before building.",
    response: [
      "Here's my recommended plan for a Recipe Organizer app:",
      "",
      "Tech Stack:",
      "  - React + TypeScript (frontend)",
      "  - Vite (bundler)",
      "  - localStorage for persistence (upgrade to a DB later)",
      "",
      "Core Features:",
      "  1. Add / edit / delete recipes",
      "  2. Categorize by meal type (breakfast, lunch, dinner, snack)",
      "  3. Search and filter recipes",
      "  4. Ingredient checklist for shopping",
      "",
      "File Structure:",
      "  src/pages/       - RecipeList, RecipeDetail, AddRecipe",
      "  src/components/  - RecipeCard, SearchBar, CategoryFilter, IngredientList",
      "  src/hooks/       - useRecipes, useSearch",
      "  src/types/       - recipe.ts",
      "  src/utils/       - storage.ts",
      "",
      "Data Model (Recipe):",
      "  { id, title, category, ingredients[], instructions[], prepTime, servings, createdAt }",
      "",
      "Implementation Order:",
      "  Phase 1: Data model + add/list recipes",
      "  Phase 2: Search, filter, categories",
      "  Phase 3: Polish UI, add shopping list feature",
      "",
      "Ready to start building when you are.",
    ],
    tips: [
      "Describe who will use the app (just you, family, public users)",
      "List the must-have features vs. nice-to-haves",
      "Mention any tech preferences or constraints (e.g., 'I want to use Next.js')",
    ],
    followUps: [
      "Great plan. Start building the recipe list page first",
      "Add user authentication so people can save their own recipes",
    ],
  },
  {
    id: "refactor",
    category: "Improve",
    title: "Refactor",
    starterPrompt:
      "This file is getting too long. Break it into smaller, cleaner components",
    response: [
      "Reading src/App.tsx... (287 lines)",
      "Analyzing component structure...",
      "I found 4 distinct sections that can be extracted:",
      "  1. Header with navigation (lines 24-68)",
      "  2. Sidebar with filters (lines 70-132)",
      "  3. Product grid (lines 134-218)",
      "  4. Shopping cart drawer (lines 220-280)",
      "Creating src/components/Header.tsx... (45 lines)",
      "  export default function Header({ cartCount }: HeaderProps) { ... }",
      "Creating src/components/Sidebar.tsx... (63 lines)",
      "  export default function Sidebar({ filters, onFilterChange }: SidebarProps) { ... }",
      "Creating src/components/ProductGrid.tsx... (85 lines)",
      "Creating src/components/CartDrawer.tsx... (61 lines)",
      "Updating src/App.tsx — replacing inline code with component imports...",
      "  import Header from './components/Header';",
      "  import Sidebar from './components/Sidebar';",
      "  ...",
      "App.tsx is now 42 lines (down from 287).",
      "Done. Created 4 new files and updated 1 file.",
    ],
    tips: [
      "Mention which file you want refactored",
      "Describe what 'cleaner' means to you (single responsibility, reusability, readability)",
      "Specify if you have preferred component boundaries in mind",
    ],
    followUps: [
      "Now add TypeScript types to all the new components",
      "Create an index.ts barrel file for the components folder",
    ],
  },
  {
    id: "write-tests",
    category: "Quality",
    title: "Write Tests",
    starterPrompt: "Write tests for my authentication module",
    response: [
      "Reading src/utils/auth.ts...",
      "Found 4 exported functions: login(), signup(), verifyToken(), logout()",
      "Creating src/utils/auth.test.ts...",
      "",
      '  describe("login", () => {',
      '    it("should return a token for valid credentials", ...)',
      '    it("should throw for invalid password", ...)',
      '    it("should throw for missing email or password", ...)',
      '    it("should throw if account does not exist", ...)',
      "  });",
      "",
      '  describe("verifyToken", () => {',
      '    it("should return user data for a valid token", ...)',
      '    it("should throw for an expired token", ...)',
      '    it("should throw for a malformed token", ...)',
      "  });",
      "",
      '  describe("logout", () => {',
      '    it("should clear the session token", ...)',
      "  });",
      "",
      "Wrote 8 test cases covering happy paths and edge cases.",
      "Done. Created 1 file: src/utils/auth.test.ts",
      "Run with: npx vitest run src/utils/auth.test.ts",
    ],
    tips: [
      "Specify which test framework you use (Vitest, Jest, etc.)",
      "Mention any edge cases you're worried about",
      "Say which functions or flows are most critical to test",
    ],
    followUps: [
      "Add integration tests for the signup flow",
      "Check test coverage and fill any gaps",
    ],
  },
  {
    id: "explain-code",
    category: "Learn",
    title: "Explain Code",
    starterPrompt: "Explain what this useEffect hook does in plain English",
    response: [
      "Here's a breakdown of your useEffect:",
      "",
      "  useEffect(() => {",
      "    const handler = setTimeout(() => { setDebouncedValue(value); }, 300);",
      "    return () => clearTimeout(handler);",
      "  }, [value]);",
      "",
      "Line by line:",
      "1. `useEffect(...)` - This runs a side effect after the component renders.",
      "2. `setTimeout(..., 300)` - It waits 300ms, then updates `debouncedValue` with the current `value`.",
      "3. `return () => clearTimeout(handler)` - This is the cleanup function. If `value` changes before the 300ms is up, it cancels the previous timer.",
      "4. `[value]` - The dependency array. This effect only re-runs when `value` changes.",
      "",
      "In plain English: this is a debounce pattern. It waits for the user to stop typing for 300ms before updating the value. Every keystroke resets the timer.",
      "This is commonly used for search inputs to avoid firing an API call on every single keystroke.",
    ],
    tips: [
      "Paste the specific code you want explained",
      "Mention your experience level so the explanation matches",
      "Ask about the specific part that confuses you",
    ],
    followUps: [
      "What would happen if I removed the dependency array?",
      "Can you refactor this to be simpler?",
    ],
  },
];

export function getGenericTips(input: string): string[] {
  const lower = input.toLowerCase();

  if (lower.includes("website") || lower.includes("page")) {
    return [
      "Specify which sections you want (hero, about, contact, etc.)",
      "Describe the design style you're going for (modern, minimal, bold)",
      "Mention if it should be responsive or mobile-first",
      "Include any brand colors or fonts you want to use",
    ];
  }

  if (lower.includes("app")) {
    return [
      "Describe the main user flow from start to finish",
      "List the core features vs. nice-to-haves",
      "Mention your preferred tech stack if you have one",
      "Specify whether you need authentication or data persistence",
    ];
  }

  if (lower.includes("fix") || lower.includes("bug") || lower.includes("error")) {
    return [
      "Paste the full error message and stack trace",
      "Describe what you expected to happen vs. what actually happened",
      "Include the file name and relevant code",
      "Mention any recent changes that might have caused the issue",
    ];
  }

  if (lower.includes("test")) {
    return [
      "Specify your test framework (Jest, Vitest, Mocha, etc.)",
      "Mention which functions or flows are most critical to cover",
      "Say whether you want unit tests, integration tests, or both",
    ];
  }

  return [
    "Be specific about what you want built or changed",
    "Describe the expected behavior or end result",
    "Mention your tech stack (React, Vue, Node, etc.)",
    "Break large requests into smaller, focused prompts",
  ];
}
