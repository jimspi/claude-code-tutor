interface PromptCardProps {
  phrase: string;
  explanation: string;
}

export default function PromptCard({ phrase, explanation }: PromptCardProps) {
  return (
    <div className="my-4 group rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mt-0.5">
          <svg
            className="w-4 h-4 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900 mb-1.5 group-hover:text-amber-700 transition-colors">
            &quot;{phrase}&quot;
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
