"use client";

import { ContentBlock } from "@/lib/content";
import CodeBlock from "./CodeBlock";
import ComparisonCard from "./ComparisonCard";
import ConceptCard from "./ConceptCard";
import PromptCard from "./PromptCard";
import Accordion from "./Accordion";
import Checklist from "./Checklist";
import FlowChart from "./FlowChart";
import StepBlock from "./StepBlock";
import MythReality from "./MythReality";
import TerminalDemo from "./TerminalDemo";
import TipBlock from "./TipBlock";
import ExerciseBlock from "./ExerciseBlock";
import InteractiveTerminal from "./InteractiveTerminal";
import ClaudeConversation from "./ClaudeConversation";
import PromptBuilder from "./PromptBuilder";
import QuizBlock from "./QuizBlock";
import DragRankExercise from "./DragRankExercise";

interface LessonRendererProps {
  blocks: ContentBlock[];
}

export default function LessonRenderer({ blocks }: LessonRendererProps) {
  return (
    <div className="max-w-2xl">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-4 first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3
                key={i}
                className="font-heading text-lg sm:text-xl font-bold text-slate-900 mt-8 mb-3"
              >
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="text-stone-700 text-base leading-relaxed my-3"
              >
                {block.text}
              </p>
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                code={block.code}
                language={block.language}
                label={block.label}
              />
            );
          case "comparison":
            return (
              <ComparisonCard key={i} left={block.left} right={block.right} />
            );
          case "concept":
            return (
              <ConceptCard key={i} title={block.title} text={block.text} />
            );
          case "prompt-card":
            return (
              <PromptCard
                key={i}
                phrase={block.phrase}
                explanation={block.explanation}
              />
            );
          case "accordion":
            return (
              <Accordion key={i} title={block.title} content={block.content} />
            );
          case "checklist":
            return <Checklist key={i} items={block.items} />;
          case "flowchart":
            return <FlowChart key={i} nodes={block.nodes} />;
          case "step":
            return (
              <StepBlock
                key={i}
                number={block.number}
                title={block.title}
                text={block.text}
              />
            );
          case "myth-reality":
            return (
              <MythReality key={i} myth={block.myth} reality={block.reality} />
            );
          case "terminal-demo":
            return <TerminalDemo key={i} lines={block.lines} />;
          case "tip":
            return <TipBlock key={i} text={block.text} />;
          case "exercise":
            return (
              <ExerciseBlock
                key={i}
                prompt={block.prompt}
                reveal={block.reveal}
              />
            );
          case "interactive-terminal":
            return (
              <InteractiveTerminal
                key={i}
                title={block.title}
                commands={block.commands}
                allowFreeType={block.allowFreeType}
              />
            );
          case "claude-conversation":
            return (
              <ClaudeConversation
                key={i}
                title={block.title}
                steps={block.steps}
              />
            );
          case "prompt-builder":
            return (
              <PromptBuilder
                key={i}
                scenario={block.scenario}
                sections={block.sections}
                examplePrompt={block.examplePrompt}
              />
            );
          case "quiz":
            return (
              <QuizBlock
                key={i}
                question={block.question}
                options={block.options}
                correctIndex={block.correctIndex}
                explanation={block.explanation}
              />
            );
          case "drag-rank":
            return (
              <DragRankExercise
                key={i}
                instruction={block.instruction}
                items={block.items}
                correctOrder={block.correctOrder}
                feedback={block.feedback}
              />
            );
          case "divider":
            return <hr key={i} className="my-8 border-stone-200" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
