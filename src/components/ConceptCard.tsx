interface ConceptCardProps {
  title: string;
  text: string;
}

export default function ConceptCard({ title, text }: ConceptCardProps) {
  return (
    <div className="my-6 rounded-xl border-l-4 border-teal-500 bg-teal-50/60 p-5 shadow-sm">
      <h4 className="font-heading text-base font-bold text-slate-900 mb-2">
        {title}
      </h4>
      <p className="text-stone-700 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
