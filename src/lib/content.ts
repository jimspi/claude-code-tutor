export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "code"; code: string; language?: string; label?: string }
  | { type: "comparison"; left: { title: string; text: string }; right: { title: string; text: string } }
  | { type: "concept"; title: string; text: string }
  | { type: "prompt-card"; phrase: string; explanation: string }
  | { type: "accordion"; title: string; content: string }
  | { type: "checklist"; items: string[] }
  | { type: "step"; number: number; title: string; text: string }
  | { type: "myth-reality"; myth: string; reality: string }
  | { type: "terminal-demo"; lines: { prompt?: string; command: string; output: string }[] }
  | { type: "flowchart"; nodes: { id: string; text: string; yes?: string; no?: string; next?: string }[] }
  | { type: "tip"; text: string }
  | { type: "exercise"; prompt: string; reveal: string }
  | { type: "divider" }
  | {
      type: "interactive-terminal";
      title?: string;
      commands: {
        command: string;
        output: string[];
        prompt?: string;
        delay?: number;
      }[];
      allowFreeType?: boolean;
    }
  | {
      type: "claude-conversation";
      title?: string;
      steps: ClaudeConversationStep[];
    }
  | {
      type: "prompt-builder";
      scenario: string;
      sections: {
        label: string;
        placeholder: string;
        options?: string[];
      }[];
      examplePrompt: string;
    }
  | {
      type: "quiz";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      type: "drag-rank";
      instruction: string;
      items: { id: string; text: string }[];
      correctOrder: string[];
      feedback: string;
    };

export type ClaudeConversationStep =
  | { role: "user"; message: string; suggested?: boolean }
  | { role: "claude"; message: string; typing?: boolean }
  | { role: "permission"; action: string; detail?: string }
  | { role: "file-creation"; filename: string; lines: string[] };

export interface LessonContent {
  lessonId: string;
  blocks: ContentBlock[];
}

