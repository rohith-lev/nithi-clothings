import React from "react";

interface InteractiveNavTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
}

/**
 * Clean, standard navigation typography without excessive tracking or letter jumping,
 * ensuring high readability across mobile and desktop.
 */
export default function InteractiveNavText({
  text,
  className = "",
}: InteractiveNavTextProps) {
  return (
    <span className={`inline-block tracking-normal font-medium transition-colors hover:text-[#064E3B] ${className}`}>
      {text}
    </span>
  );
}
