interface FreeShippingProgressProps {
  cartTotal: number;
  threshold?: number;
  freeShippingUnlocked?: boolean;
}

export default function FreeShippingProgress({
  cartTotal,
  threshold = 999,
  freeShippingUnlocked,
}: FreeShippingProgressProps) {
  const isUnlocked = freeShippingUnlocked || cartTotal >= threshold;
  const remaining = Math.max(0, threshold - cartTotal);
  const percentage = Math.min(100, Math.round((cartTotal / threshold) * 100));

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] p-4 font-body shadow-xs">
      <div className="flex items-center justify-between text-xs mb-2.5">
        {isUnlocked ? (
          <span className="font-bold text-[#064E3B] flex items-center gap-1.5">
            <span>🎉</span>
            <span>You've unlocked Free Express Shipping!</span>
          </span>
        ) : (
          <span className="font-medium text-[#171A18]">
            Add <strong className="text-[#064E3B] font-bold">₹{remaining.toLocaleString("en-IN")}</strong> more to unlock <span className="font-bold text-[#C9A227]">FREE Express Shipping</span>
          </span>
        )}
        <span className="font-mono font-bold text-xs text-[#5C635E]">
          {isUnlocked ? "100%" : `${percentage}%`}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#F3EFE3]">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isUnlocked ? "bg-gradient-to-r from-[#064E3B] to-[#C9A227]" : "bg-[#064E3B]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
