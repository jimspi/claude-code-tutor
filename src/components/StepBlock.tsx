interface StepBlockProps {
  number: number;
  title: string;
  text: string;
}

export default function StepBlock({ number, title, text }: StepBlockProps) {
  return (
    <div className="my-4 flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{number}</span>
      </div>
      <div className="pt-0.5">
        <h4 className="font-heading text-base font-bold text-slate-900">
          {title}
        </h4>
        {text && (
          <p className="text-sm text-stone-600 leading-relaxed mt-1">{text}</p>
        )}
      </div>
    </div>
  );
}
