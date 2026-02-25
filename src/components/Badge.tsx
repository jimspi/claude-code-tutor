"use client";

interface BadgeProps {
  title: string;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Badge({ title, earned = false, size = "md" }: BadgeProps) {
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  if (!earned) {
    return (
      <span
        className={`inline-flex items-center ${sizes[size]} rounded-full border border-stone-300 bg-stone-100 text-stone-400 font-medium`}
      >
        <span className="w-2 h-2 rounded-full bg-stone-300 mr-2" />
        {title}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${sizes[size]} rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-semibold shadow-sm`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
      {title}
    </span>
  );
}