export const lessonContent: Record<string, LessonContent> = {
  "1-1": {
    lessonId: "1-1",
    blocks: [
      {
        type: "heading",
        text: "What Is Claude Code?",
      },
      {
        type: "paragraph",
        text: "Let's start with the simplest possible explanation. Claude Code is a tool that lives in your terminal (that black or white window where you type commands) and lets you build software by describing what you want in plain English.",
      },
      {
        type: "paragraph",
        text: "You don't need to know how to code. You don't need a computer science degree. You just need to be able to describe what you want, and Claude Code will write the code, create the files, and build it for you.",
      },
      {
        type: "concept",
        title: "Think of it this way",
        text: "Imagine having a senior developer sitting next to you who never gets tired, never judges your questions, and works at lightning speed. You say \"build me a website for my bakery\" and they start typing away, creating files, writing code, and showing you the result. That's Claude Code.",
      },
      {
        type: "paragraph",
        text: "Here's the key idea you need to understand: with Claude Code, you describe what you want in plain English, and Claude writes the code. This is fundamentally different from traditional coding where you have to learn a programming language and write every single line yourself.",
      },
      {
        type: "comparison",
        left: {
          title: "Traditional Coding",
          text: "You learn a programming language. You write every line of code by hand. You spend hours debugging when something breaks. You need to understand syntax, frameworks, and tools. It takes months or years to build something meaningful.",
        },
        right: {
          title: "With Claude Code",
          text: "You describe what you want in plain English. Claude writes the code for you. When something breaks, you tell Claude and it fixes it. You focus on ideas, not syntax. You can build something meaningful in minutes.",
        },
      },
      {
        type: "paragraph",
        text: "Claude Code is not a chatbot that just gives you advice. It's an agent that actually does the work. It creates real files on your computer, runs real commands, and builds real applications that you can use, share, and deploy to the internet.",
      },
      {
        type: "heading",
        text: "What Can You Build With It?",
      },
      {
        type: "paragraph",
        text: "Pretty much anything that runs on a computer. Here are just a few examples of what people build with Claude Code every day:",
      },
      {
        type: "checklist",
        items: [
          "Personal websites and portfolios",
          "Business landing pages",
          "Web applications with user accounts and databases",
          "Mobile-friendly apps",
          "Automation scripts that save hours of manual work",
          "Data analysis tools",
          "Browser extensions",
          "APIs and backend services",
        ],
      },
      {
        type: "concept",
        title: "The big picture",
        text: "Claude Code is not replacing developers. It's making the power of software creation accessible to everyone. Whether you're a small business owner who needs a website, a creative person with an app idea, or a developer who wants to move ten times faster, Claude Code meets you where you are.",
      },
      {
        type: "tip",
        text: "You don't need to understand everything right now. The most important takeaway from this lesson is simple: Claude Code lets you build real software by having a conversation. Everything else, you'll learn by doing.",
      },
    ],
  },
  "1-2": {
    lessonId: "1-2",
    blocks: [
      {
        type: "heading",
        text: "Installing Claude Code",
      },
      {
        type: "paragraph",
        text: "Getting Claude Code up and running is straightforward. Follow these steps one at a time, and you'll be ready to go in just a few minutes.",
      },
      {
        type: "subheading",
        text: "Step 1: Open Your Terminal",
      },
      {
        type: "paragraph",
        text: "The terminal is a text-based interface where you type commands to your computer. Every computer has one built in.",
      },
      {
        type: "comparison",
        left: {
          title: "On Mac",
          text: "Open Spotlight (Cmd + Space), type \"Terminal\", and press Enter. You'll see a window with a blinking cursor. That's your terminal.",
        },
        right: {
          title: "On Windows",
          text: "Press the Windows key, type \"PowerShell\", and click \"Windows PowerShell\". You'll see a blue window with a blinking cursor. That's your terminal.",
        },
      },
      {
        type: "subheading",
        text: "Step 2: Install Node.js",
      },
      {
        type: "paragraph",
        text: "Node.js is the engine that runs Claude Code. Think of it like how you need a gas engine to drive a car. You need Node.js to run Claude Code. If you already have it installed, you can skip this step.",
      },
      {
        type: "paragraph",
        text: "Check if you already have Node.js by typing this in your terminal:",
      },
      {
        type: "code",
        code: "node --version",
        language: "bash",
        label: "Check Node.js version",
      },
      {
        type: "paragraph",
        text: "If you see a version number (like v20.11.0), you're good. If you see an error, head to nodejs.org and download the LTS (Long Term Support) version. Install it like any other application, then restart your terminal.",
      },
      {
        type: "subheading",
        text: "Step 3: Install Claude Code",
      },
      {
        type: "paragraph",
        text: "Now the fun part. Type this command in your terminal and press Enter:",
      },
      {
        type: "code",
        code: "npm install -g @anthropic-ai/claude-code",
        language: "bash",
        label: "Install Claude Code globally",
      },
      {
        type: "paragraph",
        text: "This tells npm (Node's package manager, which was installed alongside Node.js) to install Claude Code globally on your computer. The \"-g\" means \"make this available everywhere, not just in one folder.\"",
      },
      {
        type: "subheading",
        text: "Step 4: Verify It Worked",
      },
      {
        type: "paragraph",
        text: "Once the installation finishes, verify everything is working:",
      },
      {
        type: "code",
        code: "claude --version",
        language: "bash",
        label: "Verify installation",
      },
      {
        type: "paragraph",
        text: "If you see a version number, congratulations, Claude Code is installed and ready to use.",
      },
      {
        type: "subheading",
        text: "Try It: Run the Installation Commands",
      },
      {
        type: "paragraph",
        text: "Practice running the installation steps in this simulated terminal. Click each command to see what happens:",
      },
      {
        type: "interactive-terminal",
        title: "Terminal",
        commands: [
          {
            command: "node --version",
            output: ["v20.11.0"],
            delay: 60,
          },
          {
            command: "npm install -g @anthropic-ai/claude-code",
            output: [
              "added 1 package in 3s",
              "",
              "1 package is looking for funding",
              "  run `npm fund` for details",
            ],
            delay: 150,
          },
          {
            command: "claude --version",
            output: ["claude-code v1.0.6"],
            delay: 60,
          },
        ],
      },
      {
        type: "subheading",
        text: "Troubleshooting",
      },
      {
        type: "accordion",
        title: "I don't have Node.js and the download is confusing",
        content: "Go to nodejs.org. You'll see two big green download buttons. Click the one that says \"LTS\" (which stands for Long Term Support). This is the stable, recommended version. Download it, open the installer, and click \"Next\" through all the steps. When it's done, close your terminal completely and open a new one. Then try \"node --version\" again.",
      },
      {
        type: "accordion",
        title: "I'm getting a 'permission denied' error",
        content: "On Mac or Linux, try adding \"sudo\" before the command: sudo npm install -g @anthropic-ai/claude-code. It will ask for your computer's password. On Windows, close PowerShell, then right-click on PowerShell and choose \"Run as Administrator.\" Then try the install command again.",
      },
      {
        type: "accordion",
        title: "'command not found' after installing",
        content: "This usually means your terminal doesn't know where Claude Code was installed. First, try closing your terminal completely and opening a fresh one. If that doesn't work, try reinstalling Node.js from nodejs.org (making sure to check the box that says \"Add to PATH\" during installation).",
      },
      {
        type: "accordion",
        title: "The install seems stuck or is taking forever",
        content: "npm can sometimes be slow. Wait at least 2-3 minutes before assuming something is wrong. If it truly seems stuck, press Ctrl+C to cancel, then try running the install command again. A stable internet connection is required.",
      },
      {
        type: "tip",
        text: "Once Claude Code is installed, you only need to do this setup once. From now on, you just open your terminal, type \"claude\", and you're in.",
      },
    ],
  },
  "1-3": {
    lessonId: "1-3",
    blocks: [
      {
        type: "heading",
        text: "Your First Conversation",
      },
      {
        type: "paragraph",
        text: "You've installed Claude Code. Now it's time to use it. This is the moment where it clicks, where you see why people are so excited about this tool.",
      },
      {
        type: "subheading",
        text: "Starting Claude Code",
      },
      {
        type: "paragraph",
        text: "Open your terminal, navigate to a folder where you want to work (your Desktop is fine for now), and type:",
      },
      {
        type: "code",
        code: "claude",
        language: "bash",
        label: "Start Claude Code",
      },
      {
        type: "paragraph",
        text: "That's it. One word. Claude Code starts up and greets you with a prompt, waiting for you to tell it what to do. You're now having a conversation with an AI that can build things on your computer.",
      },
      {
        type: "subheading",
        text: "Your First Request",
      },
      {
        type: "paragraph",
        text: "Let's start with something simple. Type this exactly (or something similar, it doesn't need to be word-for-word):",
      },
      {
        type: "code",
        code: "Create a simple HTML page that says Hello World with nice styling",
        language: "text",
        label: "Your first prompt",
      },
      {
        type: "paragraph",
        text: "Press Enter and watch what happens. Step through this simulated conversation to see exactly how it works:",
      },
      {
        type: "claude-conversation",
        title: "Claude Code",
        steps: [
          {
            role: "user",
            message: "Create a simple HTML page that says Hello World with nice styling",
            suggested: true,
          },
          {
            role: "claude",
            message: "I'll create a beautifully styled Hello World page for you. Let me set that up.",
            typing: true,
          },
          {
            role: "permission",
            action: "Create file: index.html",
            detail: "A styled HTML page with a centered Hello World message",
          },
          {
            role: "file-creation",
            filename: "index.html",
            lines: [
              "<!DOCTYPE html>",
              "<html lang=\"en\">",
              "<head>",
              "  <meta charset=\"UTF-8\">",
              "  <title>Hello World</title>",
              "  <style>",
              "    body {",
              "      font-family: system-ui, sans-serif;",
              "      display: flex;",
              "      justify-content: center;",
              "      align-items: center;",
              "      min-height: 100vh;",
              "      background: #0f172a;",
              "      color: white;",
              "    }",
              "    h1 { font-size: 3rem; }",
              "  </style>",
              "</head>",
              "<body>",
              "  <h1>Hello World</h1>",
              "</body>",
              "</html>",
            ],
          },
          {
            role: "claude",
            message: "Done! I created index.html with a centered \"Hello World\" heading on a dark background with clean typography. Open the file in your browser to see it.",
            typing: true,
          },
          {
            role: "user",
            message: "Make the background dark and add a subtitle that says \"Built with Claude Code\"",
            suggested: true,
          },
          {
            role: "claude",
            message: "I'll update the page with a subtitle right away.",
            typing: true,
          },
          {
            role: "permission",
            action: "Edit file: index.html",
            detail: "Adding subtitle and adjusting styles",
          },
          {
            role: "claude",
            message: "Updated! The page now has a subtitle reading \"Built with Claude Code\" beneath the main heading. Refresh your browser to see the changes.",
            typing: true,
          },
        ],
      },
      {
        type: "concept",
        title: "This is the key insight",
        text: "Claude Code isn't just chatting with you. It's actually creating real files on your computer. That HTML file it just made? You can open it in Chrome, Firefox, or Safari and see a real web page. You can send it to someone. You can put it on the internet. It's real.",
      },
      {
        type: "paragraph",
        text: "Notice how the second request built on the first? You didn't start over. You refined what was already there. That's the core workflow.",
      },
      {
        type: "code",
        code: "Make the background dark and the text a light color. Also add a subtitle that says \"Built with Claude Code\"",
        language: "text",
        label: "Iterate on your creation",
      },
      {
        type: "paragraph",
        text: "Claude will modify the file it already created, applying your changes. Refresh the file in your browser and you'll see the updates instantly.",
      },
      {
        type: "tip",
        text: "You just built and customized a web page without writing a single line of code. This is the fundamental workflow of Claude Code: describe what you want, watch it get built, then ask for changes. You'll use this same loop for everything from simple pages to complex applications.",
      },
    ],
  },
  "1-4": {
    lessonId: "1-4",
    blocks: [
      {
        type: "heading",
        text: "Understanding the Basics of the Terminal",
      },
      {
        type: "paragraph",
        text: "You don't need to become a terminal expert to use Claude Code. But knowing five basic commands will make your experience much smoother. Think of these as the five moves you need to know in a video game. Once you learn them, everything else gets easier.",
      },
      {
        type: "paragraph",
        text: "Try running these commands in the interactive terminal below. Click each one to see what it does:",
      },
      {
        type: "interactive-terminal",
        title: "Terminal",
        commands: [
          {
            command: "pwd",
            output: ["/Users/yourname/Desktop"],
            delay: 60,
          },
          {
            command: "ls",
            output: ["Documents  Downloads  Projects  notes.txt"],
            delay: 60,
          },
          {
            command: "mkdir my-project",
            output: [],
            delay: 60,
          },
          {
            command: "cd my-project",
            output: [],
            delay: 60,
          },
          {
            command: "pwd",
            output: ["/Users/yourname/Desktop/my-project"],
            delay: 60,
          },
        ],
        allowFreeType: true,
      },
      {
        type: "subheading",
        text: "The Five Essential Commands",
      },
      {
        type: "step",
        number: 1,
        title: "pwd - Where am I?",
        text: "Stands for \"print working directory.\" It shows you the full path to the folder you're currently in. This is your map. When you're lost, type pwd.",
      },
      {
        type: "code",
        code: "pwd\n# Output: /Users/yourname/Desktop",
        language: "bash",
        label: "See your current location",
      },
      {
        type: "step",
        number: 2,
        title: "ls - What's in here?",
        text: "Lists everything in your current folder: files, subfolders, everything. On Windows PowerShell, \"dir\" does the same thing, but \"ls\" also works in modern PowerShell.",
      },
      {
        type: "code",
        code: "ls\n# Output: Documents  Downloads  my-project  notes.txt",
        language: "bash",
        label: "See folder contents",
      },
      {
        type: "step",
        number: 3,
        title: "cd folder-name - Move into a folder",
        text: "Stands for \"change directory.\" This moves you into a different folder. To go back up one level, use \"cd ..\" (with two dots).",
      },
      {
        type: "code",
        code: "cd my-project     # Move into the \"my-project\" folder\ncd ..              # Go back up one level\ncd ~/Desktop       # Jump directly to your Desktop",
        language: "bash",
        label: "Navigate between folders",
      },
      {
        type: "step",
        number: 4,
        title: "mkdir folder-name - Create a new folder",
        text: "Stands for \"make directory.\" Creates a brand new empty folder. This is how you set up a new project.",
      },
      {
        type: "code",
        code: "mkdir my-awesome-app",
        language: "bash",
        label: "Create a new folder",
      },
      {
        type: "step",
        number: 5,
        title: "cd .. - Go back",
        text: "The two dots mean \"the parent folder\" or \"one level up.\" If you went into my-project and want to come back out, this is your exit.",
      },
      {
        type: "code",
        code: "cd ..",
        language: "bash",
        label: "Go up one folder",
      },
      {
        type: "concept",
        title: "The golden rule",
        text: "Always start Claude Code from the folder where you want your project to live. If you want to build a website in a folder called \"my-website\", first create that folder with mkdir, then move into it with cd, and then type claude. Claude Code will create all its files in whatever folder you're in when you start it.",
      },
      {
        type: "paragraph",
        text: "Here's the typical workflow to start a brand new project:",
      },
      {
        type: "code",
        code: "mkdir my-new-project\ncd my-new-project\nclaude",
        language: "bash",
        label: "Starting a new project workflow",
      },
      {
        type: "tip",
        text: "That's it. Five commands. You now know enough terminal to use Claude Code effectively. If you ever need a command you don't know, just ask Claude Code itself: \"How do I [thing you want to do] in the terminal?\" It will tell you.",
      },
    ],
  },
  "1-5": {
    lessonId: "1-5",
    blocks: [
      {
        type: "heading",
        text: "How Claude Code Thinks",
      },
      {
        type: "paragraph",
        text: "Before you start building in earnest, it helps to understand how Claude Code operates under the hood. Not the technical details, just the mental model. Knowing how Claude Code thinks will help you work with it more effectively.",
      },
      {
        type: "subheading",
        text: "The Permission Model",
      },
      {
        type: "paragraph",
        text: "Claude Code doesn't just run wild on your computer. It asks permission before doing anything significant. When it wants to create a file, run a command, or make changes, it tells you what it plans to do and waits for your approval.",
      },
      {
        type: "concept",
        title: "The contractor analogy",
        text: "Claude Code is like a contractor renovating your house. It proposes what it wants to do: \"I'd like to knock out this wall and add a window here.\" You look at the proposal and say \"go ahead\" or \"actually, let's do it differently.\" It never starts swinging a hammer without your approval.",
      },
      {
        type: "paragraph",
        text: "You'll see prompts like \"Claude wants to create file: index.html\" or \"Claude wants to run: npm install\". You can approve each one, or approve all actions of a certain type to speed things up.",
      },
      {
        type: "paragraph",
        text: "See how the permission model works in practice. Step through this simulated session:",
      },
      {
        type: "claude-conversation",
        title: "Claude Code",
        steps: [
          {
            role: "user",
            message: "Create a simple todo app",
            suggested: true,
          },
          {
            role: "claude",
            message: "I'll build a todo app for you. I need to create a few files to get started.",
            typing: true,
          },
          {
            role: "permission",
            action: "Create file: index.html",
            detail: "The main HTML page for the todo app",
          },
          {
            role: "permission",
            action: "Create file: style.css",
            detail: "Styles for the todo app interface",
          },
          {
            role: "permission",
            action: "Create file: app.js",
            detail: "JavaScript logic for adding and removing todos",
          },
          {
            role: "claude",
            message: "All done! Your todo app has three files: index.html for the structure, style.css for the design, and app.js for the functionality. Open index.html in your browser to try it out.",
            typing: true,
          },
        ],
      },
      {
        type: "paragraph",
        text: "Notice how Claude asked permission for each file before creating it? That's the permission model in action. You stay in control at every step.",
      },
      {
        type: "subheading",
        text: "Context: What Claude Can See",
      },
      {
        type: "paragraph",
        text: "When you start Claude Code in a project folder, it can read and understand the files that are already there. This is powerful because it means Claude doesn't build in a vacuum. It sees your existing code, understands the structure, and makes changes that fit in with what's already been built.",
      },
      {
        type: "checklist",
        items: [
          "Claude can read all files in your current folder and subfolders",
          "Claude understands the relationships between files",
          "Claude notices patterns in your existing code and follows them",
          "Claude can search through your codebase to find relevant files",
        ],
      },
      {
        type: "subheading",
        text: "Sessions: Fresh Starts and Continuity",
      },
      {
        type: "paragraph",
        text: "Each time you type \"claude\" and start a new session, Claude Code starts fresh in terms of conversation history. It doesn't remember what you discussed last time. However, it can still read all your project files, so it knows what exists even if it doesn't remember building it.",
      },
      {
        type: "comparison",
        left: {
          title: "What Claude Remembers",
          text: "Everything said in the current session. All files in your project folder. Changes it has made during this session. Your instructions and preferences from this conversation.",
        },
        right: {
          title: "What Claude Forgets",
          text: "Conversations from previous sessions. Your preferences unless they're written in a CLAUDE.md file (you'll learn about this later). Why certain decisions were made in past sessions.",
        },
      },
      {
        type: "tip",
        text: "Later in this course, you'll learn about CLAUDE.md files, which are a way to give Claude permanent instructions that it reads every time it starts. But for now, just remember: same session equals same conversation, new session equals fresh start (but Claude can still see your files).",
      },
      {
        type: "quiz",
        question: "What happens when Claude Code wants to create a new file on your computer?",
        options: [
          "It creates the file immediately without asking",
          "It asks for your permission before creating the file",
          "It sends the file to Anthropic's servers first",
          "It creates a temporary file that disappears when you close the terminal",
        ],
        correctIndex: 1,
        explanation: "Claude Code always asks for your permission before creating files, running commands, or making changes. This is the permission model -- you stay in control of what happens on your computer at all times.",
      },
      {
        type: "concept",
        title: "Key mental model",
        text: "Claude Code is an incredibly capable assistant that works in the present moment. It reads your project, understands the current state of things, and makes smart decisions based on what it sees right now. Your job is to guide it by describing what you want, reviewing what it proposes, and approving the changes you like.",
      },
    ],
  },
  "2-1": {
    lessonId: "2-1",
    blocks: [
      {
        type: "heading",
        text: "Writing Good Prompts",
      },
      {
        type: "paragraph",
        text: "If Claude Code is the engine, your prompts are the steering wheel. The quality of what Claude builds is directly related to the clarity of what you ask for. The good news? Writing good prompts is a learnable skill, and it's simpler than you think.",
      },
      {
        type: "subheading",
        text: "The \"What + Where + How\" Framework",
      },
      {
        type: "paragraph",
        text: "Every good prompt answers three questions:",
      },
      {
        type: "step",
        number: 1,
        title: "WHAT do you want built?",
        text: "Describe the thing. A landing page? A form? A feature? Be specific about what it should do and look like.",
      },
      {
        type: "step",
        number: 2,
        title: "WHERE should it go?",
        text: "Is this a new project? A new file? A change to an existing page? Tell Claude the context.",
      },
      {
        type: "step",
        number: 3,
        title: "HOW should it work?",
        text: "Any specific requirements? Colors, layout, behavior, technology preferences? The more detail here, the closer the first draft will be to what you want.",
      },
      {
        type: "divider",
      },
      {
        type: "subheading",
        text: "Good Prompts vs. Vague Prompts",
      },
      {
        type: "comparison",
        left: {
          title: "Vague",
          text: "\"Make me a website.\"",
        },
        right: {
          title: "Clear",
          text: "\"Create a single-page landing page for a dog walking business called PawPals. Include a hero section with a headline, a services section with 3 cards, and a contact form. Use a green and white color scheme with a clean, modern design.\"",
        },
      },
      {
        type: "comparison",
        left: {
          title: "Vague",
          text: "\"Add a form.\"",
        },
        right: {
          title: "Clear",
          text: "\"Add a contact form to the bottom of the page with fields for name, email, and message. Include validation that checks for a real email address. When submitted, show a success message. Style it to match the rest of the page.\"",
        },
      },
      {
        type: "comparison",
        left: {
          title: "Vague",
          text: "\"Make it look better.\"",
        },
        right: {
          title: "Clear",
          text: "\"Improve the design by adding more whitespace between sections, making the headline larger, using a consistent font, and adding a subtle shadow to the cards. The overall style should feel clean and professional.\"",
        },
      },
      {
        type: "subheading",
        text: "Try It: Build a Prompt",
      },
      {
        type: "paragraph",
        text: "Use the framework you just learned. Select the best option for each section and watch your prompt take shape:",
      },
      {
        type: "prompt-builder",
        scenario: "You want Claude Code to build a contact page for your freelance design business.",
        sections: [
          {
            label: "What",
            placeholder: "Describe the thing you want built...",
            options: [
              "A contact page with a form for name, email, and project description",
              "A contact page",
              "A page",
            ],
          },
          {
            label: "Where",
            placeholder: "Where should this go in the project?",
            options: [
              "Add it as a new page linked from the main navigation of my existing website",
              "Create it as a brand new project",
              "(not specified)",
            ],
          },
          {
            label: "How",
            placeholder: "Any specific requirements?",
            options: [
              "Use my existing blue and white color scheme, show a success message after submission, and make it mobile-friendly",
              "Make it look good",
              "(not specified)",
            ],
          },
        ],
        examplePrompt: "Create a contact page for my freelance design business website. Add it as a new page linked from the main navigation. Include a form with fields for name, email, and project description. Use my existing blue and white color scheme. Show a success message after the form is submitted. Make sure it looks great on mobile devices.",
      },
      {
        type: "subheading",
        text: "Practice: Rewrite These Prompts",
      },
      {
        type: "paragraph",
        text: "Read each vague prompt below, think about how you'd improve it, then reveal the suggested improvement.",
      },
      {
        type: "exercise",
        prompt: "\"Build me an app.\"",
        reveal: "\"Build a recipe tracking web app where I can add recipes with a title, ingredients list, and cooking instructions. Include a search bar to filter recipes by name. Use a warm, kitchen-themed color palette with orange and cream.\"",
      },
      {
        type: "exercise",
        prompt: "\"Add some buttons.\"",
        reveal: "\"Add a navigation bar at the top of the page with buttons for Home, About, Services, and Contact. Make the buttons change color when hovered. The currently active page button should be underlined.\"",
      },
      {
        type: "exercise",
        prompt: "\"Fix the page.\"",
        reveal: "\"The About page isn't displaying correctly on mobile devices. The text is overflowing off the screen and the images are too large. Make it responsive so it looks good on phones, tablets, and desktops.\"",
      },
      {
        type: "tip",
        text: "You don't need to be perfect. A prompt that's 80% clear is much better than one that's 20% clear. And remember, you can always follow up with more detail. The goal isn't to write one perfect prompt, it's to communicate clearly enough for Claude to get started in the right direction.",
      },
      {
        type: "quiz",
        question: "Which of these is the best prompt for Claude Code?",
        options: [
          "Make me a website",
          "Build something cool with animations",
          "Create a landing page for a pet grooming business called FreshPaws with a hero section, services grid, testimonials, and a booking form. Use a blue and cream color scheme.",
          "Code a web app using React and Node",
        ],
        correctIndex: 2,
        explanation: "The best prompt answers What (landing page for FreshPaws), Where (implied new project), and How (specific sections, color scheme). It gives Claude enough detail to build something close to what you want on the first try.",
      },
    ],
  },
  "2-2": {
    lessonId: "2-2",
    blocks: [
      {
        type: "heading",
        text: "Iterating Like a Pro",
      },
      {
        type: "paragraph",
        text: "Here's a secret that experienced Claude Code users know: you almost never get exactly what you want on the first try. And that's completely fine. The real power of Claude Code isn't in the first prompt. It's in the conversation that follows.",
      },
      {
        type: "concept",
        title: "The Build Loop",
        text: "Prompt, Review, Refine, Repeat. This is the rhythm of working with Claude Code. You describe what you want. Claude builds a first version. You look at it and decide what to change. You tell Claude. Claude updates. Repeat until you're happy. Each cycle takes seconds, not hours.",
      },
      {
        type: "subheading",
        text: "The Art of the Follow-Up Prompt",
      },
      {
        type: "paragraph",
        text: "After Claude builds something, you don't start over. You build on what's there. Here's what a typical iteration sequence looks like for a landing page project:",
      },
      {
        type: "step",
        number: 1,
        title: "Initial build",
        text: "\"Create a landing page for a coffee shop called Morning Brew with a hero section, menu section, and footer.\"",
      },
      {
        type: "step",
        number: 2,
        title: "Layout tweak",
        text: "\"Make the header sticky so it stays at the top when I scroll.\"",
      },
      {
        type: "step",
        number: 3,
        title: "Color change",
        text: "\"Change the color scheme to dark brown and cream. The current colors feel too generic.\"",
      },
      {
        type: "step",
        number: 4,
        title: "Add a feature",
        text: "\"Add a mobile hamburger menu that slides in from the right.\"",
      },
      {
        type: "step",
        number: 5,
        title: "Fix something",
        text: "\"The menu prices aren't aligned properly. Make them all line up on the right side.\"",
      },
      {
        type: "step",
        number: 6,
        title: "Final polish",
        text: "\"Add smooth scroll animations when clicking the navigation links.\"",
      },
      {
        type: "paragraph",
        text: "Notice how each follow-up prompt is focused on one specific change. This is intentional and important.",
      },
      {
        type: "concept",
        title: "The key insight",
        text: "The best Claude Code users don't write one perfect prompt. They start simple and sculpt their project through conversation. Think of it like working with clay. You start with a rough shape and keep refining until it's exactly what you want.",
      },
      {
        type: "subheading",
        text: "Rules for Good Iterations",
      },
      {
        type: "checklist",
        items: [
          "One change at a time: don't ask for five things in one prompt when the changes are complex",
          "Be specific about what you don't like: \"the spacing feels cramped\" is better than \"fix the layout\"",
          "Reference what exists: \"make the heading bigger\" is better than re-describing the whole page",
          "Review before moving on: always check what Claude did before asking for the next change",
          "It's okay to say \"undo that\": if a change didn't work out, just tell Claude to revert it",
        ],
      },
      {
        type: "subheading",
        text: "Try It: Order the Iteration Steps",
      },
      {
        type: "paragraph",
        text: "A client wants a coffee shop landing page. Put these iteration prompts in the best order:",
      },
      {
        type: "drag-rank",
        instruction: "Arrange these prompts in the order you would send them to Claude Code:",
        items: [
          { id: "a", text: "Add smooth scroll animations when clicking navigation links" },
          { id: "b", text: "Create a landing page for a coffee shop with a hero, menu, and footer" },
          { id: "c", text: "Make the header sticky so it stays at the top when I scroll" },
          { id: "d", text: "The menu prices aren't aligned properly. Make them line up on the right side" },
          { id: "e", text: "Change the color scheme to dark brown and cream" },
        ],
        correctOrder: ["b", "c", "e", "d", "a"],
        feedback: "You start with the foundation (overall structure), then adjust layout, then colors, then fix specific details, and polish with animations last. This is the natural iteration flow: big picture first, details last.",
      },
      {
        type: "tip",
        text: "Don't try to describe everything upfront. Start with the big picture, let Claude build a first version, and then refine. You'll be surprised how fast the iteration cycle is. What would take hours of manual coding takes minutes of conversation.",
      },
    ],
  },
  "2-3": {
    lessonId: "2-3",
    blocks: [
      {
        type: "heading",
        text: "Magic Phrases That Work",
      },
      {
        type: "paragraph",
        text: "Over time, the Claude Code community has discovered specific phrases and patterns that consistently produce better results. Think of these as power-ups. You don't always need them, but when you use them, they make a noticeable difference.",
      },
      {
        type: "paragraph",
        text: "Collect these and use them whenever they fit your situation:",
      },
      {
        type: "prompt-card",
        phrase: "Build this step by step",
        explanation: "Tells Claude to break the work into smaller, manageable pieces rather than trying to do everything at once. This leads to fewer errors and more predictable results, especially for larger tasks.",
      },
      {
        type: "prompt-card",
        phrase: "Before you start, tell me your plan",
        explanation: "Claude will outline its approach before writing any code. This lets you catch misunderstandings early and redirect before any work is done. It's like reviewing blueprints before construction begins.",
      },
      {
        type: "prompt-card",
        phrase: "Keep it simple",
        explanation: "Prevents Claude from over-engineering the solution. Without this, Claude sometimes builds more complex solutions than needed. This phrase keeps things lean and straightforward.",
      },
      {
        type: "prompt-card",
        phrase: "Use [specific technology]",
        explanation: "Tells Claude exactly which tools to use. For example: \"Use Tailwind CSS for styling\" or \"Use SQLite for the database.\" Without guidance, Claude chooses for you, which may not match your preferences.",
      },
      {
        type: "prompt-card",
        phrase: "Don't modify [file]",
        explanation: "Protects specific files from being changed. Useful when Claude is making broad changes and you want to make sure it leaves certain files untouched. Example: \"Don't modify the database configuration.\"",
      },
      {
        type: "prompt-card",
        phrase: "Read the codebase first, then...",
        explanation: "Forces Claude to examine your existing code before making any changes. This leads to modifications that fit in with your existing style and structure rather than clashing with it.",
      },
      {
        type: "prompt-card",
        phrase: "Explain what you did",
        explanation: "After Claude finishes a task, this gives you a plain-English summary of every change. Great for learning what happened, especially when Claude made changes across multiple files.",
      },
      {
        type: "divider",
      },
      {
        type: "subheading",
        text: "Combining Phrases",
      },
      {
        type: "paragraph",
        text: "These phrases work even better when combined. Here's an example of a prompt that uses several of them together:",
      },
      {
        type: "code",
        code: "Read the codebase first, then add a dark mode toggle to the site.\nUse Tailwind CSS for the styling.\nBefore you start, tell me your plan.\nKeep it simple - I just want a toggle button in the header\nthat switches between light and dark themes.\nDon't modify the footer component.",
        language: "text",
        label: "A prompt using multiple magic phrases",
      },
      {
        type: "tip",
        text: "You don't need to memorize all of these. Just knowing they exist is half the battle. Come back to this lesson whenever you need a reminder, or check the cheat sheet once you've completed enough lessons.",
      },
    ],
  },
  "2-4": {
    lessonId: "2-4",
    blocks: [
      {
        type: "heading",
        text: "Common Mistakes to Avoid",
      },
      {
        type: "paragraph",
        text: "Everyone makes these mistakes when starting out. Learning to recognize and avoid them will immediately make you more effective with Claude Code.",
      },
      {
        type: "myth-reality",
        myth: "\"Being vague saves time because Claude will figure it out.\"",
        reality: "Vague prompts lead to vague results. You'll spend more time iterating from a bad starting point than you would have spent writing a clear prompt. Five extra seconds of thinking about your prompt saves five minutes of back-and-forth.",
      },
      {
        type: "myth-reality",
        myth: "\"I should ask for everything in one big prompt.\"",
        reality: "Changing too many things at once increases the chance something goes wrong. If five things change and one breaks, it's hard to know which change caused the problem. One focused change per prompt is safer and faster.",
      },
      {
        type: "myth-reality",
        myth: "\"Claude always gets it right, so I don't need to review the changes.\"",
        reality: "Claude is extremely capable, but it's not perfect. Always look at what was changed before moving on. A quick review catches issues early when they're easy to fix, instead of later when they've become buried under more changes.",
      },
      {
        type: "myth-reality",
        myth: "\"Claude knows about my project automatically.\"",
        reality: "Claude reads files in your current folder, but it doesn't have magical knowledge of your business logic, your design preferences, or your deployment setup. Give it context. Tell it what the project is for, who the audience is, and what matters to you.",
      },
      {
        type: "myth-reality",
        myth: "\"Claude remembers everything from yesterday's session.\"",
        reality: "Each new session starts fresh. Claude can read your project files, but it doesn't remember past conversations. If you had an important discussion or made decisions in a previous session, either write them in a CLAUDE.md file (Level 4) or briefly restate them.",
      },
      {
        type: "myth-reality",
        myth: "\"If it's not working, I should just keep trying the same thing.\"",
        reality: "If a prompt isn't producing what you want after two or three attempts, change your approach. Try describing the problem differently, break it into smaller pieces, or ask Claude to explain its understanding of what you're asking for.",
      },
      {
        type: "tip",
        text: "The most productive Claude Code users share two traits: they write clear, specific prompts, and they review Claude's work before moving to the next step. Master those two habits and you'll avoid the vast majority of common pitfalls.",
      },
      {
        type: "quiz",
        question: "You asked Claude to make 5 different changes in one prompt and now the page is broken. What is the best next step?",
        options: [
          "Ask Claude to undo everything and start the whole project over from scratch",
          "Ask Claude to undo the last changes, then make each change one at a time in separate prompts",
          "Keep adding more changes and hope it fixes itself",
          "Close the terminal and pretend it never happened",
        ],
        correctIndex: 1,
        explanation: "Making one focused change per prompt is safer and faster. When you change too many things at once and something breaks, it is hard to know which change caused the problem. Undo, then iterate one change at a time.",
      },
    ],
  },
  "3-1": {
    lessonId: "3-1",
    blocks: [
      {
        type: "heading",
        text: "Project 1: Personal Portfolio Site",
      },
      {
        type: "paragraph",
        text: "Time to build something real. In this lesson, you'll create a personal portfolio website using nothing but conversation with Claude Code. Follow along with the prompt sequence below, or adapt it to make it your own.",
      },
      {
        type: "subheading",
        text: "Setting Up",
      },
      {
        type: "code",
        code: "mkdir portfolio\ncd portfolio\nclaude",
        language: "bash",
        label: "Create your project folder and start Claude Code",
      },
      {
        type: "subheading",
        text: "The Build Sequence",
      },
      {
        type: "step",
        number: 1,
        title: "Create the project foundation",
        text: "Start with this prompt to establish the base:",
      },
      {
        type: "code",
        code: "Create a personal portfolio website using HTML, CSS, and JavaScript.\nStart with a clean, modern design using a dark navy (#0F172A) and\nwhite color scheme. Include a navigation bar at the top with smooth\nscroll links to each section.",
        language: "text",
        label: "Prompt 1: Foundation",
      },
      {
        type: "step",
        number: 2,
        title: "Add the hero section",
        text: "Once the base is built, add the most important section:",
      },
      {
        type: "code",
        code: "Add a hero section with my name (use a placeholder), a job title\nlike \"Creative Developer & Designer\", and a short bio paragraph.\nMake the name large and bold. Add a subtle background pattern\nor gradient to make it visually interesting.",
        language: "text",
        label: "Prompt 2: Hero Section",
      },
      {
        type: "step",
        number: 3,
        title: "Add the projects section",
        text: "Now showcase some work:",
      },
      {
        type: "code",
        code: "Create a projects section showing 3 project cards. Each card should\nhave a placeholder image area, a project title, a short description,\nand a \"View Project\" button. The cards should be arranged in a\nresponsive grid that stacks on mobile.",
        language: "text",
        label: "Prompt 3: Projects",
      },
      {
        type: "step",
        number: 4,
        title: "Add the contact section",
        text: "Give people a way to reach you:",
      },
      {
        type: "code",
        code: "Add a contact section at the bottom with a simple message like\n\"Let's work together\" and links to email and LinkedIn (use\nplaceholder links). Style it to stand out from the rest of the page.",
        language: "text",
        label: "Prompt 4: Contact",
      },
      {
        type: "step",
        number: 5,
        title: "Make it responsive and polished",
        text: "The final touches:",
      },
      {
        type: "code",
        code: "Make the entire site fully responsive. Add smooth scroll behavior\nwhen clicking navigation links. Add a subtle hover effect on the\nproject cards. Make sure everything looks great on mobile.",
        language: "text",
        label: "Prompt 5: Polish",
      },
      {
        type: "concept",
        title: "Look at what you just did",
        text: "Five prompts. Five plain-English sentences. And you have a personal portfolio website. No coding knowledge required. No hours spent learning HTML and CSS. Just clear descriptions of what you wanted, and Claude built it.",
      },
      {
        type: "paragraph",
        text: "Here is what the very first prompt in that sequence looks like in action:",
      },
      {
        type: "claude-conversation",
        title: "Claude Code",
        steps: [
          {
            role: "user",
            message: "Create a personal portfolio website using HTML, CSS, and JavaScript. Start with a clean, modern design using a dark navy and white color scheme. Include a navigation bar at the top with smooth scroll links.",
            suggested: true,
          },
          {
            role: "claude",
            message: "I'll create a beautiful portfolio site for you with a dark navy theme and smooth navigation. Let me set up the project.",
            typing: true,
          },
          {
            role: "permission",
            action: "Create file: index.html",
            detail: "Portfolio page with nav, hero, projects, and contact sections",
          },
          {
            role: "file-creation",
            filename: "index.html",
            lines: [
              "<!DOCTYPE html>",
              "<html lang=\"en\">",
              "<head>",
              "  <meta charset=\"UTF-8\">",
              "  <meta name=\"viewport\" content=\"width=device-width\">",
              "  <title>My Portfolio</title>",
              "  <link rel=\"stylesheet\" href=\"style.css\">",
              "</head>",
              "<body>",
              "  <nav class=\"navbar\">",
              "    <a href=\"#hero\">Home</a>",
              "    <a href=\"#projects\">Projects</a>",
              "    <a href=\"#contact\">Contact</a>",
              "  </nav>",
              "  <section id=\"hero\">...</section>",
              "  <section id=\"projects\">...</section>",
              "  <section id=\"contact\">...</section>",
              "</body>",
              "</html>",
            ],
          },
          {
            role: "permission",
            action: "Create file: style.css",
            detail: "Dark navy theme with modern typography and smooth animations",
          },
          {
            role: "claude",
            message: "Your portfolio is ready! I created index.html with the structure and style.css with the dark navy theme, smooth scrolling, and responsive layout. Open index.html in your browser to see it.",
            typing: true,
          },
        ],
      },
      {
        type: "paragraph",
        text: "Open the HTML file in your browser to see your portfolio. Not happy with something? Just tell Claude what to change. The color is off? The spacing is wrong? A section needs more content? Just describe the change and watch it happen.",
      },
      {
        type: "tip",
        text: "Want to personalize it further? Replace the placeholder text with your real information. Ask Claude to change the color scheme. Add more project cards. Add a blog section. The portfolio is your canvas, and Claude is your brush.",
      },
    ],
  },
  "3-2": {
    lessonId: "3-2",
    blocks: [
      {
        type: "heading",
        text: "Project 2: Simple Business Landing Page",
      },
      {
        type: "paragraph",
        text: "Now let's build something that could genuinely be used in the real world: a landing page for a local business. This project teaches you how to structure a professional page and how to customize Claude's output for a specific brand.",
      },
      {
        type: "subheading",
        text: "The Scenario",
      },
      {
        type: "paragraph",
        text: "You're building a landing page for a fictional yoga studio called \"Still Waters Yoga.\" Feel free to swap in your own business or idea as you follow along.",
      },
      {
        type: "code",
        code: "mkdir yoga-landing\ncd yoga-landing\nclaude",
        language: "bash",
        label: "Set up the project",
      },
      {
        type: "step",
        number: 1,
        title: "Hero section with a strong headline",
        text: "",
      },
      {
        type: "code",
        code: "Create a beautiful landing page for a yoga studio called\n\"Still Waters Yoga\". Start with a full-width hero section\nwith the headline \"Find Your Calm\" and a subheading\n\"Yoga classes for every body, every level, every day.\"\nUse a calming color palette with sage green, warm white,\nand soft gold accents.",
        language: "text",
        label: "Prompt 1: Hero",
      },
      {
        type: "step",
        number: 2,
        title: "Features and services section",
        text: "",
      },
      {
        type: "code",
        code: "Add a services section with 3 cards:\n1. \"Beginner Friendly\" - welcoming classes for newcomers\n2. \"Advanced Flow\" - challenging sessions for experienced yogis\n3. \"Private Sessions\" - one-on-one instruction\nEach card should have an icon area, title, short description,\nand a \"Learn More\" link.",
        language: "text",
        label: "Prompt 2: Services",
      },
      {
        type: "step",
        number: 3,
        title: "Social proof with testimonials",
        text: "",
      },
      {
        type: "code",
        code: "Add a testimonials section with 3 quotes from fictional students.\nInclude their name and how long they've been practicing.\nStyle the quotes with large quotation marks and a clean card layout.",
        language: "text",
        label: "Prompt 3: Testimonials",
      },
      {
        type: "step",
        number: 4,
        title: "Call to action and footer",
        text: "",
      },
      {
        type: "code",
        code: "Add a call-to-action section with the text \"Your first class is free\"\nand a large \"Book Now\" button. Below that, add a footer with the\nstudio address, phone number, hours, and social media links.\nMake the footer dark with light text.",
        language: "text",
        label: "Prompt 4: CTA and Footer",
      },
      {
        type: "concept",
        title: "Customization is where the magic happens",
        text: "The prompts above are a template. The real skill is adapting them to your needs. Have a bakery? Change the colors to warm browns and pinks. Running a tech startup? Go sleek with blues and grays. The structure stays the same, but the details make it yours.",
      },
      {
        type: "paragraph",
        text: "Want to share this with the world? Look into free hosting services like Vercel or Netlify. You can deploy a static site in minutes, and Claude Code can even help you through that process.",
      },
      {
        type: "tip",
        text: "When building for a real business, gather all the text content (business name, descriptions, contact info) before you start prompting. Having everything ready means you can give Claude complete, accurate information from the beginning.",
      },
    ],
  },
  "3-3": {
    lessonId: "3-3",
    blocks: [
      {
        type: "heading",
        text: "Project 3: Interactive Quiz App",
      },
      {
        type: "paragraph",
        text: "So far we've built pages that look good. Now let's build something that thinks. A quiz app has logic: it tracks answers, keeps score, and shows results. This project proves that Claude Code can build real applications, not just pretty pages.",
      },
      {
        type: "code",
        code: "mkdir quiz-app\ncd quiz-app\nclaude",
        language: "bash",
        label: "Set up the project",
      },
      {
        type: "step",
        number: 1,
        title: "Create the quiz structure",
        text: "",
      },
      {
        type: "code",
        code: "Build an interactive quiz app using HTML, CSS, and JavaScript.\nThe quiz should have 5 multiple-choice questions about general\nknowledge. Each question has 4 options and one correct answer.\nShow one question at a time with a progress bar at the top.\nUse a clean, modern design with a blue and white color scheme.",
        language: "text",
        label: "Prompt 1: Base quiz",
      },
      {
        type: "step",
        number: 2,
        title: "Add interactivity",
        text: "",
      },
      {
        type: "code",
        code: "When the user selects an answer, highlight it green if correct\nor red if wrong, and briefly show the correct answer before\nmoving to the next question. Add a smooth transition between\nquestions.",
        language: "text",
        label: "Prompt 2: Interactivity",
      },
      {
        type: "step",
        number: 3,
        title: "Score tracking and results",
        text: "",
      },
      {
        type: "code",
        code: "At the end of the quiz, show a results screen with the total\nscore (e.g., \"You got 4 out of 5\"), a percentage, and a\nmessage that changes based on the score (e.g., great job,\ngood effort, try again). Add a \"Retake Quiz\" button that\nresets everything.",
        language: "text",
        label: "Prompt 3: Results",
      },
      {
        type: "step",
        number: 4,
        title: "Polish and extras",
        text: "",
      },
      {
        type: "code",
        code: "Add a timer that shows how long the quiz takes. Display it\non the results screen. Also add a start screen with a\n\"Begin Quiz\" button so it doesn't start immediately.\nMake the whole thing mobile-friendly.",
        language: "text",
        label: "Prompt 4: Polish",
      },
      {
        type: "concept",
        title: "This is what makes Claude Code powerful",
        text: "You just built an application with real logic: conditional rendering, state management, score calculation, timers, and user interaction. None of that required you to understand JavaScript. You described the behavior you wanted, and Claude handled the implementation.",
      },
      {
        type: "paragraph",
        text: "Want to customize the quiz? Ask Claude to change the questions to any topic you want. Make it about your business, your hobby, or use it as a study tool. The logic stays the same; only the content changes.",
      },
      {
        type: "tip",
        text: "This is a great project to practice iteration. Try asking Claude to add features: a high score tracker, different difficulty levels, or categories to choose from. See how far you can take it through conversation alone.",
      },
    ],
  },
  "3-4": {
    lessonId: "3-4",
    blocks: [
      {
        type: "heading",
        text: "Working With Existing Projects",
      },
      {
        type: "paragraph",
        text: "So far, we've started from scratch. But one of Claude Code's most powerful capabilities is working with code that already exists. Maybe you downloaded a template, inherited a project from someone else, or built something a few weeks ago and want to improve it.",
      },
      {
        type: "subheading",
        text: "How to Point Claude Code at an Existing Project",
      },
      {
        type: "paragraph",
        text: "The process is simple: navigate to the project's folder in your terminal, then start Claude Code. Claude will automatically see all the files.",
      },
      {
        type: "code",
        code: "cd path/to/your/existing/project\nclaude",
        language: "bash",
        label: "Open Claude Code in an existing project",
      },
      {
        type: "subheading",
        text: "Useful First Prompts for Existing Projects",
      },
      {
        type: "prompt-card",
        phrase: "Read through this codebase and give me a summary",
        explanation: "Claude will examine your project files and give you a plain-English overview of what the project does, what technologies it uses, and how it's structured. Great for understanding code you didn't write.",
      },
      {
        type: "prompt-card",
        phrase: "Find and fix any bugs",
        explanation: "Claude will scan for common issues, potential errors, and anti-patterns. It's like getting a free code review from an expert.",
      },
      {
        type: "prompt-card",
        phrase: "Add a dark mode toggle to this project",
        explanation: "Claude will study the existing styles and structure, then add dark mode in a way that fits with what's already there, rather than creating something that clashes.",
      },
      {
        type: "prompt-card",
        phrase: "Update the design to look more modern",
        explanation: "Claude will analyze the current styling and suggest improvements while keeping the existing structure intact. Add specifics like color preferences if you have them.",
      },
      {
        type: "concept",
        title: "Claude gets smarter with context",
        text: "The more files Claude can see, the better its understanding of your project. It notices patterns, follows existing conventions, and makes changes that feel like they belong. This is why starting Claude from the right folder matters: it needs to see the whole picture to do its best work.",
      },
      {
        type: "paragraph",
        text: "Here's a particularly powerful pattern: before asking Claude to make changes, ask it to explain the project first. This serves two purposes. First, you learn about the codebase. Second, Claude's explanation confirms it understands the project correctly before it starts modifying things.",
      },
      {
        type: "code",
        code: "Read through this project and explain the file structure,\nthe main features, and how the different parts connect\nto each other. Then I'll ask you to make some changes.",
        language: "text",
        label: "Understand before you modify",
      },
      {
        type: "tip",
        text: "If you're working on someone else's code or an open-source project, always ask Claude for a summary first. Understanding the codebase before making changes prevents you from accidentally breaking things or working against the project's existing patterns.",
      },
    ],
  },
  "3-5": {
    lessonId: "3-5",
    blocks: [
      {
        type: "heading",
        text: "When Things Go Wrong",
      },
      {
        type: "paragraph",
        text: "Errors happen. Even the most experienced developers deal with broken code every day. The difference isn't avoiding errors, it's knowing what to do when they appear. With Claude Code, handling errors is remarkably straightforward.",
      },
      {
        type: "subheading",
        text: "The Error Handling Playbook",
      },
      {
        type: "step",
        number: 1,
        title: "Copy and paste the error",
        text: "When you see an error message, just copy the whole thing and paste it to Claude. You don't need to understand it. Claude does.",
      },
      {
        type: "code",
        code: "I'm getting this error: [paste the entire error message here]\nCan you fix it?",
        language: "text",
        label: "The simplest debugging prompt",
      },
      {
        type: "step",
        number: 2,
        title: "Describe the unexpected behavior",
        text: "Sometimes there's no error message; things just aren't working right. Describe what you expected vs. what happened.",
      },
      {
        type: "code",
        code: "The contact form should show a success message after submitting,\nbut nothing happens when I click the button. The page just\nrefreshes. Can you investigate and fix it?",
        language: "text",
        label: "Describing a bug without an error message",
      },
      {
        type: "step",
        number: 3,
        title: "Ask Claude to undo changes",
        text: "If a set of changes made things worse, you can ask Claude to revert.",
      },
      {
        type: "code",
        code: "The last changes you made broke the navigation. Undo those\nchanges and let's try a different approach.",
        language: "text",
        label: "Rolling back changes",
      },
      {
        type: "subheading",
        text: "See It In Action: Debugging a Bug",
      },
      {
        type: "paragraph",
        text: "Watch how a typical debugging conversation flows in Claude Code:",
      },
      {
        type: "claude-conversation",
        title: "Claude Code",
        steps: [
          {
            role: "user",
            message: "The contact form should show a success message after submitting, but nothing happens when I click the button. The page just refreshes. Can you investigate and fix it?",
            suggested: true,
          },
          {
            role: "claude",
            message: "I'll investigate the contact form issue. Let me look at the form's HTML and JavaScript to find the problem.",
            typing: true,
          },
          {
            role: "claude",
            message: "Found it! The form is missing an event.preventDefault() call, so the browser is doing a default form submission (which reloads the page) instead of running your JavaScript handler. I'll fix this now.",
            typing: true,
          },
          {
            role: "permission",
            action: "Edit file: app.js",
            detail: "Adding preventDefault() to the form submit handler",
          },
          {
            role: "claude",
            message: "Fixed! The form submit handler now prevents the default browser behavior and shows your success message instead. Try submitting the form again.",
            typing: true,
          },
        ],
      },
      {
        type: "paragraph",
        text: "Notice the pattern: you described the problem, Claude investigated, explained what it found, and fixed it. You didn't need to understand the technical details of \"event.preventDefault()\" -- Claude handled that part.",
      },
      {
        type: "divider",
      },
      {
        type: "subheading",
        text: "Your Safety Net: Git Save Points",
      },
      {
        type: "paragraph",
        text: "Git is a tool that creates \"save points\" for your project, like saving your game before a boss fight. If something goes wrong, you can always go back to your last save. Here are the three commands that form your safety net:",
      },
      {
        type: "code",
        code: "git init                    # Set up saving (do this once per project)\ngit add .                   # Stage all current files\ngit commit -m \"save point\"  # Create a save point with a label",
        language: "bash",
        label: "Creating a save point",
      },
      {
        type: "paragraph",
        text: "Do this before starting any major changes. If things go sideways, you can always get back to this save point.",
      },
      {
        type: "subheading",
        text: "Troubleshooting Decision Tree",
      },
      {
        type: "flowchart",
        nodes: [
          {
            id: "start",
            text: "Something isn't working",
            yes: "error-msg",
            no: "no-error",
          },
          {
            id: "error-msg",
            text: "Is there an error message?",
            yes: "paste-error",
            no: "no-error",
          },
          {
            id: "paste-error",
            text: "Copy the error and paste it to Claude with \"Can you fix this error?\"",
            next: "fixed",
          },
          {
            id: "no-error",
            text: "Describe what you expected vs what happened. Ask Claude to investigate.",
            next: "fixed",
          },
          {
            id: "fixed",
            text: "Did Claude's fix work?",
            yes: "done",
            no: "try-again",
          },
          {
            id: "try-again",
            text: "Tell Claude the fix didn't work. Provide more details. Try a different approach or ask Claude to start that feature over.",
            next: "fixed",
          },
          {
            id: "done",
            text: "Create a save point with git commit, then continue building.",
            next: "",
          },
        ],
      },
      {
        type: "tip",
        text: "The #1 rule when things go wrong: don't panic and don't start over. Errors are a normal part of building software. Claude Code is excellent at diagnosing and fixing problems. Just describe what's happening and let Claude handle it.",
      },
    ],
  },
  "4-1": {
    lessonId: "4-1",
    blocks: [
      {
        type: "heading",
        text: "Using CLAUDE.md Files",
      },
      {
        type: "paragraph",
        text: "Remember how Claude Code forgets your conversations between sessions? CLAUDE.md files solve that problem. They're instructions that Claude reads automatically every time it starts in your project folder. Think of it as onboarding notes for a new team member, except this team member reads them perfectly every single time.",
      },
      {
        type: "subheading",
        text: "What Is a CLAUDE.md File?",
      },
      {
        type: "paragraph",
        text: "It's a simple text file named CLAUDE.md that you place in the root of your project folder. When Claude Code starts, it looks for this file and reads it before doing anything else. Whatever you write in there becomes part of Claude's context for every conversation in that project.",
      },
      {
        type: "subheading",
        text: "What to Put in Your CLAUDE.md",
      },
      {
        type: "checklist",
        items: [
          "A brief description of what the project is and who it's for",
          "The tech stack being used (e.g., Next.js, Tailwind CSS, SQLite)",
          "Coding style preferences (e.g., use functional components, prefer arrow functions)",
          "Things to avoid (e.g., don't use jQuery, don't add inline styles)",
          "Important file locations (e.g., main layout is in src/app/layout.tsx)",
          "Any business logic rules (e.g., prices must always show two decimal places)",
        ],
      },
      {
        type: "subheading",
        text: "A Template You Can Use",
      },
      {
        type: "code",
        code: "# Project: [Your Project Name]\n\n## Overview\n[One or two sentences describing what this project does and who it's for.]\n\n## Tech Stack\n- Frontend: [e.g., React, Next.js]\n- Styling: [e.g., Tailwind CSS]\n- Backend: [e.g., Node.js, Express] (if applicable)\n- Database: [e.g., SQLite, PostgreSQL] (if applicable)\n\n## Coding Conventions\n- [e.g., Use TypeScript strict mode]\n- [e.g., Use functional components with hooks, not class components]\n- [e.g., Use named exports, not default exports]\n\n## Important Notes\n- [e.g., All API routes require authentication]\n- [e.g., The /admin routes are only accessible to admin users]\n- [e.g., Don't modify the database schema without discussion]\n\n## File Structure\n- src/app/ - Page routes and layouts\n- src/components/ - Reusable UI components\n- src/lib/ - Utility functions and helpers",
        language: "markdown",
        label: "CLAUDE.md template",
      },
      {
        type: "concept",
        title: "Why this matters",
        text: "Without a CLAUDE.md file, you have to re-explain your project's context every time you start a new session. With one, Claude already knows the rules, the stack, the structure, and your preferences. It's the difference between working with a stranger every day and working with a colleague who knows the project inside out.",
      },
      {
        type: "paragraph",
        text: "Here's a pro move: you can even ask Claude Code to create the CLAUDE.md file for you. Start a session in your project and try:",
      },
      {
        type: "code",
        code: "Read through this entire codebase and create a CLAUDE.md file\nthat documents the project overview, tech stack, file structure,\nand any conventions you notice in the existing code.",
        language: "text",
        label: "Let Claude write your CLAUDE.md",
      },
      {
        type: "tip",
        text: "Start simple. Your first CLAUDE.md doesn't need to be comprehensive. Even just listing the tech stack and one or two preferences makes a noticeable difference. You can always add more as you learn what's useful.",
      },
    ],
  },
  "4-2": {
    lessonId: "4-2",
    blocks: [
      {
        type: "heading",
        text: "Multi-File Projects",
      },
      {
        type: "paragraph",
        text: "As your projects grow beyond a single HTML file, they'll involve multiple files that work together: pages, components, stylesheets, configuration files, and more. Understanding how Claude Code handles these multi-file projects helps you work with it more effectively.",
      },
      {
        type: "subheading",
        text: "How Claude Sees Your Project",
      },
      {
        type: "paragraph",
        text: "When you start Claude Code in a project folder, it can see the entire file structure. It knows which files exist, how they're organized, and how they relate to each other. When you ask for a change, Claude decides which files need to be modified and makes coordinated changes across all of them.",
      },
      {
        type: "concept",
        title: "Think of it like a film editor",
        text: "A film editor doesn't just cut one clip. They work across the entire timeline, adjusting scenes, transitions, and audio to make everything flow together. Similarly, Claude Code works across your entire project, making changes in multiple files that all fit together cohesively.",
      },
      {
        type: "subheading",
        text: "Key Concepts for Multi-File Projects",
      },
      {
        type: "step",
        number: 1,
        title: "Components: Reusable building blocks",
        text: "In modern web development, you break your interface into reusable pieces called components. A button, a navigation bar, a card, each is a component that can be used in multiple places.",
      },
      {
        type: "code",
        code: "Create a reusable Button component that accepts a label,\na color variant (primary, secondary, danger), and an\nonClick action. Then use it in the header and the\ncontact form.",
        language: "text",
        label: "Creating a reusable component",
      },
      {
        type: "step",
        number: 2,
        title: "Pages: Different screens in your app",
        text: "Most applications have multiple pages: a home page, an about page, a contact page. Each page is typically its own file.",
      },
      {
        type: "code",
        code: "Add a new page at /about that includes a team section\nwith 3 team member cards and our company story.\nMake sure the navigation bar links to this new page.",
        language: "text",
        label: "Adding a new page",
      },
      {
        type: "step",
        number: 3,
        title: "When to explain vs. when to let Claude figure it out",
        text: "For well-structured projects, Claude can usually figure out where new files should go. But if your project has an unusual structure, or you have a preference, just tell Claude explicitly.",
      },
      {
        type: "comparison",
        left: {
          title: "Let Claude decide",
          text: "\"Add a user profile page to the project.\" Claude will look at your existing file structure and put it in the logical place.",
        },
        right: {
          title: "Be explicit",
          text: "\"Create a new page at src/app/profile/page.tsx for the user profile. It should follow the same layout pattern as the other pages.\" You control exactly where it goes.",
        },
      },
      {
        type: "tip",
        text: "For projects with more than 10 files, it helps to ask Claude to read the codebase before making changes. This ensures it understands the full picture before modifying any part of it.",
      },
    ],
  },
  "4-3": {
    lessonId: "4-3",
    blocks: [
      {
        type: "heading",
        text: "Adding APIs and Data",
      },
      {
        type: "paragraph",
        text: "So far, everything we've built has been self-contained. The data is hardcoded right into the page. But real applications often need to pull data from external sources: weather information, news feeds, user data from a database. That's where APIs come in.",
      },
      {
        type: "concept",
        title: "APIs explained simply",
        text: "An API (Application Programming Interface) is like a waiter at a restaurant. You (the customer) send an order (a request) to the kitchen (a server somewhere on the internet). The kitchen prepares your food (processes the data) and the waiter brings it back to you (the response). You don't need to know how the kitchen works. You just need to know how to place your order.",
      },
      {
        type: "subheading",
        text: "Simple API Examples",
      },
      {
        type: "paragraph",
        text: "Here are some things you can add to projects using free APIs:",
      },
      {
        type: "step",
        number: 1,
        title: "Display a random quote",
        text: "",
      },
      {
        type: "code",
        code: "Add a section to the page that displays a random inspirational\nquote. Fetch it from a free quote API. Show the quote text\nand the author. Include a button to load a new random quote.",
        language: "text",
        label: "Adding a random quote feature",
      },
      {
        type: "step",
        number: 2,
        title: "Show placeholder images",
        text: "",
      },
      {
        type: "code",
        code: "Replace the placeholder boxes in the project cards with\nreal images from the Unsplash API (use their free source\nURL format). Each card should show a different image\nrelated to technology.",
        language: "text",
        label: "Adding real images",
      },
      {
        type: "step",
        number: 3,
        title: "Weather widget",
        text: "",
      },
      {
        type: "code",
        code: "Add a weather widget to the sidebar that shows the current\ntemperature and conditions. Use the Open-Meteo API (it's\nfree and doesn't require an API key). Default to New York\nbut let the user type in a city name.",
        language: "text",
        label: "Adding weather data",
      },
      {
        type: "subheading",
        text: "Important: Keeping API Keys Secret",
      },
      {
        type: "paragraph",
        text: "Some APIs require an API key, which is like a password that identifies your application. These keys must be kept secret. Never put them directly in your code where anyone can see them.",
      },
      {
        type: "code",
        code: "# Create a file called .env.local (the dot at the start is important)\n# Put your API key in there:\nWEATHER_API_KEY=your_secret_key_here\n\n# In your code, access it using:\n# process.env.WEATHER_API_KEY",
        language: "bash",
        label: "Storing API keys safely",
      },
      {
        type: "concept",
        title: "The .env file is your vault",
        text: "Environment variables (stored in .env files) are like a safe in your project. They hold sensitive information like API keys, passwords, and secret tokens. Your code can read them, but they never get published to the internet or shared in your source code. Claude Code knows about this pattern and will use it automatically when handling API keys.",
      },
      {
        type: "tip",
        text: "Start with APIs that don't require keys, like Open-Meteo for weather or JSONPlaceholder for dummy data. This lets you learn the pattern without worrying about security. Once you're comfortable, you can move to APIs that require authentication.",
      },
    ],
  },
  "4-4": {
    lessonId: "4-4",
    blocks: [
      {
        type: "heading",
        text: "Command Line Shortcuts and Flags",
      },
      {
        type: "paragraph",
        text: "Now that you're comfortable with Claude Code, it's time to learn some shortcuts that will make your workflow faster. These are flags and commands you can use when starting Claude Code or during a session.",
      },
      {
        type: "subheading",
        text: "Starting Claude Code",
      },
      {
        type: "code",
        code: "claude                           # Start a fresh session\nclaude \"your prompt here\"        # Start with a specific request\nclaude --continue                # Resume your last session",
        language: "bash",
        label: "Ways to start Claude Code",
      },
      {
        type: "paragraph",
        text: "The --continue flag is particularly useful. Remember how we said each session starts fresh? This flag picks up where you left off, preserving the conversation history from your last session.",
      },
      {
        type: "paragraph",
        text: "Try each startup method in this interactive terminal:",
      },
      {
        type: "interactive-terminal",
        title: "Terminal",
        commands: [
          {
            command: "claude",
            output: ["Starting Claude Code...", "", "Welcome! How can I help you today?"],
            delay: 100,
          },
          {
            command: "claude --continue",
            output: ["Resuming last session...", "", "Welcome back! We were working on the landing page."],
            delay: 100,
          },
          {
            command: "claude \"Read this project and give me a summary\"",
            output: [
              "Starting Claude Code with initial prompt...",
              "",
              "Reading project files...",
              "This is a Next.js project with 12 components,",
              "3 pages, and a Tailwind CSS configuration...",
            ],
            delay: 100,
          },
        ],
      },
      {
        type: "subheading",
        text: "Slash Commands Inside a Session",
      },
      {
        type: "paragraph",
        text: "While you're in a Claude Code session, you can use these special commands that start with a forward slash:",
      },
      {
        type: "prompt-card",
        phrase: "/help",
        explanation: "Shows a list of available commands and options. Your go-to when you're not sure what's possible.",
      },
      {
        type: "prompt-card",
        phrase: "/clear",
        explanation: "Clears the conversation history in your current session. Useful when the conversation has gotten long and you want a fresh start without closing Claude Code.",
      },
      {
        type: "prompt-card",
        phrase: "/compact",
        explanation: "Compresses the conversation history to save space while keeping the important context. Use this during long sessions when Claude seems to be losing track of earlier context.",
      },
      {
        type: "subheading",
        text: "Quick Reference Cheat Sheet",
      },
      {
        type: "code",
        code: "# Starting sessions\nclaude                    # New session\nclaude --continue         # Resume last session\nclaude \"do something\"     # Start with a prompt\n\n# Inside a session\n/help                     # Show help\n/clear                    # Clear conversation\n/compact                  # Compress history\n\n# Useful patterns\nclaude \"Read this project and give me a summary\"\nclaude --continue         # Continue where you left off",
        language: "bash",
        label: "Claude Code cheat sheet",
      },
      {
        type: "tip",
        text: "The most important shortcut is --continue. Get in the habit of using it when you come back to a project you were working on earlier. It saves you from re-explaining what you were doing and what you want next.",
      },
    ],
  },
  "4-5": {
    lessonId: "4-5",
    blocks: [
      {
        type: "heading",
        text: "Planning Before Building",
      },
      {
        type: "paragraph",
        text: "For small projects, jumping straight into building works great. But as your ambitions grow, planning first becomes essential. This lesson teaches you the planning pattern that experienced Claude Code users swear by.",
      },
      {
        type: "subheading",
        text: "The Planning Prompt",
      },
      {
        type: "paragraph",
        text: "Before you ask Claude to write a single line of code, ask it to plan. Here's the template:",
      },
      {
        type: "code",
        code: "I want to build [describe your project]. Before writing any code,\ncreate a detailed plan that includes:\n\n1. The tech stack you recommend and why\n2. The file structure for the project\n3. A list of all key features\n4. The order you would build things in\n5. Any potential challenges to watch out for\n\nDon't write any code yet. Just give me the plan.",
        language: "text",
        label: "The planning prompt template",
      },
      {
        type: "subheading",
        text: "Why Planning Matters",
      },
      {
        type: "comparison",
        left: {
          title: "Without Planning",
          text: "You start building immediately. Halfway through, you realize the structure doesn't support a feature you need. You have to restructure, which means rewriting code. Changes cascade across files. Frustration builds.",
        },
        right: {
          title: "With Planning",
          text: "You review the plan before any code is written. You spot issues in the blueprint, not the building. Adjustments are free because nothing has been built yet. When building starts, Claude follows a clear roadmap.",
        },
      },
      {
        type: "subheading",
        text: "The Full Workflow",
      },
      {
        type: "step",
        number: 1,
        title: "Ask for the plan",
        text: "Use the planning prompt above. Be as detailed as you can about what you want to build.",
      },
      {
        type: "step",
        number: 2,
        title: "Review and adjust",
        text: "Read through Claude's plan. Ask questions. Request changes. \"I don't want to use a database, can we use localStorage instead?\" or \"Add user authentication to the feature list.\"",
      },
      {
        type: "step",
        number: 3,
        title: "Approve and build",
        text: "Once you're happy with the plan, tell Claude to start building. It will follow the plan it created.",
      },
      {
        type: "code",
        code: "The plan looks great. Now build it step by step, starting\nwith the project setup and basic structure. After each major\nstep, briefly tell me what you did before moving to the next.",
        language: "text",
        label: "Kicking off the build",
      },
      {
        type: "concept",
        title: "Think of it this way",
        text: "You wouldn't build a house without blueprints. The bigger the project, the more important the plan. For a simple single-page site, you can skip planning. For anything with multiple pages, user interactions, or backend logic, spend two minutes on a plan and save twenty minutes of rework.",
      },
      {
        type: "tip",
        text: "Save your plans. Ask Claude to include the plan at the top of your CLAUDE.md file. This way, future sessions can reference the original plan and stay aligned with your vision even as the project evolves.",
      },
    ],
  },
  "5-1": {
    lessonId: "5-1",
    blocks: [
      {
        type: "heading",
        text: "Automated Workflows",
      },
      {
        type: "paragraph",
        text: "By now you're comfortable giving Claude Code individual tasks. Now let's learn how to chain multiple tasks together into automated workflows. This is where Claude Code starts feeling less like a tool and more like a team member.",
      },
      {
        type: "subheading",
        text: "Multi-Step Instructions",
      },
      {
        type: "paragraph",
        text: "You can give Claude Code a sequence of tasks in a single prompt and it will execute them in order:",
      },
      {
        type: "code",
        code: "Do the following in order:\n1. Run the test suite\n2. Fix any failing tests\n3. Run the tests again to make sure they pass\n4. Commit all the changes with a descriptive message",
        language: "text",
        label: "A multi-step workflow prompt",
      },
      {
        type: "paragraph",
        text: "Claude Code handles each step, moves to the next, and reports back on the full sequence. If something fails along the way, it adjusts its approach automatically.",
      },
      {
        type: "subheading",
        text: "Common Automated Workflows",
      },
      {
        type: "prompt-card",
        phrase: "Code review and fix",
        explanation: "\"Review all the code in this project for bugs, security issues, and best practice violations. Fix what you find and explain each change.\" Claude scans, identifies issues, fixes them, and gives you a report.",
      },
      {
        type: "prompt-card",
        phrase: "Build and test",
        explanation: "\"Build the new feature for [description], write tests for it, run the tests, and fix anything that fails.\" Claude handles the entire development cycle in one go.",
      },
      {
        type: "prompt-card",
        phrase: "Refactor and clean",
        explanation: "\"Refactor this codebase to improve readability. Remove unused code, consolidate duplicate logic, and add meaningful variable names. Don't change any functionality.\" Claude cleans house without breaking things.",
      },
      {
        type: "prompt-card",
        phrase: "Document everything",
        explanation: "\"Read through this entire project and create documentation: a README.md with setup instructions, a summary of each file's purpose, and inline comments for complex functions.\" Claude turns undocumented code into a well-documented project.",
      },
      {
        type: "concept",
        title: "The compound effect",
        text: "Each of these workflows would take a human developer anywhere from 30 minutes to several hours. With Claude Code, they take minutes. And you can chain them together. \"Review the code, fix issues, write tests, update documentation, and commit everything.\" That's potentially a full day's work in a single prompt.",
      },
      {
        type: "tip",
        text: "Start with smaller workflow chains and build up. A three-step workflow is easier to verify than a ten-step one. Once you're confident Claude handles the smaller chains correctly, you can combine them into larger workflows.",
      },
    ],
  },
  "5-2": {
    lessonId: "5-2",
    blocks: [
      {
        type: "heading",
        text: "Working With GitHub",
      },
      {
        type: "paragraph",
        text: "GitHub is where developers store, share, and collaborate on code. Think of it as Google Drive for code projects, but with powerful version tracking built in. Claude Code works seamlessly with GitHub, and this lesson will teach you the basics.",
      },
      {
        type: "concept",
        title: "Git vs. GitHub",
        text: "Git is the tool that tracks changes to your code (the save points we learned about earlier). GitHub is a website that stores your Git projects online. Think of Git as the save system and GitHub as the cloud storage. You use Git locally on your computer, and GitHub to share your work and keep a backup.",
      },
      {
        type: "subheading",
        text: "The Basic GitHub Workflow",
      },
      {
        type: "step",
        number: 1,
        title: "Initialize your project with Git",
        text: "If you haven't already:",
      },
      {
        type: "code",
        code: "Initialize a git repository for this project",
        language: "text",
        label: "Ask Claude to set up Git",
      },
      {
        type: "step",
        number: 2,
        title: "Create a branch for new features",
        text: "Branches let you work on new features without risking the main version of your project:",
      },
      {
        type: "code",
        code: "Create a new branch called feature/dark-mode and\nswitch to it",
        language: "text",
        label: "Creating a feature branch",
      },
      {
        type: "paragraph",
        text: "A branch is like creating a copy of your project to experiment on. If the experiment works, you merge it back. If it doesn't, you throw the copy away. The original is never at risk.",
      },
      {
        type: "step",
        number: 3,
        title: "Commit your changes",
        text: "Save your progress with a meaningful message:",
      },
      {
        type: "code",
        code: "Commit all the current changes with a descriptive\ncommit message that explains what was added",
        language: "text",
        label: "Committing changes",
      },
      {
        type: "step",
        number: 4,
        title: "Push to GitHub",
        text: "Upload your local changes to GitHub so they're backed up and shareable:",
      },
      {
        type: "code",
        code: "Push this branch to GitHub",
        language: "text",
        label: "Pushing to GitHub",
      },
      {
        type: "subheading",
        text: "Useful Git Prompts for Claude Code",
      },
      {
        type: "prompt-card",
        phrase: "Show me what changed since the last commit",
        explanation: "Claude will run git diff and summarize the changes in plain English. Great for reviewing before you commit.",
      },
      {
        type: "prompt-card",
        phrase: "Merge the feature branch back into main",
        explanation: "When your feature is done and tested, Claude will merge it back into the main branch, handling any conflicts that arise.",
      },
      {
        type: "tip",
        text: "You don't need to memorize Git commands. Just describe what you want in plain English and Claude Code handles the Git operations. \"Save my progress\", \"create a new branch for the login feature\", \"undo the last commit\" — Claude understands all of these.",
      },
    ],
  },
  "5-3": {
    lessonId: "5-3",
    blocks: [
      {
        type: "heading",
        text: "Custom Slash Commands",
      },
      {
        type: "paragraph",
        text: "Remember the slash commands we learned about, like /help and /clear? You can create your own. Custom slash commands are shortcuts for prompts and workflows that you use repeatedly. Instead of typing out a long prompt every time, you type one short command.",
      },
      {
        type: "subheading",
        text: "How Custom Commands Work",
      },
      {
        type: "paragraph",
        text: "Custom commands are stored in a special folder in your project: .claude/commands/. Each command is a simple Markdown file. The file name becomes the command name, and the file contents become the prompt that Claude receives.",
      },
      {
        type: "step",
        number: 1,
        title: "Create the commands folder",
        text: "",
      },
      {
        type: "code",
        code: "mkdir -p .claude/commands",
        language: "bash",
        label: "Set up the commands directory",
      },
      {
        type: "step",
        number: 2,
        title: "Create a command file",
        text: "Let's create a /review command that checks your code for issues:",
      },
      {
        type: "code",
        code: "# .claude/commands/review.md\n\nReview the current codebase for:\n1. Bugs and potential errors\n2. Security vulnerabilities\n3. Performance issues\n4. Code that could be simplified\n\nFor each issue found, explain the problem in plain English\nand provide the fix. Organize your findings by severity\n(critical, moderate, minor).",
        language: "markdown",
        label: "A custom /review command",
      },
      {
        type: "paragraph",
        text: "Now, during any Claude Code session in this project, you can just type /review and Claude will execute that entire prompt.",
      },
      {
        type: "subheading",
        text: "More Example Commands",
      },
      {
        type: "code",
        code: "# .claude/commands/deploy-check.md\n\nBefore deploying, check the following:\n1. Run all tests and report results\n2. Check for any console.log statements that should be removed\n3. Verify all environment variables are properly configured\n4. Make sure there are no hardcoded API keys or secrets\n5. Check that the build completes without errors\n\nGive me a go/no-go recommendation with your findings.",
        language: "markdown",
        label: "A custom /deploy-check command",
      },
      {
        type: "code",
        code: "# .claude/commands/summarize.md\n\nRead through this entire project and provide:\n1. A one-paragraph project summary\n2. The tech stack being used\n3. A list of all major features\n4. The file structure with a one-line description of each key file\n5. Any areas that could be improved",
        language: "markdown",
        label: "A custom /summarize command",
      },
      {
        type: "concept",
        title: "Build your own toolkit",
        text: "Custom commands are like building your own toolbox. Over time, you'll develop a collection of commands tailored to your specific workflow. Code review, deployment checks, documentation generation, testing routines — anything you do more than once is a candidate for a custom command.",
      },
      {
        type: "tip",
        text: "Start by noticing which prompts you type repeatedly. The first time you catch yourself retyping something, that's your signal to turn it into a custom command. It takes 30 seconds to create one and saves time forever after.",
      },
    ],
  },
  "5-4": {
    lessonId: "5-4",
    blocks: [
      {
        type: "heading",
        text: "Tips From Power Users",
      },
      {
        type: "paragraph",
        text: "These tips come from people who use Claude Code every day to build real products. Each one is a small insight that, taken together, dramatically improves your effectiveness.",
      },
      {
        type: "prompt-card",
        phrase: "Keep prompts focused",
        explanation: "For complex work, resist the urge to ask for everything at once. \"Add authentication, a dashboard, email notifications, and an admin panel\" is too much for one prompt. Break it into individual tasks. Claude does its best work when focused on one thing at a time.",
      },
      {
        type: "prompt-card",
        phrase: "Use Claude to write tests",
        explanation: "\"Write tests for the user registration flow\" is one of the most valuable prompts you can learn. Tests catch bugs before users do. And Claude is excellent at thinking about edge cases you might miss.",
      },
      {
        type: "prompt-card",
        phrase: "Ask Claude to refactor messy code",
        explanation: "\"This file is getting too long and complicated. Refactor it into smaller, well-organized functions without changing any behavior.\" Claude excels at restructuring code while preserving functionality.",
      },
      {
        type: "prompt-card",
        phrase: "Let Claude write your documentation",
        explanation: "\"Write a README.md that explains how to set up this project, what it does, and how to use it.\" Documentation is one of those tasks that always gets postponed. Let Claude handle it.",
      },
      {
        type: "prompt-card",
        phrase: "Security review on demand",
        explanation: "\"Review this project for security vulnerabilities, especially around user input handling and data storage.\" Claude knows common security pitfalls and can spot issues that might not be obvious to you.",
      },
      {
        type: "prompt-card",
        phrase: "Start with CLAUDE.md",
        explanation: "When beginning a big project, have Claude create the CLAUDE.md file first. This forces you to think through the project's architecture before any code is written, and gives Claude a reference document for every future session.",
      },
      {
        type: "divider",
      },
      {
        type: "subheading",
        text: "The Power User Mindset",
      },
      {
        type: "concept",
        title: "Think like a project manager, not a coder",
        text: "The best Claude Code users think about what needs to be built, not how to build it. They spend their mental energy on clear descriptions, thoughtful review, and smart iteration. They treat Claude as a capable team member and focus on direction, not implementation details.",
      },
      {
        type: "tip",
        text: "The single best habit you can develop: after Claude makes changes, take 30 seconds to review them before moving on. This one practice prevents 90% of the issues that lead to frustration. Trust, but verify.",
      },
    ],
  },
  "5-5": {
    lessonId: "5-5",
    blocks: [
      {
        type: "heading",
        text: "Where to Go From Here",
      },
      {
        type: "paragraph",
        text: "You've made it through the entire Claude Code Academy. That's not a small thing. You started knowing nothing about coding or command lines, and now you have the skills to build real software through conversation. Let's talk about what comes next.",
      },
      {
        type: "subheading",
        text: "Resources to Explore",
      },
      {
        type: "step",
        number: 1,
        title: "Claude Code Documentation",
        text: "The official documentation at docs.anthropic.com covers every feature in detail. Now that you understand the fundamentals, the docs will make much more sense. Use them as a reference when you want to go deeper on a specific feature.",
      },
      {
        type: "step",
        number: 2,
        title: "Anthropic's Prompt Engineering Guide",
        text: "Anthropic publishes a guide specifically about writing effective prompts. Since prompting is the core skill of Claude Code, leveling up your prompting skills directly translates to better results.",
      },
      {
        type: "step",
        number: 3,
        title: "Community Forums and Discussions",
        text: "Connect with other Claude Code users. Share what you've built, ask questions, and learn from how others approach problems. The community is growing fast and is full of creative people doing impressive things.",
      },
      {
        type: "divider",
      },
      {
        type: "subheading",
        text: "The Challenge",
      },
      {
        type: "concept",
        title: "Build something you've always wanted",
        text: "Here's your graduation challenge: think of something you've always wanted but didn't know how to build. A tool for your business. A personal project you've daydreamed about. An app that solves a problem you face every day. Now build it. You have the skills. Start with a plan, build step by step, and iterate until it's real. The only limit is your imagination.",
      },
      {
        type: "paragraph",
        text: "Some ideas to spark your imagination:",
      },
      {
        type: "checklist",
        items: [
          "A custom dashboard that tracks metrics you care about",
          "A tool that automates a tedious part of your job",
          "A personal website that genuinely represents who you are",
          "An app for your hobby: recipe manager, workout tracker, reading list",
          "A simple tool that you wish existed but nobody has built yet",
        ],
      },
      {
        type: "paragraph",
        text: "Whatever you choose, start small, use the planning pattern from Level 4, and build iteratively. The skills you've learned in this course will carry you further than you think.",
      },
      {
        type: "divider",
      },
      {
        type: "concept",
        title: "You've earned this",
        text: "Completing Claude Code Academy means you've gone from absolute beginner to someone who can confidently build software with AI. You understand the terminal, you write effective prompts, you iterate and refine, you handle errors, and you know the advanced patterns that power users rely on. That's a real skill that very few people have right now.",
      },
      {
        type: "tip",
        text: "The best way to solidify everything you've learned is to build something real. Don't wait for the perfect idea. Start with a good-enough idea and let Claude Code help you make it great. You'll be surprised at what you can create.",
      },
    ],
  },
};

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContent[lessonId];
}
