export interface GlossaryEntry {
  term: string;
  definition: string;
  usedIn?: string;
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    term: "API",
    definition:
      "A way for two programs to talk to each other — like a waiter taking your order to the kitchen and bringing back your food.",
  },
  {
    term: "Branch",
    definition:
      "A separate copy of your project where you can make changes without affecting the main version.",
    usedIn: "Level 3",
  },
  {
    term: "CLI",
    definition:
      "Command Line Interface — a way to control your computer by typing text commands instead of clicking buttons.",
    usedIn: "Level 1, Lesson 1",
  },
  {
    term: "Clone",
    definition:
      "Making a copy of someone else's project from the internet onto your own computer.",
    usedIn: "Level 3",
  },
  {
    term: "Commit",
    definition:
      "A save point for your project — a snapshot of all your files at a specific moment.",
    usedIn: "Level 3",
  },
  {
    term: "Component",
    definition:
      "A reusable building block of a website — like a card, a button, or a navigation bar.",
    usedIn: "Level 2",
  },
  {
    term: "CSS",
    definition:
      "The language that controls how a website looks — colors, fonts, spacing, and layout.",
  },
  {
    term: "Dependencies",
    definition:
      "Other people's code that your project uses — like building blocks someone else already made.",
  },
  {
    term: "Deploy",
    definition:
      "Putting your project on the internet so other people can see and use it.",
  },
  {
    term: "Environment Variable",
    definition:
      "A secret value stored outside your code — like a password or API key that you don't want to share publicly.",
    usedIn: "Level 4",
  },
  {
    term: "Framework",
    definition:
      "A pre-built toolkit that gives you a head start on building something — like a house frame before you add walls.",
  },
  {
    term: "Git",
    definition:
      "A tool that tracks every change you make to your files — like an unlimited undo button for your entire project.",
    usedIn: "Level 3",
  },
  {
    term: "GitHub",
    definition:
      "A website where people store, share, and collaborate on code projects.",
    usedIn: "Level 3",
  },
  {
    term: "HTML",
    definition:
      "The language that defines the structure of a website — the headings, paragraphs, images, and links.",
  },
  {
    term: "JavaScript",
    definition:
      "The programming language that makes websites interactive — like clicking buttons, showing popups, or loading new content.",
  },
  {
    term: "JSON",
    definition:
      "A simple format for storing data that both humans and computers can read — like a neatly organized list.",
  },
  {
    term: "Localhost",
    definition:
      "Your own computer acting as a temporary website server — only you can see it at http://localhost.",
  },
  {
    term: "Markdown",
    definition:
      "A simple way to format text using symbols — like using # for headings and ** for bold.",
    usedIn: "Level 4",
  },
  {
    term: "Node.js",
    definition:
      "A tool that lets you run JavaScript outside of a web browser — used for building servers and tools.",
  },
  {
    term: "npm",
    definition:
      "Node Package Manager — a tool that downloads and manages code packages (dependencies) for your project.",
  },
  {
    term: "Package",
    definition:
      "A bundle of pre-written code you can add to your project — like an app you install on your phone.",
  },
  {
    term: "Props",
    definition:
      "Data passed from a parent component to a child component — like filling in the blanks on a template.",
    usedIn: "Level 2",
  },
  {
    term: "Pull Request",
    definition:
      "A request to merge your changes into the main project — like submitting your work for review.",
    usedIn: "Level 3",
  },
  {
    term: "Repository",
    definition:
      "A folder that contains your entire project plus its complete change history.",
    usedIn: "Level 3",
  },
  {
    term: "Responsive",
    definition:
      "A design that automatically adjusts to look good on any screen size — phone, tablet, or desktop.",
  },
  {
    term: "Route",
    definition:
      "A URL path in your app — like /about or /contact — that shows a specific page.",
  },
  {
    term: "Slug",
    definition:
      "A URL-friendly version of a title — like 'my-first-post' instead of 'My First Post!'.",
  },
  {
    term: "State",
    definition:
      "Data that can change over time in your app — like whether a menu is open or closed.",
    usedIn: "Level 2",
  },
  {
    term: "Terminal",
    definition:
      "The text-based interface where you type commands to control your computer — also called the command line.",
    usedIn: "Level 1, Lesson 4",
  },
  {
    term: "TypeScript",
    definition:
      "JavaScript with added safety checks — it catches mistakes before your code runs.",
  },
  {
    term: "UI",
    definition:
      "User Interface — everything the user sees and interacts with on screen.",
  },
  {
    term: "Version Control",
    definition:
      "A system that tracks changes to your files over time so you can go back to any previous version.",
    usedIn: "Level 3",
  },
];
