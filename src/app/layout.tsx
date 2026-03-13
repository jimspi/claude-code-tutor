import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3, Fira_Code } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AccessProvider } from "@/contexts/AccessContext";
import { ProgressProvider } from "@/contexts/ProgressProvider";

const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Claude Code Academy — Learn to Build with AI",
  description:
    "A step-by-step interactive learning platform that teaches you how to use Claude Code, from absolute beginner to confident builder.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${heading.variable} ${body.variable} ${mono.variable} font-body antialiased text-stone-800`}
      >
        <AccessProvider>
          <ProgressProvider>
            <AppShell>{children}</AppShell>
          </ProgressProvider>
        </AccessProvider>
      </body>
    </html>
  );
}
