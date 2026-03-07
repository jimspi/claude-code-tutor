"use client";

import { useState, useMemo } from "react";
import { reviewCards } from "@/data/reviewCards";
import type { ReviewCard } from "@/data/reviewCards";

interface QuickReviewProps {
  completedLessons: string[];
}

export default function QuickReview({ completedLessons }: QuickReviewProps) {
  // Only show cards for completed lessons, pick 3 random ones
  const cards = useMemo(() => {
    const eligible = reviewCards.filter((c) =>
      completedLessons.includes(c.lessonId)
    );
    if (eligible.length === 0) return [];
    // Shuffle and pick up to 3
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [completedLessons]);

  if (cards.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
        Quick Review
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => (
          <FlashCard key={card.question} card={card} />
        ))}
      </div>
    </div>
  );
}

function FlashCard({ card }: { card: ReviewCard }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      onClick={() => setRevealed(!revealed)}
      className="text-left p-4 rounded-xl border border-stone-200 bg-white hover:shadow-md transition-all min-h-[120px] flex flex-col"
    >
      <p className="text-sm font-semibold text-slate-900 mb-2">
        {card.question}
      </p>
      {revealed ? (
        <p className="text-sm text-teal-700 leading-relaxed mt-auto">
          {card.answer}
        </p>
      ) : (
        <p className="text-xs text-stone-400 mt-auto">
          Tap to reveal answer
        </p>
      )}
    </button>
  );
}
