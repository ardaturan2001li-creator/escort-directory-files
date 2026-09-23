'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ModelPhotoGalleryProps {
  name: string;
  cityName: string;
  countryName: string;
  age: number;
  hair: string;
  bust: string;
  photos: string[];
  realPics?: boolean;
  hasVideo?: boolean;
  isPornstar?: boolean;
}

export default function ModelPhotoGallery({
  name,
  cityName,
  countryName,
  age,
  hair,
  bust,
  photos = [],
  realPics = true,
  hasVideo = false,
  isPornstar = false,
}: ModelPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchMoved = useRef(false);

  const totalPhotos = photos.length;

  const nextPhoto = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevPhoto = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  // Touch Swipe Handlers for Mobile (pure horizontal slide inside this one box)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    touchMoved.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchMoved.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && touchEndX.current !== null && touchMoved.current) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 30) {
        // Swiped Left -> Next photo
        nextPhoto();
      } else if (diff < -30) {
        // Swiped Right -> Prev photo
        prevPhoto();
      }
    } else if (!touchMoved.current) {
      // Tap on image without drag: left half goes back, right half goes forward
      const rect = e.currentTarget.getBoundingClientRect();
      const tapX = (touchStartX.current || 0) - rect.left;
      if (tapX < rect.width / 3) {
        prevPhoto();
      } else {
        nextPhoto();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    touchMoved.current = false;
  };

  // Mouse click handler for desktop (left 1/3 goes back, right 2/3 goes forward)
  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 3) {
      prevPhoto();
    } else {
      nextPhoto();
    }
  };

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPhoto, prevPhoto]);

  if (totalPhotos === 0) {
    return (
      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 shadow-2xl flex flex-col items-center justify-center text-center p-8">
        <div className="w-32 h-32 rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
          {name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-white mt-4">{name}</h2>
        <p className="text-xs text-neutral-400">{cityName}, {countryName}</p>
      </div>
    );
  }

  const currentPhoto = photos[activeIndex] || photos[0];

  return (
    <div className="w-full">
      {/* 
        SINGLE PHOTO BOX ONLY — No popups, no modals, no second boxes!
        Photos slide purely left/right inside this single box.
      */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBoxClick}
        className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group select-none cursor-pointer"
      >
        {/* Active Image */}
        <img
          key={currentPhoto}
          src={currentPhoto}
          alt={`${name} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/35 pointer-events-none" />

        {/* Badges Overlay (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
            ★ VIP VERIFIED
          </span>
          {realPics && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold backdrop-blur-md">
              ✓ 100% Real Pics
            </span>
          )}
          {hasVideo && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-400 text-[10px] font-bold backdrop-blur-md">
              🎥 Video
            </span>
          )}
          {isPornstar && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-400 text-[10px] font-bold backdrop-blur-md">
              🔞 Pornstar
            </span>
          )}
        </div>

        {/* Photo Counter + Dots Indicator (Top Right) */}
        {totalPhotos > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-lg"
          >
            <span className="text-[11px] font-bold text-white mr-1">
              {activeIndex + 1}/{totalPhotos}
            </span>
            <div className="flex items-center gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className={`transition-all rounded-full ${
                    i === activeIndex
                      ? 'w-3.5 h-1.5 bg-red-500'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Left Arrow Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={prevPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/65 hover:bg-red-600 border border-white/25 text-white flex items-center justify-center text-2xl font-bold backdrop-blur-md shadow-2xl transition-all active:scale-90 hover:scale-110"
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        {/* Right Arrow Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={nextPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/65 hover:bg-red-600 border border-white/25 text-white flex items-center justify-center text-2xl font-bold backdrop-blur-md shadow-2xl transition-all active:scale-90 hover:scale-110"
            aria-label="Next photo"
          >
            ›
          </button>
        )}

        {/* Model Info Inside the Box (Bottom) */}
        <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-0.5 drop-shadow-md">
            {cityName}, {countryName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-lg truncate">
            {name}
          </h1>
          <div className="text-xs text-neutral-300 mt-1 flex items-center gap-2 drop-shadow-md">
            <span>{age} yrs</span>
            <span>&bull;</span>
            <span>{hair ? hair.toUpperCase() : 'BRUNETTE'}</span>
            <span>&bull;</span>
            <span>{bust || 'NATURAL'}</span>
          </div>

          {/* Slider Hint */}
          {totalPhotos > 1 && (
            <div className="text-[10px] text-neutral-400 font-medium mt-1.5 flex items-center gap-1.5 opacity-80">
              <span>↔ Sağa / Sola kaydır veya dokun</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
