interface ComparisonCardProps {
  left: { title: string; text: string };
  right: { title: string; text: string };
}

export default function ComparisonCard({ left, right }: ComparisonCardProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
      <div className="p-5 bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200">
        <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
          {left.title}
        </h4>
        <p className="text-stone-700 text-sm leading-relaxed">{left.text}</p>
      </div>
      <div className="p-5 bg-teal-50/50">
        <h4 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-3">
          {right.title}
        </h4>
        <p className="text-stone-700 text-sm leading-relaxed">{right.text}</p>
      </div>
    </div>
  );
}
