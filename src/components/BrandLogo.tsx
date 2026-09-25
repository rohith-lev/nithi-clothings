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
      img: "h-9 w-9",
      fullImg: "h-9 max-w-[140px]",
      title: "text-base tracking-[0.16em]",
      tagline: "text-[8px] tracking-[0.22em]",
      gap: "gap-2.5",
    },
    md: {
      img: "h-11 w-11",
      fullImg: "h-11 max-w-[170px]",
      title: "text-lg lg:text-xl tracking-[0.18em]",
      tagline: "text-[9px] lg:text-[10px] tracking-[0.26em]",
      gap: "gap-3",
    },
    lg: {
      img: "h-14 w-14",
      fullImg: "h-14 max-w-[210px]",
      title: "text-2xl lg:text-3xl tracking-[0.22em]",
      tagline: "text-[10px] lg:text-xs tracking-[0.3em]",
      gap: "gap-3.5",
    },
    xl: {
      img: "h-20 w-20",
      fullImg: "h-20 max-w-[280px]",
      title: "text-3xl lg:text-4xl tracking-[0.24em]",
      tagline: "text-xs tracking-[0.32em]",
      gap: "gap-4",
    },
  }[size];

  return (
    <Link
      to="/"
      className={`inline-flex items-center ${sizeConfig.gap} group select-none ${className}`}
    >
      {/* Official Brand Monogram & Crest Logo */}
      <div
        className={`relative ${sizeConfig.img} rounded-2xl overflow-hidden shrink-0 shadow-sm border ${
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
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-display font-bold uppercase ${sizeConfig.title} ${primaryTextColor} transition-colors group-hover:text-[#C9A227]`}
          >
            Nithi Collection
          </span>
          {showTagline && (
            <span
              className={`font-body uppercase font-medium mt-1 ${sizeConfig.tagline} text-[#C9A227] flex items-center gap-1.5`}
            >
              <span className="w-2.5 h-[1px] bg-[#C9A227]/60" />
              <span>Her Elegance, Our Signature</span>
              <span className="w-2.5 h-[1px] bg-[#C9A227]/60" />
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
