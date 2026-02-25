"use client";

interface ProgressBarProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  color?: "gold" | "teal";
}

export default function ProgressBar({
  percentage,
  size = "md",
  showLabel = false,
  color = "gold",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heights: Record<string, string> = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const bgColors: Record<string, string> = {
    gold: "bg-amber-500",
    teal: "bg-teal-600",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-stone-500">Progress</span>
          <span className="text-xs font-semibold text-stone-700">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} bg-stone-200 rounded-full overflow-hidden`}
      >
        <div
          className={`${heights[size]} ${bgColors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
