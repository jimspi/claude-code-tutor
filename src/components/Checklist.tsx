interface ChecklistProps {
  items: string[];
}

export default function Checklist({ items }: ChecklistProps) {
  return (
    <div className="my-5 space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mt-0.5">
            <svg
              className="w-3 h-3 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">{item}</p>
        </div>
      ))}
    </div>
  );
}
