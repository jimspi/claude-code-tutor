interface FlowChartNode {
  id: string;
  text: string;
  yes?: string;
  no?: string;
  next?: string;
}

interface FlowChartProps {
  nodes: FlowChartNode[];
}

export default function FlowChart({ nodes }: FlowChartProps) {
  return (
    <div className="my-6 p-6 bg-stone-50 rounded-xl border border-stone-200">
      <div className="space-y-4">
        {nodes.map((node, i) => {
          const isDecision = node.yes || node.no;
          const isTerminal = !node.yes && !node.no && !node.next;

          return (
            <div key={node.id} className="flex flex-col items-center">
              <div
                className={`w-full max-w-md p-4 rounded-xl text-center text-sm font-medium shadow-sm ${
                  isTerminal
                    ? "bg-teal-100 text-teal-800 border border-teal-200"
                    : isDecision
                    ? "bg-amber-50 text-amber-900 border border-amber-200"
                    : "bg-white text-slate-800 border border-stone-200"
                }`}
              >
                {node.text}
                {isDecision && (
                  <div className="flex justify-center gap-6 mt-3 text-xs">
                    {node.yes && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                        Yes
                      </span>
                    )}
                    {node.no && (
                      <span className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded-full">
                        No
                      </span>
                    )}
                  </div>
                )}
              </div>
              {i < nodes.length - 1 && (
                <div className="w-px h-6 bg-stone-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
