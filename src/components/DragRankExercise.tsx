"use client";

import { useState, useMemo } from "react";

interface DragRankItem {
  id: string;
  text: string;
}

interface DragRankExerciseProps {
  instruction: string;
  items: DragRankItem[];
  correctOrder: string[];
  feedback: string;
}

function shuffleWithSeed(arr: DragRankItem[], seed: string): DragRankItem[] {
  const copy = [...arr];
  // Simple deterministic shuffle based on seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Make sure it's not already in correct order
  const isCorrect = copy.every((item, idx) => item.id === arr[idx]?.id);
  if (isCorrect && copy.length > 1) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export default function DragRankExercise({
  instruction,
  items,
  correctOrder,
  feedback,
}: DragRankExerciseProps) {
  const shuffled = useMemo(
    () => shuffleWithSeed(items, instruction),
    [items, instruction]
  );

  const [order, setOrder] = useState<DragRankItem[]>(shuffled);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveItem = (fromIndex: number, direction: "up" | "down") => {
    if (submitted) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= order.length) return;

    const newOrder = [...order];
    [newOrder[fromIndex], newOrder[toIndex]] = [
      newOrder[toIndex],
      newOrder[fromIndex],
    ];
    setOrder(newOrder);
  };

  const checkAnswer = () => {
    const currentIds = order.map((item) => item.id);
    const correct = currentIds.every((id, i) => id === correctOrder[i]);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const tryAgain = () => {
    setSubmitted(false);
    setIsCorrect(false);
  };

  const getItemStatus = (item: DragRankItem, index: number) => {
    if (!submitted) return "neutral";
    return item.id === correctOrder[index] ? "correct" : "incorrect";
  };

  return (
    <div className="my-6 rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Put It In Order
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm font-semibold text-slate-800 mb-4">
          {instruction}
        </p>

        {/* Items */}
        <div className="space-y-2 mb-5">
          {order.map((item, index) => {
            const status = getItemStatus(item, index);
            let borderClass = "border-stone-200 bg-stone-50";
            if (status === "correct")
              borderClass = "border-teal-400 bg-teal-50";
            if (status === "incorrect")
              borderClass = "border-red-300 bg-red-50";

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${borderClass}`}
              >
                {/* Rank number */}
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    status === "correct"
                      ? "bg-teal-500 text-white"
                      : status === "incorrect"
                      ? "bg-red-400 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {status === "correct" ? (
                    <svg
                      className="w-3.5 h-3.5"
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
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Text */}
                <p className="flex-1 text-sm text-slate-700 min-w-0">
                  {item.text}
                </p>

                {/* Move buttons */}
                {!submitted && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        index === 0
                          ? "text-stone-300 cursor-default"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-500"
                      }`}
                      aria-label="Move up"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === order.length - 1}
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        index === order.length - 1
                          ? "text-stone-300 cursor-default"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-500"
                      }`}
                      aria-label="Move down"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {!submitted ? (
          <button
            onClick={checkAnswer}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Check Order
          </button>
        ) : isCorrect ? (
          <div className="rounded-lg bg-teal-50 border border-teal-200 p-4">
            <p className="text-sm font-semibold text-teal-800 mb-1">
              Perfect order!
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">
              {feedback}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Not quite right
              </p>
              <p className="text-sm text-stone-600">
                Items highlighted in green are in the correct position. Try
                rearranging the red ones.
              </p>
            </div>
            <button
              onClick={tryAgain}
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
