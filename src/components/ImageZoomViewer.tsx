import { useState, useRef, useEffect, useCallback } from "react";

interface ImageZoomViewerProps {
  images: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  alt: string;
}

const FALLBACK_ZOOM_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&fit=crop";

export default function ImageZoomViewer({
  images,
  selectedIndex,
  onSelectIndex,
  alt,
}: ImageZoomViewerProps) {
  const rawImage = images[selectedIndex] || images[0] || FALLBACK_ZOOM_IMG;
  const currentImage =
    rawImage && !rawImage.startsWith("blob:") && !rawImage.includes("__LOCAL_")
      ? rawImage
      : FALLBACK_ZOOM_IMG;

  // Desktop Hover Magnifier State
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile Fullscreen Modal State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [fullscreenZoomed, setFullscreenZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    onSelectIndex((selectedIndex + 1) % images.length);
  }, [images.length, onSelectIndex, selectedIndex]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    onSelectIndex((selectedIndex - 1 + images.length) % images.length);
  }, [images.length, onSelectIndex, selectedIndex]);

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextImage();
    } else if (diff < -50) {
      prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Viewport with Desktop Lens Zoom */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFullscreen(true)}
        className="relative aspect-[4/5] sm:aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E8E2D5] bg-[#F3EFE3] group shadow-sm"
      >
        <img
          src={currentImage}
          alt={alt}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_ZOOM_IMG;
          }}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            isHovering ? "scale-100 opacity-0 md:opacity-0" : "opacity-100"
          }`}
          loading="eager"
        />

        {/* Desktop Smooth Follow Magnifier Viewport */}
        {isHovering && (
          <div
            className="hidden md:block absolute inset-0 bg-no-repeat pointer-events-none transition-all duration-75 ease-out"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              backgroundSize: "240%",
            }}
          />
        )}

        {/* Floating Zoom Hint Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-[#171A18]/70 px-3 py-1 text-[10px] font-medium text-[#FAF8F1] backdrop-blur-xs transition-opacity duration-200 group-hover:bg-[#064E3B]">
          <svg className="w-3.5 h-3.5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <span className="hidden sm:inline">Hover to Zoom / Tap for Fullscreen</span>
          <span className="sm:hidden">Tap to Zoom</span>
        </div>

        {/* Navigation Arrows overlay on main image */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF]/80 text-[#171A18] shadow-md hover:bg-[#FFFFFF] hover:text-[#064E3B] transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF]/80 text-[#171A18] shadow-md hover:bg-[#FFFFFF] hover:text-[#064E3B] transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative aspect-[3/4] w-16 sm:w-20 shrink-0 overflow-hidden rounded-xl border transition-all shadow-2xs ${
                selectedIndex === idx
                  ? "border-[#064E3B] ring-2 ring-[#C9A227]"
                  : "border-[#E8E2D5] opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${alt} view ${idx + 1}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_ZOOM_IMG;
                }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* FULLSCREEN MOBILE & DESKTOP GALLERY MODAL */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#171A18]/95 backdrop-blur-md p-4 sm:p-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between text-[#FAF8F1] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Photo {selectedIndex + 1} of {images.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFullscreenZoomed(!fullscreenZoomed)}
                className="rounded-full border border-[#FAF8F1]/30 px-3 py-1 text-xs text-[#FAF8F1] hover:border-[#C9A227] transition-colors"
              >
                {fullscreenZoomed ? "Reset Zoom" : "2x Zoom"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  setFullscreenZoomed(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F1]/10 text-xl font-bold text-[#FAF8F1] hover:bg-[#C9A227] hover:text-[#171A18] transition-colors"
                aria-label="Close fullscreen gallery"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Fullscreen Image Area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={currentImage}
              alt={alt}
              className={`max-h-full max-w-full object-contain transition-transform duration-300 select-none ${
                fullscreenZoomed ? "scale-150 cursor-grab" : "scale-100 cursor-zoom-in"
              }`}
              onClick={() => setFullscreenZoomed(!fullscreenZoomed)}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#171A18]/80 border border-[#FAF8F1]/30 text-[#FAF8F1] hover:bg-[#C9A227] hover:text-[#171A18] transition-colors shadow-md"
                  aria-label="Previous image"
                >
                  ❮
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#171A18]/80 border border-[#FAF8F1]/30 text-[#FAF8F1] hover:bg-[#C9A227] hover:text-[#171A18] transition-colors shadow-md"
                  aria-label="Next image"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 pt-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={`h-12 w-10 sm:h-16 sm:w-12 rounded-lg overflow-hidden border transition-all ${
                    selectedIndex === idx
                      ? "border-[#C9A227] ring-2 ring-[#C9A227]"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
