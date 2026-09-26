import { Link } from "react-router";
import logoImg from "../assets/nithi-logo.jpg";

interface BrandLogoProps {
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  emblemOnly?: boolean;
  className?: string;
}

export default function BrandLogo({
  variant = "dark",
  size = "md",
  showTagline = true,
  emblemOnly = false,
  className = "",
}: BrandLogoProps) {
  const isLight = variant === "light";
  const isGoldOnly = variant === "gold";

  const primaryTextColor = isGoldOnly
    ? "text-[#C9A227]"
    : isLight
    ? "text-[#FAF8F1]"
    : "text-[#064E3B]";

  const sizeConfig = {
    sm: {
      img: "h-8 w-8 sm:h-9 sm:w-9",
      fullImg: "h-8 sm:h-9 max-w-[140px]",
      title: "text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.16em]",
      tagline: "text-[7.5px] sm:text-[8px] tracking-[0.16em] sm:tracking-[0.22em]",
      gap: "gap-2 sm:gap-2.5",
    },
    md: {
      img: "h-9 w-9 sm:h-11 sm:w-11",
      fullImg: "h-9 sm:h-11 max-w-[140px] sm:max-w-[170px]",
      title: "text-[15px] sm:text-lg lg:text-xl tracking-[0.12em] sm:tracking-[0.18em]",
      tagline: "text-[7.5px] sm:text-[9px] lg:text-[10px] tracking-[0.16em] sm:tracking-[0.26em]",
      gap: "gap-2 sm:gap-3",
    },
    lg: {
      img: "h-11 w-11 sm:h-14 sm:w-14",
      fullImg: "h-11 sm:h-14 max-w-[170px] sm:max-w-[210px]",
      title: "text-xl sm:text-2xl lg:text-3xl tracking-[0.16em] sm:tracking-[0.22em]",
      tagline: "text-[8.5px] sm:text-[10px] lg:text-xs tracking-[0.2em] sm:tracking-[0.3em]",
      gap: "gap-2.5 sm:gap-3.5",
    },
    xl: {
      img: "h-16 w-16 sm:h-20 sm:w-20",
      fullImg: "h-16 sm:h-20 max-w-[220px] sm:max-w-[280px]",
      title: "text-2xl sm:text-3xl lg:text-4xl tracking-[0.18em] sm:tracking-[0.24em]",
      tagline: "text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.32em]",
      gap: "gap-3 sm:gap-4",
    },
  }[size];

  return (
    <Link
      to="/"
      className={`inline-flex items-center min-w-0 ${sizeConfig.gap} group select-none ${className}`}
    >
      {/* Official Brand Monogram & Crest Logo */}
      <div
        className={`relative ${sizeConfig.img} rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-sm border ${
          isLight
            ? "border-[#C9A227]/40 ring-2 ring-[#C9A227]/20 bg-white"
            : "border-[#064E3B]/20 ring-1 ring-[#C9A227]/30 bg-white"
        } transition-transform duration-300 group-hover:scale-105 p-0.5`}
      >
        <img
          src={typeof logoImg === "string" ? logoImg : (logoImg as { src?: string })?.src || ""}
          alt="Nithi Collection Logo"
          className="w-full h-full object-contain object-center"
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      {!emblemOnly && (
        <div className="flex flex-col justify-center leading-none min-w-0">
          <span
            className={`font-display font-bold uppercase whitespace-nowrap text-[13px] xs:text-sm sm:text-base lg:text-xl tracking-[0.08em] xs:tracking-[0.12em] sm:tracking-[0.16em] lg:tracking-[0.18em] ${primaryTextColor} transition-colors group-hover:text-[#C9A227]`}
          >
            Nithi Collection
          </span>
          {showTagline && (
            <span
              className={`hidden sm:flex font-body uppercase font-medium mt-1 ${sizeConfig.tagline} text-[#C9A227] items-center gap-1 sm:gap-1.5 whitespace-nowrap`}
            >
              <span className="w-1.5 sm:w-2.5 h-[1px] bg-[#C9A227]/60" />
              <span>Her Elegance, Our Signature</span>
              <span className="w-1.5 sm:w-2.5 h-[1px] bg-[#C9A227]/60" />
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
