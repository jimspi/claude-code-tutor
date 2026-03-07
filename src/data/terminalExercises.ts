export interface TerminalStep {
  command: string;
  output: string[];
  hint: string;
  successMessage?: string;
  promptOverride?: string;
  explanationNote?: string;
}

export interface TerminalExercise {
  id: string;
  title: string;
  completionMessage: string;
  steps: TerminalStep[];
}

export const terminalExercises: Record<string, TerminalExercise> = {
  navigate: {
    id: "navigate",
    title: "Navigate Like a Pro",
    completionMessage:
      "You just created a project folder and navigated into it. That's exactly what you'll do before starting Claude Code.",
    steps: [
      {
        command: "pwd",
        output: ["/home/user"],
        hint: "Try typing: pwd",
      },
      {
        command: "mkdir my-project",
        output: [],
        hint: "Try typing: mkdir my-project",
        explanationNote:
          "No news is good news in the terminal — the folder was created.",
      },
      {
        command: "ls",
        output: ["my-project/"],
        hint: "Try typing: ls",
      },
      {
        command: "cd my-project",
        output: [],
        hint: "Try typing: cd my-project",
        promptOverride: "/home/user/my-project $",
      },
      {
        command: "pwd",
        output: ["/home/user/my-project"],
        hint: "Try typing: pwd",
      },
    ],
  },

  "first-session": {
    id: "first-session",
    title: "Your First Claude Code Session",
    completionMessage:
      "That's it. You just built your first thing with Claude Code.",
    steps: [
      {
        command: "claude",
        output: [
          "  _____ _                 _        ____          _      ",
          " / ____| |               | |      / ___|___   __| | ___ ",
          "| |    | | __ _ _   _  __| | ___ | |   / _ \\ / _` |/ _ \\",
          "| |    | |/ _` | | | |/ _` |/ _ \\| |__| (_) | (_| |  __/",
          "|_|    |_|\\__,_|\\__,_|\\__,_|\\___/ \\____\\___/ \\__,_|\\___|",
          "",
          "Welcome to Claude Code v1.0",
          "Type your request in plain English. I'll handle the rest.",
          "",
          "claude >",
        ],
        hint: "Try typing: claude",
      },
      {
        command: "Create a simple HTML page that says Hello World",
        output: [
          "Planning: I'll create a simple HTML page with a Hello World message.",
          "",
          "Creating index.html...",
          "",
          "  <!DOCTYPE html>",
          "  <html lang=\"en\">",
          "  <head>",
          '    <meta charset="UTF-8">',
          "    <title>Hello World</title>",
          "  </head>",
          "  <body>",
          "    <h1>Hello World</h1>",
          "  </body>",
          "  </html>",
          "",
          "Done. Created index.html with your Hello World page.",
        ],
        hint: "Type your request in plain English",
        promptOverride: "claude >",
      },
      {
        command: "open index.html",
        output: [
          "Opening index.html in your default browser...",
          "",
          "Your page is now open in the browser!",
          "You should see a page with a large heading that reads \"Hello World\".",
        ],
        hint: "Try typing: open index.html",
      },
    ],
  },

  "git-save": {
    id: "git-save",
    title: "Git Save Points",
    completionMessage:
      "Save point created. If anything breaks, you can always come back here.",
    steps: [
      {
        command: "git init",
        output: [
          "Initialized empty Git repository in /home/user/my-project/.git/",
        ],
        hint: "Try typing: git init",
      },
      {
        command: "git add .",
        output: [],
        hint: "Try typing: git add .",
        explanationNote:
          "All files are now staged — ready to be saved.",
      },
      {
        command: 'git commit -m "save point before big changes"',
        output: [
          "[master (root-commit) a3b7c9d] save point before big changes",
          " 1 file changed, 12 insertions(+)",
          " create mode 100644 index.html",
        ],
        hint: 'Try typing: git commit -m "save point before big changes"',
      },
    ],
  },
};
