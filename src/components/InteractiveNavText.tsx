import React from "react";

interface InteractiveNavTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
}

/**
 * InteractiveNavText splits text into individual characters with
 * fluid letter-by-letter tracking, zooming animation, and champagne gold color shifts on hover,
 * plus responsive touch-zoom feedback on mobile view.
 */
export default function InteractiveNavText({
  text,
  className = "",
  letterClassName = "",
}: InteractiveNavTextProps) {
  return (
    <span className={`nav-letter-tracker inline-flex items-center flex-wrap ${className}`}>
      {text.split("").map((char, index) => {
        if (char === " ") {
          return (
            <span key={index} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={index}
            className={`letter-char inline-block transition-all duration-200 ease-out hover:scale-125 hover:-translate-y-0.5 hover:text-[#C9A227] active:scale-115 active:text-[#B89222] ${letterClassName}`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
