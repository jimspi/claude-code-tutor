interface TipBlockProps {
  text: string;
}

export default function TipBlock({ text }: TipBlockProps) {
  return (
    <div className="my-6 rounded-xl bg-amber-50 border border-amber-200 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center mt-0.5">
          <svg
            className="w-3.5 h-3.5 text-amber-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
